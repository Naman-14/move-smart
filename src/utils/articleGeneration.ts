
import { supabase } from '@/integrations/supabase/client';

export const triggerArticleGeneration = async () => {
  try {
    // Add better error handling and logging
    console.log('Triggering article generation...');
    
    const { data, error } = await supabase.functions.invoke('fetch-and-generate-articles', {
      body: { manualRun: true }
    });
    
    if (error) {
      console.error('Error response from function:', error);
      throw error;
    }
    
    console.log('Article generation triggered successfully:', data);
    return data;
  } catch (error) {
    console.error('Error triggering article generation:', error);
    throw error;
  }
};
