
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { triggerArticleGeneration } from '@/utils/articleGeneration';
import { Loader2 } from 'lucide-react';

const AdminControls = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateArticles = async () => {
    try {
      setIsGenerating(true);
      console.log('Starting article generation process...');
      
      const result = await triggerArticleGeneration();
      console.log('Generation result:', result);
      
      toast({
        title: 'Content Generation Started',
        description: 'New articles are being generated. They will appear shortly.',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error in handleGenerateArticles:', error);
      toast({
        title: 'Error Generating Content',
        description: 'Failed to trigger article generation. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Admin Controls</h3>
      <div className="flex gap-4">
        <Button 
          onClick={handleGenerateArticles} 
          disabled={isGenerating}
        >
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate New Articles
        </Button>
        <div className="text-sm text-gray-500 ml-4 flex items-center">
          Auto-generates every 3 hours
        </div>
      </div>
    </div>
  );
};

export default AdminControls;
