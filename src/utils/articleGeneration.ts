
// Enhanced diagnostics and error handling for article generation
import { supabase } from '@/integrations/supabase/client';

// Import the Supabase URL and key from the client file
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/client';

export const triggerArticleGeneration = async () => {
  try {
    // Start with clear beginning marker for logs
    console.log('=== ARTICLE GENERATION START ===');
    console.log('triggerArticleGeneration called with manualRun: true');
    
    // Log the supabase client state (without sensitive info)
    console.log('Supabase client initialized:', !!supabase);
    
    // Add version information for debugging
    console.log('Client version info:', {
      timestamp: new Date().toISOString(),
      clientUrl: SUPABASE_URL,
      functionUrl: `${SUPABASE_URL}/functions/v1/fetch-and-generate-articles`
    });
    
    // Detailed pre-invocation logging
    console.log('About to invoke fetch-and-generate-articles edge function...');
    
    // First, check if we can simply fetch from the edge function endpoint (fallback)
    try {
      console.log('Attempting direct fetch to check edge function availability...');
      const healthResponse = await fetch(`${SUPABASE_URL}/functions/v1/fetch-and-generate-articles/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Health check status:', healthResponse.status);
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('Health check response:', healthData);
        
        // Specific check for the source_fetches table
        if (healthData.source_fetches_table === false) {
          console.warn('The source_fetches table does not exist or is not accessible!');
        }
      } else {
        console.warn('Health check failed:', await healthResponse.text());
      }
    } catch (healthError) {
      console.warn('Health check failed with error:', healthError);
      // Continue with normal invocation even if health check fails
    }
    
    // Use different queries each time to get diverse content
    const queries = [
      'tech startups', 
      'AI innovation', 
      'fintech news',
      'startup funding',
      'climate tech',
      'blockchain innovation',
      'SaaS companies',
      'tech acquisitions',
      'startup founders',
      'venture capital'
    ];
    
    // Select a random query from the list
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    
    const { data, error } = await supabase.functions.invoke('fetch-and-generate-articles', {
      body: { 
        manualRun: true,
        debug: true, // Add debug flag
        clientTimestamp: new Date().toISOString(),
        query: randomQuery,
        articlesNeeded: 10 // Request more articles
      },
    });
    
    // Detailed post-invocation logging
    console.log('Edge function invocation completed. Response received.');
    
    // Log the raw response for debugging
    console.log('Raw response data:', data);
    console.log('Raw response error:', error);
    
    if (error) {
      console.error('Error from fetch-and-generate-articles function:', error);
      
      // Try to extract more details from the error
      if (error.message) {
        console.error('Error message:', error.message);
      }
      
      if (error.context) {
        console.error('Error context:', error.context);
      }
      
      // Attempt to parse any response body if available
      if (error.context && error.context.responseText) {
        try {
          const errorBody = JSON.parse(error.context.responseText);
          console.error('Error response body:', errorBody);
        } catch (parseError) {
          console.error('Error response text (not JSON):', error.context.responseText);
        }
      }
      
      throw error;
    }
    
    if (!data) {
      console.error('No data returned from function');
      throw new Error('No data returned from function');
    }
    
    if (typeof data === 'object' && (data as any).success === false) {
      const errMsg = (data as any).error || 'Unknown error';
      console.error('Function reported failure:', errMsg);
      throw new Error(errMsg);
    }
    
    console.log('Article generation triggered successfully:', data);
    console.log('=== ARTICLE GENERATION COMPLETE ===');
    
    return data;
  } catch (error) {
    // Enhanced error logging with stack trace
    console.error('=== ARTICLE GENERATION FAILED ===');
    console.error('Error in triggerArticleGeneration:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    
    // If the error is a FunctionsHttpError, try to get more details
    if (error.name === 'FunctionsHttpError') {
      console.error('FunctionsHttpError details:');
      console.error('- Status:', error.context?.status);
      console.error('- Status Text:', error.context?.statusText);
      
      if (error.context?.responseText) {
        try {
          const responseBody = JSON.parse(error.context.responseText);
          console.error('- Response body:', responseBody);
        } catch (e) {
          console.error('- Raw response:', error.context.responseText);
        }
      }
    }
    
    throw error;
  }
};
