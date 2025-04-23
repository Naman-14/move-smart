
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
    
    // Generate content for each category to ensure all sections are populated
    const categories = [
      'startups', 'funding', 'ai', 'fintech', 'case-studies', 'blockchain', 'climate-tech'
    ];
    
    let successCount = 0;
    
    // Process each category with specific sources to generate diverse, high-quality content
    for (const category of categories) {
      let query = '';
      
      // Select appropriate sources and queries based on category
      switch(category) {
        case 'startups':
          query = 'TechCrunch startup funding OR YCombinator startups';
          break;
        case 'funding':
          query = 'venture capital funding rounds OR series A B C funding';
          break;
        case 'ai':
          query = 'artificial intelligence innovation OR AI startup breakthroughs';
          break;
        case 'fintech':
          query = 'financial technology disruption OR digital banking innovation';
          break;
        case 'case-studies':
          query = 'startup success stories OR business case studies';
          break;
        case 'blockchain':
          query = 'blockchain technology innovation OR web3 startups';
          break;
        case 'climate-tech':
          query = 'climate technology startups OR sustainable innovation';
          break;
        default:
          query = 'tech startup innovation';
      }
      
      console.log(`Generating content for category "${category}" with query: "${query}"`);
      
      try {
        // For each category, generate 3-5 articles to ensure good content coverage
        const { data, error } = await supabase.functions.invoke('fetch-and-generate-articles', {
          body: { 
            manualRun: true,
            debug: true,
            clientTimestamp: new Date().toISOString(),
            query: query,
            targetCategory: category,
            articlesNeeded: 5, // Request 5 articles per category for good content volume
            useAI: true // Enable AI content enhancement
          },
        });
        
        if (error) {
          console.error(`Error generating ${category} articles:`, error);
        } else if (data) {
          console.log(`Successfully generated ${category} articles:`, 
            data.articles?.map(a => ({id: a.id, title: a.title})) || 'No articles data');
          successCount += (data.articles?.length || 0);
        }
        
        // Small delay between category requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (categoryError) {
        console.error(`Error processing category ${category}:`, categoryError);
      }
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
