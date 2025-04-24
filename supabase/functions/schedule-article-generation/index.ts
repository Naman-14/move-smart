
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
    
    // Log function execution start
    const { data: executionLog, error: logError } = await supabase
      .from('cron_run_logs')
      .insert({
        job_name: 'article-generation',
        status: 'started'
      })
      .select()
      .single();
      
    if (logError) {
      console.error('Error logging cron job start:', logError);
    }
    
    const executionLogId = executionLog?.id;
    
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
    
    // Check for recent failures
    const { data: recentFailures } = await supabase
      .from('cron_run_logs')
      .select('*')
      .eq('status', 'error')
      .order('created_at', { ascending: false })
      .limit(3);
      
    const hasRecentFailures = recentFailures && recentFailures.length >= 3;
    
    // Determine if we're in recovery mode (after multiple failures)
    const recoveryMode = hasRecentFailures;
    if (recoveryMode) {
      console.log('Multiple recent failures detected, entering recovery mode with reduced load');
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    // Utility function to add delay between requests
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    // Process multiple categories to ensure good content coverage
    for (const category of categories) {
      // In recovery mode, only process a few key categories
      if (recoveryMode && !['startups', 'ai', 'funding'].includes(category)) {
        console.log(`Skipping ${category} in recovery mode to reduce API load`);
        continue;
      }
      
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
      
      // Set the number of articles to generate per category
      // Use fewer in recovery mode
      const articlesNeeded = recoveryMode ? 1 : 3;
      
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
              articlesNeeded: articlesNeeded,
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
          
          // Log error to database
          await supabase.from('logs').insert({
            level: 'error',
            category: 'article_generation',
            message: `Failed to generate articles for ${category}`,
            details: {
              status: response.status,
              error: errorText,
              category
            }
          });
          
          // If we're not in recovery mode and hit a significant error, try a simpler approach
          if (!recoveryMode && response.status !== 404) {
            console.log(`Attempting recovery for ${category} with simplified parameters...`);
            
            // Simple retry with more basic parameters
            const retryResponse = await fetch(
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
                  query: category, // Simplified query
                  targetCategory: category,
                  articlesNeeded: 1, // Reduced article count
                  useAI: true
                }),
              }
            );
            
            if (retryResponse.ok) {
              const retryResult = await retryResponse.json();
              console.log(`Recovery successful for ${category}: generated ${retryResult.articles?.length || 0} articles`);
              successCount += retryResult.articles?.length || 0;
            }
          }
          
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
        
        // Log error to database
        await supabase.from('logs').insert({
          level: 'error',
          category: 'article_generation',
          message: `Exception processing category ${category}`,
          details: {
            error: categoryError.message,
            stack: categoryError.stack,
            category
          }
        });
      }
      
      // Delay between requests to avoid rate limiting
      await delay(recoveryMode ? 3000 : 1000);
    }

    // Update execution log with results
    if (executionLogId) {
      await supabase
        .from('cron_run_logs')
        .update({
          status: errorCount > 0 ? (successCount > 0 ? 'partial_success' : 'error') : 'completed',
          completed_at: new Date().toISOString(),
          error_message: errorCount > 0 ? `Encountered ${errorCount} errors` : null
        })
        .eq('id', executionLogId);
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
        errorsEncountered: errorCount,
        recoveryMode
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('=== SCHEDULED ARTICLE GENERATION FAILED ===');
    console.error('Error in schedule-article-generation:', error);
    
    // Try to create a logs entry for the error
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') || 'https://uagckghgdqmioejsopzv.supabase.co',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
      );
      
      await supabase
        .from('logs')
        .insert({
          level: 'error',
          category: 'cron_job',
          message: 'Scheduled article generation failed',
          details: {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
          }
        });
        
      // Also update the execution log if possible
      const { data: latestRun } = await supabase
        .from('cron_run_logs')
        .select('*')
        .eq('status', 'started')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (latestRun && latestRun.length > 0) {
        await supabase
          .from('cron_run_logs')
          .update({
            status: 'error',
            completed_at: new Date().toISOString(),
            error_message: error.message
          })
          .eq('id', latestRun[0].id);
      }
    } catch (logError) {
      console.error('Failed to log error to database:', logError);
    }
    
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
