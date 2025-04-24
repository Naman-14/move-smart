
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { triggerArticleGeneration } from '@/utils/articleGeneration';
import { Loader2, AlertCircle, Terminal, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const AdminControls = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState<string | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [expandedInfo, setExpandedInfo] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [generationStats, setGenerationStats] = useState<{success: number, error: number}>({success: 0, error: 0});
  const { toast } = useToast();

  const handleGenerateArticles = async () => {
    try {
      setIsGenerating(true);
      setDiagnosticInfo(null);
      setLogs([]);
      
      // Capture console logs for display
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      
      const logCapture = (type: string) => (...args: any[]) => {
        const logMessage = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        
        setLogs(prev => [...prev, `[${type}] ${logMessage}`]);
      };
      
      console.log = logCapture('INFO');
      console.error = logCapture('ERROR');
      
      const startTime = Date.now();
      
      const result = await triggerArticleGeneration();
      
      const executionTime = Date.now() - startTime;
      
      setGenerationStats({
        success: result.articlesGenerated || 0,
        error: result.errorsEncountered || 0
      });
      
      setDiagnosticInfo(`Generation completed in ${executionTime}ms. Generated ${result.articlesGenerated || 0} articles.`);
      
      toast({
        title: 'Content Generation Complete',
        description: `${result.articlesGenerated || 0} new articles were generated.`,
        variant: 'default'
      });
      
      // Restore original console methods
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    } catch (error) {
      console.error('Error in handleGenerateArticles:', error);
      
      let errorMessage = error instanceof Error ? error.message : String(error);
      
      setDiagnosticInfo(`Error: ${errorMessage}`);
      setShowDiagnostics(true);
      
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
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Article Generation</h3>
          
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
            <RefreshCw className="w-3 h-3 mr-1" /> Automatic Hourly Updates
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={handleGenerateArticles} 
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
            Generate Articles Now
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowDiagnostics(!showDiagnostics)}
          >
            {showDiagnostics ? 'Hide' : 'Show'} Diagnostics
          </Button>
        </div>
        
        {(generationStats.success > 0 || generationStats.error > 0) && (
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                {generationStats.success} articles generated
              </Badge>
              {generationStats.error > 0 && (
                <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                  {generationStats.error} errors
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {showDiagnostics && (
          <Collapsible
            open={expandedInfo}
            onOpenChange={setExpandedInfo}
            className="mt-4 border rounded-md bg-white dark:bg-gray-800"
          >
            {diagnosticInfo && (
              <div className="p-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Generation Status</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap font-mono text-xs">
                    {diagnosticInfo}
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            {logs.length > 0 && (
              <div className="bg-black text-green-400 p-3 rounded-md font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto">
                {logs.map((log, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "py-1", 
                      log.includes('[ERROR]') ? "text-red-400" : 
                      log.includes('[WARN]') ? "text-yellow-400" : 
                      "text-green-400"
                    )}
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </Collapsible>
        )}
      </div>
    </div>
  );
};

export default AdminControls;
