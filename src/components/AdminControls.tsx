
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { triggerArticleGeneration } from '@/utils/articleGeneration';
import { Loader2, AlertCircle, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const AdminControls = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState<string | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [expandedInfo, setExpandedInfo] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerateArticles = async () => {
    try {
      setIsGenerating(true);
      setDiagnosticInfo(null);
      
      // Clear previous logs
      setLogs([]);
      
      // Intercept console logs for display in UI
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      const originalConsoleWarn = console.warn;
      
      // Helper to add logs to state
      const addLog = (type: string, ...args: any[]) => {
        const logEntry = `[${type}] ${args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ')}`;
        
        setLogs(prev => [...prev, logEntry]);
        return args;
      };
      
      // Override console methods to capture logs
      console.log = (...args) => {
        originalConsoleLog(...addLog('INFO', ...args));
      };
      
      console.error = (...args) => {
        originalConsoleError(...addLog('ERROR', ...args));
      };
      
      console.warn = (...args) => {
        originalConsoleWarn(...addLog('WARN', ...args));
      };
      
      // Clear any existing logs
      originalConsoleLog('Starting article generation process with enhanced diagnostics...');
      
      // Store start time for performance metrics
      const startTime = Date.now();
      
      // Add diagnostic info about environment and client state
      setDiagnosticInfo('Initiating content generation with enhanced diagnostics...');
      
      // Check network connectivity before making the request
      try {
        const networkCheckStart = Date.now();
        await fetch('https://www.google.com/generate204', { mode: 'no-cors', cache: 'no-store' });
        console.log(`Network connectivity check passed in ${Date.now() - networkCheckStart}ms`);
      } catch (networkError) {
        console.warn('Network connectivity check failed:', networkError);
      }
      
      const result = await triggerArticleGeneration();
      
      // Calculate execution time
      const executionTime = Date.now() - startTime;
      console.log(`Generation completed in ${executionTime}ms`);
      
      setDiagnosticInfo(`Generation completed in ${executionTime}ms. Result: ${JSON.stringify(result, null, 2)}`);
      
      toast({
        title: 'Content Generation Started',
        description: 'New articles are being generated. They will appear shortly.',
        variant: 'default'
      });
      
      // Restore original console methods
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    } catch (error) {
      console.error('Error in handleGenerateArticles:', error);
      
      // Detailed error diagnostic info
      let errorMessage = 'Unknown error';
      let errorDetails = '';
      
      if (error instanceof Error) {
        errorMessage = `${error.name}: ${error.message}`;
        errorDetails = error.stack || '';
        
        // Check for specific error types
        if (error.name === 'FunctionsHttpError') {
          errorMessage = `Edge Function Error: ${error.message}`;
          
          // Try to extract more context from the error
          if ((error as any).context) {
            const ctx = (error as any).context;
            errorDetails += `\nStatus: ${ctx.status || 'unknown'}\n`;
            errorDetails += `Response: ${ctx.responseText || 'none'}\n`;
          }
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        errorMessage = JSON.stringify(error);
      }
      
      setDiagnosticInfo(`Error: ${errorMessage}\n\nDetails:\n${errorDetails}`);
      setShowDiagnostics(true); // Auto-expand diagnostics on error
      
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
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={handleGenerateArticles} 
            disabled={isGenerating}
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate New Articles
          </Button>
          <div className="text-sm text-gray-500 flex items-center">
            Auto-generates every 3 hours
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowDiagnostics(!showDiagnostics)}
          >
            {showDiagnostics ? 'Hide' : 'Show'} Diagnostics
          </Button>
        </div>
        
        {showDiagnostics && (
          <Collapsible
            open={expandedInfo}
            onOpenChange={setExpandedInfo}
            className="mt-4 border rounded-md bg-white dark:bg-gray-800"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4" />
                <h4 className="text-sm font-semibold">Diagnostic Information</h4>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  {expandedInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent>
              <div className="p-4">
                {diagnosticInfo && (
                  <div className="mb-4">
                    <Alert variant="default">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Status</AlertTitle>
                      <AlertDescription className="whitespace-pre-wrap font-mono text-xs overflow-x-auto max-h-40">
                        {diagnosticInfo}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                
                {logs.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-2">Execution Logs:</h5>
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
                  </div>
                )}
                
                <div className="mt-4">
                  <h5 className="text-sm font-medium mb-2">Troubleshooting Steps:</h5>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Check that all API keys are set correctly in Supabase Secrets</li>
                    <li>Verify network connectivity to Supabase and OpenAI</li>
                    <li>Check Edge Function logs in Supabase Dashboard</li>
                    <li>Ensure your Supabase project is on an active plan</li>
                  </ul>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

export default AdminControls;
