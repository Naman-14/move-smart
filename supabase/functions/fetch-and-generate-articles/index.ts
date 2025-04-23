
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
  'tech innovation',
  'fintech',
  'startup founders',
  'venture capital',
  'tech disruption',
  'startup ecosystem'
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
  
  // Handle health check endpoint
  const url = new URL(req.url);
  if (url.pathname.endsWith('/health')) {
    console.log("Health check endpoint called");
    
    // Check all required environment variables
    const envVars = {
      GNEWS_API_KEY: !!GNEWS_API_KEY,
      OPENAI_API_KEY: !!OPENAI_API_KEY,
      SUPABASE_URL: !!SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_SERVICE_ROLE_KEY
    };
    
    // Check supabase client
    let dbCheck = false;
    try {
      const { data, error } = await supabase.from('articles').select('id').limit(1);
      dbCheck = !error;
    } catch (e) {
      console.error("Database check failed:", e);
    }
    
    // Check if source_fetches table exists
    let tableCheck = false;
    try {
      console.log("Checking if source_fetches table exists");
      const { data, error } = await supabase
        .from('source_fetches')
        .select('id')
        .limit(1)
        .maybeSingle();
      
      tableCheck = !error || error.code !== "42P01"; // 42P01 is "undefined_table"
      
      if (error && error.code === "42P01") {
        console.error("source_fetches table doesn't exist:", error.message);
      } else if (error) {
        console.error("Error checking source_fetches table:", error.message);
      } else {
        console.log("source_fetches table exists");
      }
    } catch (e) {
      console.error("Error checking source_fetches table:", e);
    }
    
    return new Response(
      JSON.stringify({
        status: "ok",
        environment: envVars,
        database: dbCheck,
        source_fetches_table: tableCheck,
        timestamp: new Date().toISOString(),
        denoVersion: Deno.version.deno
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
  
  try {
    // Parse request body
    const reqBody = await req.json();
    const { manualRun = false, query, country, debug = false } = reqBody;
    
    console.log('Starting fetch-and-generate-articles function');
    console.log('Request body:', JSON.stringify(reqBody));
    
    // Validate API keys
    if (!GNEWS_API_KEY) {
      console.error('GNEWS_API_KEY environment variable is not set');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'GNEWS_API_KEY environment variable is not set',
          debug: debug ? { envVars: { 
            GNEWS_API_KEY: !!GNEWS_API_KEY,
            OPENAI_API_KEY: !!OPENAI_API_KEY 
          } } : undefined
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY environment variable is not set');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'OPENAI_API_KEY environment variable is not set',
          debug: debug ? { envVars: { 
            GNEWS_API_KEY: !!GNEWS_API_KEY,
            OPENAI_API_KEY: !!OPENAI_API_KEY 
          } } : undefined
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Select query and country - either from params or randomly
    const searchQuery = query || SEARCH_QUERIES[Math.floor(Math.random() * SEARCH_QUERIES.length)];
    const searchCountry = country || COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    
    console.log(`Using search query: "${searchQuery}", country: "${searchCountry}"`);
    
    // Fetch articles from GNews.io
    try {
      const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=en&country=${searchCountry}&max=5&token=${GNEWS_API_KEY}`;
      console.log(`Fetching articles from GNews API: ${gnewsUrl.replace(GNEWS_API_KEY, 'API_KEY_REDACTED')}`);
      
      const articlesResponse = await fetch(gnewsUrl);
      
      if (!articlesResponse.ok) {
        const errorText = await articlesResponse.text();
        console.error(`GNews API error: Status ${articlesResponse.status}, Response: ${errorText}`);
        throw new Error(`Failed to fetch articles from GNews: ${articlesResponse.status} ${articlesResponse.statusText}`);
      }
      
      const articlesData = await articlesResponse.json();
      
      if (!articlesData.articles || !Array.isArray(articlesData.articles)) {
        console.error(`GNews API returned invalid data:`, articlesData);
        throw new Error('GNews API returned invalid or empty data');
      }
      
      const articles = articlesData.articles || [];
      
      console.log(`Fetched ${articles.length} articles from GNews`);
      console.log(`First article:`, articles.length > 0 ? {
        title: articles[0].title,
        url: articles[0].url,
        hasImage: !!articles[0].image,
        hasContent: !!articles[0].content
      } : 'No articles');
      
      // Create a record of this fetch - with error handling for database operations
      let fetchId;
      try {
        console.log("Checking if source_fetches table exists before creating record");
        const tableCheckResponse = await supabase
          .from('source_fetches')
          .select('id')
          .limit(1);
        
        if (tableCheckResponse.error && tableCheckResponse.error.code === "42P01") {
          console.error("source_fetches table doesn't exist, creating it now");
          // Try to create the table if it doesn't exist
          const createTableQuery = `
            CREATE TABLE IF NOT EXISTS public.source_fetches (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
              source TEXT NOT NULL,
              query TEXT NOT NULL,
              country TEXT NOT NULL,
              articles_fetched INTEGER NOT NULL DEFAULT 0,
              articles_processed INTEGER NOT NULL DEFAULT 0,
              status TEXT NOT NULL DEFAULT 'pending',
              error_message TEXT
            );
          `;
          
          const createResult = await supabase.rpc('exec', { sql: createTableQuery });
          if (createResult.error) {
            console.error("Failed to create source_fetches table:", createResult.error);
            throw new Error(`Failed to create source_fetches table: ${createResult.error.message}`);
          }
        }
        
        console.log("Creating source fetch record in database");
        const sourceFetchResponse = await supabase
          .from('source_fetches')
          .insert({
            source: 'gnews',
            query: searchQuery,
            country: searchCountry,
            articles_fetched: articles.length,
            articles_processed: 0,
            status: 'in_progress'
          })
          .select();
          
        if (sourceFetchResponse.error) {
          console.error('Error creating source fetch record:', sourceFetchResponse.error);
          throw new Error(`Error creating source fetch record: ${sourceFetchResponse.error.message}`);
        }
        
        if (!sourceFetchResponse.data || sourceFetchResponse.data.length === 0) {
          throw new Error('Failed to create source fetch record - no data returned');
        }
        
        fetchId = sourceFetchResponse.data[0].id;
        console.log(`Source fetch record created with ID: ${fetchId}`);
      } catch (dbError) {
        console.error('Database error when creating source fetch:', dbError);
        // We'll continue without a fetch ID if we couldn't create the record
        // Instead of throwing error here, we'll just log it and continue
        console.warn(`Continuing without source_fetches record due to error: ${dbError.message}`);
      }
      
      let processedCount = 0;
      
      // Process each article
      for (const article of articles) {
        try {
          console.log(`Processing article: "${article.title}"`);
          
          // Check if article has required fields
          if (!article.title || !article.description || !article.content || !article.url) {
            console.warn(`Skipping article due to missing required fields: ${article.title || 'Untitled'}`);
            continue;
          }
          
          // Check if we already have an article with this source URL
          const { data: existingArticle, error: checkError } = await supabase
            .from('articles')
            .select('id, title')
            .eq('source_url', article.url)
            .maybeSingle();
            
          if (checkError) {
            console.error(`Error checking for existing article: ${checkError.message}`);
            continue;
          }
            
          if (existingArticle) {
            console.log(`Article already exists for URL: ${article.url} (Title: ${existingArticle.title})`);
            continue;
          }
          
          // Prepare content for AI rewriting
          const contentForAI = `
Title: ${article.title}
Description: ${article.description}
Content: ${article.content}
Source URL: ${article.url}
          `;
          
          // Use OpenAI to rewrite the article
          console.log(`Sending to OpenAI: "${article.title.substring(0, 30)}..."`);
          try {
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
              console.error(`OpenAI error: Status ${aiResponse.status}, Response: ${aiErrorText}`);
              throw new Error(`OpenAI error: ${aiResponse.status} ${aiResponse.statusText}`);
            }
            
            const aiResult = await aiResponse.json();
            console.log("Received AI response");
            const aiContent = aiResult.choices[0].message.content;
            
            // Parse the AI response (expecting JSON)
            let parsedAiContent;
            try {
              parsedAiContent = JSON.parse(aiContent);
              console.log(`Successfully parsed AI response for article: "${parsedAiContent.title}"`);
            } catch (e) {
              console.error('Failed to parse AI response as JSON:', e);
              console.error('AI content start:', aiContent.substring(0, 200) + '...');
              throw new Error('Failed to parse AI response as JSON');
            }
            
            // Generate a slug from the title
            const { data: slugResult, error: slugError } = await supabase
              .rpc('generate_slug', { title: parsedAiContent.title });
              
            if (slugError) {
              console.error(`Error generating slug: ${slugError.message}`);
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
                visible: true // Always make visible to show immediate results
              })
              .select()
              .single();
              
            if (insertError) {
              console.error(`Error inserting article: ${insertError.message}`);
              throw new Error(`Error inserting article: ${insertError.message}`);
            }
            
            console.log(`Successfully processed article: ${parsedAiContent.title}`);
            console.log(`Article stored with slug: ${slugResult}`);
            processedCount++;
          } catch (aiError) {
            console.error(`Error with OpenAI processing:`, aiError);
          }
        } catch (articleError) {
          console.error(`Error processing article:`, articleError);
        }
      }
      
      // Update the source fetch record if we created one
      if (fetchId) {
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
      }
        
      return new Response(
        JSON.stringify({
          success: true,
          message: `Successfully processed ${processedCount} of ${articles.length} articles`,
          fetchId,
          articles_processed: processedCount
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } catch (gnewsError) {
      console.error('Error fetching from GNews:', gnewsError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Error fetching articles: ${gnewsError.message}`
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Error in fetch-and-generate-articles:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
