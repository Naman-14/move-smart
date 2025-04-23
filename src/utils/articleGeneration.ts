
import { supabase } from '@/integrations/supabase/client';

export const triggerArticleGeneration = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-and-generate-articles', {
      body: { manualRun: true }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error triggering article generation:', error);
    throw error;
  }
};
