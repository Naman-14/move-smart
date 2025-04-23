
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
      targetCategory = null // New parameter to target specific category
    } = input;
    
    console.log(`Function parameters: manualRun=${manualRun}, debug=${debug}, query=${query}, articlesNeeded=${articlesNeeded}, targetCategory=${targetCategory}`);
    
    // Creating a Supabase client
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const GNEWS_API_KEY = Deno.env.get('GNEWS_API_KEY') || '';
    
    // Check for presence of required env variables
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GNEWS_API_KEY) {
      throw new Error('Required environment variables are not set');
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
            parameters: { query, debug, manualRun, targetCategory }
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
              parameters: { query, debug, manualRun, targetCategory }
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
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=${articlesNeeded}&apikey=${GNEWS_API_KEY}`
    );
    
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
    
    // Transform and process articles
    const processedArticles = articlesData.articles.map((article: any) => {
      // Generate a short slug from the title
      const slug = article.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50) + '-' + uuidv4().substring(0, 8);
      
      // Generate a summary if not present
      const summary = article.description || `${article.title} - Read this article for insights on the latest developments.`;
      
      // Strip HTML from content if present
      const content = article.content 
        ? stripHtml(article.content).result 
        : `<p>${article.description || 'No content available for this article.'}</p>`;
      
      // Use the target category if provided, otherwise assign a random one
      const category = targetCategory || categories[Math.floor(Math.random() * categories.length)];
      
      // Generate tags based on title, content, and category
      const keywordSets: Record<string, string[]> = {
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
      
      return {
        title: article.title,
        slug,
        summary: summary,
        content: `<p>${summary}</p><p>&nbsp;</p><p>${content}</p>`,
        cover_image_url: article.image || 'https://placehold.co/800x400?text=MoveSmart',
        tags: uniqueTags.slice(0, 5),
        category,
        visible: true,
        source_url: article.url,
        source_name: article.source?.name || 'News Source',
        publication_date: article.publishedAt
      };
    });
    
    console.log(`Processed ${processedArticles.length} articles for category: ${targetCategory || 'mixed'}`);
    
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
        message: `Successfully fetched and inserted ${insertedData.length} articles`,
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
})
