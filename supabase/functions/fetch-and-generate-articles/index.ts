
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { stripHtml } from 'https://esm.sh/string-strip-html@13.4.3'
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    console.log("Edge function invoked: fetch-and-generate-articles");
    
    // Parse request
    let input = {};
    try {
      input = await req.json();
    } catch (e) {
      console.error("Error parsing JSON input:", e);
      input = {};
    }
    
    const { 
      manualRun = false, 
      debug = false, 
      query = 'tech startups', 
      articlesNeeded = 5,
      targetCategory = null, // Category parameter
      useAI = true // Flag to use AI for content enhancement
    } = input;
    
    console.log(`Function parameters: manualRun=${manualRun}, debug=${debug}, query=${query}, articlesNeeded=${articlesNeeded}, targetCategory=${targetCategory}, useAI=${useAI}`);
    
    // Creating a Supabase client
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const GNEWS_API_KEY = Deno.env.get('GNEWS_API_KEY') || '90e92cf05deecdbbb043dcc040b97c5e'; // Use provided key
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || 'AIzaSyDfPJvFdqt8nQvPnCXHqvQ4wyMynV4FkfM'; // Use provided Gemini key
    
    // Check for presence of required env variables
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Required Supabase environment variables are not set');
    }

    if (!GNEWS_API_KEY) {
      throw new Error('GNews API key is not set');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Special handling for /health path
    const url = new URL(req.url);
    if (url.pathname.endsWith('/health')) {
      console.log("Health check requested");
      
      // Check if source_fetches table exists
      const { data: tablesData, error: tablesError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')
        .eq('tablename', 'source_fetches');
      
      const source_fetches_table_exists = !tablesError && tablesData && tablesData.length > 0;
      
      // Check article table count
      const { count: articleCount, error: countError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });
      
      return new Response(
        JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          environment: {
            has_supabase_url: !!SUPABASE_URL,
            has_service_role_key: !!SUPABASE_SERVICE_ROLE_KEY,
            has_gnews_api_key: !!GNEWS_API_KEY,
            has_gemini_api_key: !!GEMINI_API_KEY,
          },
          supabase_connection: !tablesError ? 'working' : 'error',
          source_fetches_table: source_fetches_table_exists,
          articles_table: {
            count: articleCount,
            error: countError ? countError.message : null
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Log the source fetch
    try {
      // Check if source_fetches table exists first
      const { data: tableExists, error: tableCheckError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')
        .eq('tablename', 'source_fetches');
      
      if (tableExists && tableExists.length > 0) {
        const { data, error } = await supabase
          .from('source_fetches')
          .insert({
            source: 'gnews',
            query: query,
            manual_run: manualRun,
            parameters: { query, debug, manualRun, targetCategory, useAI }
          })
          .select();
        
        if (error) console.error("Error logging source fetch:", error);
        else console.log("Source fetch logged:", data);
      } else {
        console.log("source_fetches table doesn't exist, creating it");
        
        // Create the source_fetches table if it doesn't exist
        const { error: createTableError } = await supabase.rpc(
          'exec',
          {
            sql: `
              CREATE TABLE IF NOT EXISTS public.source_fetches (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                source TEXT NOT NULL,
                query TEXT,
                manual_run BOOLEAN DEFAULT false,
                parameters JSONB,
                results_count INTEGER,
                status TEXT DEFAULT 'pending'
              );
            `
          }
        );
        
        if (createTableError) {
          console.error("Error creating source_fetches table:", createTableError);
        } else {
          console.log("Created source_fetches table successfully");
          
          // Try logging the fetch again
          const { error } = await supabase
            .from('source_fetches')
            .insert({
              source: 'gnews',
              query: query,
              manual_run: manualRun,
              parameters: { query, debug, manualRun, targetCategory, useAI }
            });
          
          if (error) console.error("Error logging source fetch after table creation:", error);
          else console.log("Source fetch logged after table creation");
        }
      }
    } catch (e) {
      console.error("Error handling source fetch logging:", e);
      // Continue with the function even if logging fails
    }
    
    // Fetch articles from GNews API
    console.log(`Fetching articles from GNews API with query: ${query}`);
    const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=${articlesNeeded}&apikey=${GNEWS_API_KEY}`;
    console.log(`GNews API URL: ${gnewsUrl.replace(GNEWS_API_KEY, 'API_KEY_HIDDEN')}`);
    
    const response = await fetch(gnewsUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GNews API Error (${response.status}): ${errorText}`);
      throw new Error(`GNews API error: ${response.status} ${response.statusText}`);
    }
    
    const articlesData = await response.json();
    console.log(`Received ${articlesData.articles?.length || 0} articles from GNews`);
    
    if (!articlesData.articles || articlesData.articles.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No articles returned from GNews API',
          query: query
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
    
    // Define available categories
    const categories = ['startups', 'funding', 'ai', 'fintech', 'case-studies', 'blockchain', 'climate-tech'];
    
    // If no target category is provided, use the first one as default
    const category = targetCategory || categories[Math.floor(Math.random() * categories.length)];
    
    // Function to enhance content with Gemini AI
    async function enhanceWithGemini(title, description, content, category) {
      if (!useAI || !GEMINI_API_KEY) {
        console.log("AI enhancement skipped: useAI=", useAI, "has Gemini key=", !!GEMINI_API_KEY);
        return { 
          enhancedContent: content ? `<p>${description || ''}</p><p>${content || ''}</p>` : `<p>${description || 'No content available.'}</p>`,
          enhancedSummary: description || 'No summary available.' 
        };
      }
      
      try {
        console.log("Enhancing content with Gemini for:", title.substring(0, 30) + "...");
        
        // Create prompts for content and summary
        const contentPrompt = `
        You are a professional tech journalist writing for MoveSmart, a tech startup news platform.
        
        Here's a news article about "${title}" with this description: "${description}".
        
        Please rewrite and expand this into a well-structured, original article about ${category}-related tech news.
        
        Add details, insights, and industry context where appropriate.
        Structure the article with paragraphs, subheadings if needed.
        Include a strong introduction and conclusion.
        Write in a professional, journalistic style.
        Format the output as HTML with proper paragraph tags.
        DO NOT mention or cite sources or indicate that this is based on another article.
        DO NOT include comments about AI generating the content.
        DO NOT use phrases like "according to reports" or similar.
        
        Original content: "${content || description}"
        `;
        
        const summaryPrompt = `
        Create a concise 1-2 sentence summary of the following article title: "${title}"
        
        The summary should be compelling, highlight the key point, and entice readers to read more.
        DO NOT use phrases like "this article discusses" or similar meta-references.
        Keep it under 200 characters if possible.
        
        Article description: "${description}"
        `;
        
        // Call Gemini API for content generation
        const contentResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: contentPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              topP: 0.8,
              topK: 40
            }
          })
        });
        
        if (!contentResponse.ok) {
          const errorText = await contentResponse.text();
          console.error("Gemini API Error for content:", errorText);
          throw new Error(`Gemini API error: ${contentResponse.status}`);
        }
        
        const contentResult = await contentResponse.json();
        const enhancedContent = contentResult?.candidates?.[0]?.content?.parts?.[0]?.text || 
                               "No content was generated. Please try again later.";
        
        // Call Gemini API for summary generation
        const summaryResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: summaryPrompt }] }],
            generationConfig: {
              temperature: 0.4,
              topP: 0.95,
              maxOutputTokens: 100
            }
          })
        });
        
        if (!summaryResponse.ok) {
          const errorText = await summaryResponse.text();
          console.error("Gemini API Error for summary:", errorText);
          throw new Error(`Gemini API error: ${summaryResponse.status}`);
        }
        
        const summaryResult = await summaryResponse.json();
        const enhancedSummary = summaryResult?.candidates?.[0]?.content?.parts?.[0]?.text || 
                               "No summary was generated. Please try again later.";
        
        console.log("AI enhancement successful with Gemini");
        
        // Format the content as HTML if it's not already
        const formattedContent = enhancedContent.includes('<p>') 
          ? enhancedContent 
          : enhancedContent.split('\n\n').map(para => `<p>${para}</p>`).join('');
        
        return {
          enhancedContent: formattedContent,
          enhancedSummary: enhancedSummary.replace(/"/g, '')
        };
      } catch (error) {
        console.error("Error enhancing content with Gemini:", error);
        return { 
          enhancedContent: content ? `<p>${description || ''}</p><p>${content || ''}</p>` : `<p>${description || 'No content available.'}</p>`,
          enhancedSummary: description || 'No summary available.'
        };
      }
    }
    
    // Transform and process articles
    const processedArticles = [];
    
    for (const article of articlesData.articles) {
      try {
        // Generate a short slug from the title
        const slug = article.title
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 50) + '-' + uuidv4().substring(0, 8);
        
        console.log(`Processing article: "${article.title.substring(0, 30)}..."`);
        
        // Clean content if present
        const cleanContent = article.content 
          ? stripHtml(article.content).result 
          : article.description || 'No content available for this article.';
        
        // Add AI enhancement with Gemini
        const { enhancedContent, enhancedSummary } = await enhanceWithGemini(
          article.title,
          article.description,
          cleanContent,
          category
        );
        
        // Generate tags based on title, content, and category
        const keywordSets = {
          'startups': ['startup', 'entrepreneurship', 'business', 'founder', 'innovation'],
          'funding': ['venture capital', 'investment', 'funding', 'series a', 'investor'],
          'ai': ['artificial intelligence', 'machine learning', 'ai', 'automation', 'neural network'],
          'fintech': ['financial technology', 'banking', 'payment', 'finance', 'digital payment'],
          'case-studies': ['case study', 'business strategy', 'growth', 'market analysis', 'success story'],
          'blockchain': ['blockchain', 'cryptocurrency', 'web3', 'token', 'decentralized'],
          'climate-tech': ['climate', 'sustainability', 'clean energy', 'green tech', 'carbon']
        };
        
        // Generate relevant tags based on category and content
        const baseKeywords = keywordSets[category] || ['technology', 'innovation', 'business'];
        const titleWords = article.title.toLowerCase();
        const descWords = article.description?.toLowerCase() || '';
        
        // Check which keywords are relevant based on title and description
        const relevantTags = baseKeywords.filter(tag => 
          titleWords.includes(tag) || descWords.includes(tag)
        );
        
        // Always include at least 2 tags
        const tags = relevantTags.length >= 2 ? relevantTags : [
          baseKeywords[0], 
          baseKeywords[1]
        ];
        
        // Ensure unique tags
        const uniqueTags = [...new Set(tags)];
        
        // Calculate estimated reading time
        const wordCount = enhancedContent.split(/\s+/).length;
        const readingTime = Math.max(1, Math.round(wordCount / 200)); // Avg reading speed 200wpm
        
        // Generate random author names
        const authorNames = [
          "Emma Johnson", "Michael Chen", "Sarah Patel", "David Okonkwo", 
          "Aisha Rahman", "Tomas Rodriguez", "Zoe Williams", "Ryan Kim", 
          "Maya Gupta", "James Wilson", "Leila Martinez", "Noah Taylor"
        ];
        const author = authorNames[Math.floor(Math.random() * authorNames.length)];
        
        processedArticles.push({
          title: article.title,
          slug,
          summary: enhancedSummary,
          content: enhancedContent,
          cover_image_url: article.image || 'https://placehold.co/800x400?text=MoveSmart',
          tags: uniqueTags.slice(0, 5),
          category,
          visible: true,
          source_url: article.url,
          source_name: article.source?.name || 'News Source',
          publication_date: article.publishedAt,
          reading_time: readingTime,
          author: author
        });
        
        console.log(`Processed article: "${article.title.substring(0, 30)}..." with category ${category}`);
      } catch (articleError) {
        console.error(`Error processing article: ${articleError}`);
      }
    }
    
    console.log(`Processed ${processedArticles.length} articles for insertion`);
    
    if (processedArticles.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No articles could be processed',
          query: query
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
    
    // Insert articles into database
    const { data: insertedData, error: insertError } = await supabase
      .from('articles')
      .insert(processedArticles)
      .select();
    
    if (insertError) {
      console.error("Error inserting articles:", insertError);
      throw insertError;
    }
    
    console.log(`Successfully inserted ${insertedData.length} articles`);
    
    // Update the source fetch record with results if available
    try {
      const { data: tableExists } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')
        .eq('tablename', 'source_fetches');
      
      if (tableExists && tableExists.length > 0) {
        const { data: sourceFetches } = await supabase
          .from('source_fetches')
          .select('id')
          .eq('query', query)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (sourceFetches && sourceFetches.length > 0) {
          const { error: updateError } = await supabase
            .from('source_fetches')
            .update({
              results_count: insertedData.length,
              status: 'success'
            })
            .eq('id', sourceFetches[0].id);
          
          if (updateError) console.error("Error updating source fetch:", updateError);
        }
      }
    } catch (e) {
      console.error("Error updating source fetch record:", e);
      // Continue anyway
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully fetched, enhanced, and inserted ${insertedData.length} articles`,
        articles: insertedData.map((a: any) => ({ id: a.id, title: a.title, category: a.category }))
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error("Fatal error in edge function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
});
