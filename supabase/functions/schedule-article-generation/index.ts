
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    console.log('=== SCHEDULED ARTICLE GENERATION START ===');
    
    // Get environment variables
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://uagckghgdqmioejsopzv.supabase.co';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
    }
    
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    console.log('Environment check:');
    console.log('- SUPABASE_URL present:', !!SUPABASE_URL);
    console.log('- SUPABASE_SERVICE_ROLE_KEY present:', !!SUPABASE_SERVICE_ROLE_KEY);
    
    // Verify the supabase client is initialized properly
    console.log('- Supabase client initialized:', !!supabase);
    
    // Define topic categories to ensure we generate content for all pages
    const categories = [
      'startups', 
      'funding', 
      'ai', 
      'fintech', 
      'case-studies', 
      'blockchain', 
      'climate-tech'
    ];
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process multiple categories to ensure good content coverage
    for (const category of categories) {
      // Select appropriate query based on category
      let query = '';
      
      switch(category) {
        case 'startups':
          query = 'startup innovation OR unicorn startup';
          break;
        case 'funding':
          query = 'venture capital funding OR investment round';
          break;
        case 'ai':
          query = 'artificial intelligence breakthrough OR AI startup';
          break;
        case 'fintech':
          query = 'financial technology innovation OR digital banking';
          break;
        case 'case-studies':
          query = 'startup success story OR business case study';
          break;
        case 'blockchain':
          query = 'blockchain technology OR crypto innovation';
          break;
        case 'climate-tech':
          query = 'climate technology OR sustainable startup';
          break;
        default:
          query = 'tech startup';
      }
      
      console.log(`Generating content for category ${category} with query: ${query}`);
      
      try {
        // Invoke the fetch-and-generate-articles function directly
        const response = await fetch(
          `${SUPABASE_URL}/functions/v1/fetch-and-generate-articles`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              manualRun: false,
              scheduled: true,
              debug: true,
              query: query,
              targetCategory: category,
              articlesNeeded: 3, // Generate 3 articles per category
              useAI: true
            }),
          }
        );
        
        // Handle response
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to generate articles for ${category}. Status: ${response.status}`);
          console.error('Error response:', errorText);
          errorCount++;
        } else {
          const result = await response.json();
          console.log(`Successfully generated ${category} articles:`, 
            result.articles ? `${result.articles.length} articles` : 'No articles data');
          
          if (result.articles) {
            successCount += result.articles.length;
          }
        }
      } catch (categoryError) {
        console.error(`Error processing category ${category}:`, categoryError);
        errorCount++;
      }
      
      // Delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('=== SCHEDULED ARTICLE GENERATION COMPLETE ===');
    console.log(`Total articles generated: ${successCount}`);
    console.log(`Total errors: ${errorCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully scheduled article generation',
        timestamp: new Date().toISOString(),
        articlesGenerated: successCount,
        errorsEncountered: errorCount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('=== SCHEDULED ARTICLE GENERATION FAILED ===');
    console.error('Error in schedule-article-generation:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
