
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
    
    // Use different queries for each category to ensure diverse content
    const queries = {
      startups: ['tech startups', 'startup founders', 'emerging startups', 'startup innovations'],
      funding: ['startup funding', 'venture capital', 'series a funding', 'seed funding rounds'],
      ai: ['artificial intelligence news', 'ai innovations', 'machine learning startups', 'ai technology'],
      fintech: ['financial technology', 'fintech innovations', 'digital banking', 'payment solutions'],
      'case-studies': ['business case studies', 'startup success stories', 'company growth strategies'],
      blockchain: ['blockchain technology', 'crypto startups', 'web3 innovations', 'blockchain applications'],
      'climate-tech': ['climate technology', 'clean energy startups', 'sustainable tech', 'green innovations']
    };
    
    // Generate 3-5 articles for each category
    let successCount = 0;
    const categories = Object.keys(queries);
    
    for (const category of categories) {
      // Select a random query from the category's list
      const categoryQueries = queries[category];
      const randomQuery = categoryQueries[Math.floor(Math.random() * categoryQueries.length)];
      
      console.log(`Generating articles for category: ${category} with query: ${randomQuery}`);
      
      const { data, error } = await supabase.functions.invoke('fetch-and-generate-articles', {
        body: { 
          manualRun: true,
          debug: true,
          clientTimestamp: new Date().toISOString(),
          query: randomQuery,
          targetCategory: category, // Specify which category we want
          articlesNeeded: 4 // Request 4 articles per category
        },
      });
      
      if (error) {
        console.error(`Error generating ${category} articles:`, error);
      } else if (data) {
        console.log(`Successfully generated ${category} articles:`, data);
        successCount += (data.articles?.length || 0);
      }
      
      // Small delay between category requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`=== ARTICLE GENERATION COMPLETE: Generated ${successCount} new articles ===`);
    return { success: true, articlesGenerated: successCount };
  } catch (error) {
    // Enhanced error logging with stack trace
    console.error('=== ARTICLE GENERATION FAILED ===');
    console.error('Error in triggerArticleGeneration:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    
    throw error;
  }
};
