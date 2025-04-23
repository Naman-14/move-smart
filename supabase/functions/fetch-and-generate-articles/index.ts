
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GNEWS_API_KEY = Deno.env.get('GNEWS_API_KEY');
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!,
);

// Search queries to rotate through
const SEARCH_QUERIES = [
  'startups',
  'funding',
  'AI startups',
  'tech innovation'
];

// Countries to rotate through
const COUNTRIES = [
  'us', 'gb', 'in', 'de', 'sg', 'au'
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  
  try {
    // Parse request body
    const reqBody = await req.json();
    const { manualRun = false, query, country } = reqBody;
    
    console.log('Starting fetch-and-generate-articles function');
    
    // Validate API keys
    if (!GNEWS_API_KEY) {
      throw new Error('GNEWS_API_KEY environment variable is not set');
    }
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    
    // Select query and country - either from params or randomly
    const searchQuery = query || SEARCH_QUERIES[Math.floor(Math.random() * SEARCH_QUERIES.length)];
    const searchCountry = country || COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    
    console.log(`Using search query: ${searchQuery}, country: ${searchCountry}`);
    
    // Fetch articles from GNews.io
    const articlesResponse = await fetch(
      `https://gnews.io/api/v4/search?q=${searchQuery}&lang=en&country=${searchCountry}&max=5&token=${GNEWS_API_KEY}`
    );
    
    if (!articlesResponse.ok) {
      const errorText = await articlesResponse.text();
      throw new Error(`Failed to fetch articles from GNews: ${errorText}`);
    }
    
    const articlesData = await articlesResponse.json();
    const articles = articlesData.articles || [];
    
    console.log(`Fetched ${articles.length} articles from GNews`);
    
    // Create a record of this fetch - with error handling for database operations
    let fetchId;
    try {
      const { data: sourceFetch, error: sourceFetchError } = await supabase
        .from('source_fetches')
        .insert({
          source: 'gnews',
          query: searchQuery,
          country: searchCountry,
          articles_fetched: articles.length,
          articles_processed: 0,
          status: 'in_progress'
        })
        .select()
        .single();
        
      if (sourceFetchError) {
        console.error('Error creating source fetch record:', sourceFetchError);
        throw new Error(`Error creating source fetch record: ${sourceFetchError.message}`);
      }
      
      if (!sourceFetch) {
        throw new Error('Failed to create source fetch record - no data returned');
      }
      
      fetchId = sourceFetch.id;
    } catch (dbError) {
      console.error('Database error when creating source fetch:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }
    
    let processedCount = 0;
    
    // Process each article
    for (const article of articles) {
      try {
        // Check if we already have an article with this source URL
        const { data: existingArticle } = await supabase
          .from('articles')
          .select('id')
          .eq('source_url', article.url)
          .maybeSingle();
          
        if (existingArticle) {
          console.log(`Article already exists for URL: ${article.url}`);
          continue;
        }
        
        // Prepare content for AI rewriting
        const contentForAI = `
Title: ${article.title}
Description: ${article.description}
Content: ${article.content}
        `;
        
        // Use OpenAI to rewrite the article
        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are an expert content creator for a tech startup news site. Rewrite startup news articles so they sound original, human-written, engaging, and informative. Avoid direct copying. Reconstruct the structure, language, and flow of the article. Keep factual accuracy, but do not mention or credit the original source.'
              },
              {
                role: 'user',
                content: `Rewrite the following startup news article completely. Create:
1. A catchy title (max 80 chars)
2. A compelling summary (2 paragraphs)
3. A full article (800-1000 words with proper HTML formatting using <p>, <h2>, <h3>, <ul>, <li>, <strong> tags)
4. 5 relevant tags (single words, lowercase)

Also, analyze the article and determine the best category from: startup, funding, ai, fintech, case-study, climate-tech.

Format your response as JSON with these fields:
{
  "title": "Your rewritten title",
  "summary": "Your 2-paragraph summary",
  "content": "Your full HTML article",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "chosen-category"
}

Here is the article to rewrite:
${contentForAI}`
              }
            ],
            temperature: 0.7
          })
        });
        
        if (!aiResponse.ok) {
          const aiErrorText = await aiResponse.text();
          throw new Error(`OpenAI error: ${aiErrorText}`);
        }
        
        const aiResult = await aiResponse.json();
        const aiContent = aiResult.choices[0].message.content;
        
        // Parse the AI response (expecting JSON)
        let parsedAiContent;
        try {
          parsedAiContent = JSON.parse(aiContent);
        } catch (e) {
          console.error('Failed to parse AI response as JSON:', aiContent);
          throw new Error('Failed to parse AI response as JSON');
        }
        
        // Generate a slug from the title
        const { data: slugResult, error: slugError } = await supabase
          .rpc('generate_slug', { title: parsedAiContent.title });
          
        if (slugError) {
          throw new Error(`Error generating slug: ${slugError.message}`);
        }
        
        // Use the cover image from the original article or a placeholder
        const coverImageUrl = article.image || 'https://via.placeholder.com/800x450?text=MoveSmart';
        
        // Insert the rewritten article into our database
        const { data: newArticle, error: insertError } = await supabase
          .from('articles')
          .insert({
            title: parsedAiContent.title,
            slug: slugResult,
            summary: parsedAiContent.summary,
            content: parsedAiContent.content,
            cover_image_url: coverImageUrl,
            tags: parsedAiContent.tags,
            category: parsedAiContent.category,
            source_url: article.url,
            visible: !manualRun // If manual run, set to false so admin can review
          })
          .select()
          .single();
          
        if (insertError) {
          throw new Error(`Error inserting article: ${insertError.message}`);
        }
        
        console.log(`Successfully processed article: ${parsedAiContent.title}`);
        processedCount++;
        
      } catch (articleError) {
        console.error(`Error processing article:`, articleError);
      }
    }
    
    // Update the source fetch record
    try {
      const { error: updateError } = await supabase
        .from('source_fetches')
        .update({
          articles_processed: processedCount,
          status: 'completed'
        })
        .eq('id', fetchId);
        
      if (updateError) {
        console.error(`Error updating source fetch record:`, updateError);
      }
    } catch (updateError) {
      console.error(`Exception updating source fetch record:`, updateError);
    }
      
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully processed ${processedCount} of ${articles.length} articles`,
        fetchId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in fetch-and-generate-articles:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
