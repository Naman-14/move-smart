
// Improved the error logging and function invocation to be clearer
import { supabase } from '@/integrations/supabase/client';

export const triggerArticleGeneration = async () => {
  try {
    console.log('Triggering article generation (manualRun: true)...');

    const { data, error } = await supabase.functions.invoke('fetch-and-generate-articles', {
      body: { manualRun: true },
    });

    if (error) {
      console.error('Error response from fetch-and-generate-articles function:', error);
      throw error;
    }

    if (!data || (typeof data === 'object' && (data as any).success === false)) {
      const errMsg = data && typeof data === 'object' ? (data as any).error || 'Unknown error' : 'No data returned';
      console.error('Article generation failed:', errMsg);
      throw new Error(errMsg);
    }

    console.log('Article generation triggered successfully:', data);
    return data;
  } catch (error) {
    console.error('Error triggering article generation:', error);
    throw error;
  }
};
