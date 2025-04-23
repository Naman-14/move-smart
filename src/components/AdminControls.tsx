
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { triggerArticleGeneration } from '@/utils/articleGeneration';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const AdminControls = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState<string | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const { toast } = useToast();

  const handleGenerateArticles = async () => {
    try {
      setIsGenerating(true);
      setDiagnosticInfo(null);
      
      // Clear previous diagnostic info
      console.clear();
      console.log('Starting article generation process...');
      
      // Store start time for performance metrics
      const startTime = Date.now();
      
      // Add diagnostic info about Supabase client
      setDiagnosticInfo('Initiating content generation...');
      
      const result = await triggerArticleGeneration();
      
      // Calculate execution time
      const executionTime = Date.now() - startTime;
      console.log(`Generation completed in ${executionTime}ms`);
      
      setDiagnosticInfo(`Generation completed in ${executionTime}ms. Result: ${JSON.stringify(result)}`);
      console.log('Generation result:', result);
      
      toast({
        title: 'Content Generation Started',
        description: 'New articles are being generated. They will appear shortly.',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error in handleGenerateArticles:', error);
      
      // Detailed error diagnostic info
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = `${error.name}: ${error.message}`;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        errorMessage = JSON.stringify(error);
      }
      
      setDiagnosticInfo(`Error: ${errorMessage}`);
      
      toast({
        title: 'Error Generating Content',
        description: errorMessage.substring(0, 100) + (errorMessage.length > 100 ? '...' : ''),
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Admin Controls</h3>
      <div className="flex flex-col gap-4">
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
          <Button 
            variant="outline" 
            onClick={() => setShowDiagnostics(!showDiagnostics)}
          >
            {showDiagnostics ? 'Hide' : 'Show'} Diagnostics
          </Button>
        </div>
        
        {showDiagnostics && diagnosticInfo && (
          <Alert variant="default" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Diagnostic Information</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap font-mono text-xs">
              {diagnosticInfo}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default AdminControls;
