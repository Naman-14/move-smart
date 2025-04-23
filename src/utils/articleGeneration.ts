
// Enhanced diagnostics and error handling for article generation
import { supabase } from '@/integrations/supabase/client';

export const triggerArticleGeneration = async () => {
  try {
    // Start with clear beginning marker for logs
    console.log('=== ARTICLE GENERATION START ===');
    console.log('triggerArticleGeneration called with manualRun: true');
    
    // Log the supabase client state (without sensitive info)
    console.log('Supabase client initialized:', !!supabase);
    
    // Detailed pre-invocation logging
    console.log('About to invoke fetch-and-generate-articles edge function...');
    
    const { data, error } = await supabase.functions.invoke('fetch-and-generate-articles', {
      body: { manualRun: true },
    });
    
    // Detailed post-invocation logging
    console.log('Edge function invocation completed. Response received.');
    
    // Log the raw response for debugging
    console.log('Raw response data:', data);
    console.log('Raw response error:', error);
    
    if (error) {
      console.error('Error from fetch-and-generate-articles function:', error);
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
    throw error;
  }
};
