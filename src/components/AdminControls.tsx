
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, RefreshCw, CheckCircle, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { triggerArticleGeneration } from '@/utils/articleGeneration';

const AdminControls = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerationResult, setLastGenerationResult] = useState<any>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [systemStatus, setSystemStatus] = useState<{
    articles: number;
    lastGeneration: string | null;
    cronStatus: 'active' | 'inactive' | 'error' | 'unknown';
    dbStatus: 'connected' | 'error' | 'unknown';
  }>({
    articles: 0,
    lastGeneration: null,
    cronStatus: 'unknown',
    dbStatus: 'unknown',
  });
  
  const { toast } = useToast();

  // Function to check system status
  const checkSystemStatus = async () => {
    setIsLoadingStatus(true);
    
    try {
      // Check article count
      const { count: articleCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });
      
      // Check last generation time
      const { data: lastRun } = await supabase
        .from('cron_run_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      // Check DB status through a simple query
      const { data: dbCheck, error: dbError } = await supabase
        .from('cron_run_logs')
        .select('count(*)', { count: 'exact' });
      
      // Update state with results
      setSystemStatus({
        articles: articleCount || 0,
        lastGeneration: lastRun?.[0]?.completed_at || null,
        cronStatus: lastRun?.[0]?.status === 'error' ? 'error' : 'active',
        dbStatus: dbError ? 'error' : 'connected',
      });
      
      toast({
        title: "Status check complete",
        description: "System status has been updated.",
      });
    } catch (error) {
      console.error('Error checking system status:', error);
      toast({
        variant: "destructive",
        title: "Error checking status",
        description: "Could not retrieve system status information.",
      });
    } finally {
      setIsLoadingStatus(false);
    }
  };
  
  // Function to trigger article generation manually
  const handleGenerateArticles = async () => {
    setIsGenerating(true);
    setLastGenerationResult(null);
    
    toast({
      title: "Starting article generation",
      description: "This may take a few minutes to complete.",
    });
    
    try {
      const result = await triggerArticleGeneration();
      console.log('Article generation result:', result);
      setLastGenerationResult(result);
      
      toast({
        title: "Article generation complete",
        description: `Generated ${result.articlesGenerated} new articles with ${result.errorsEncountered} errors.`,
        variant: result.errorsEncountered > 0 ? "destructive" : "default",
      });
      
      // Refresh status after generation
      setTimeout(() => {
        checkSystemStatus();
      }, 2000);
    } catch (error) {
      console.error('Error generating articles:', error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Function to check logs
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  
  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      // Instead of querying a non-existent 'logs' table, let's use the 'cron_run_logs' table
      // which appears to exist in the schema
      const { data, error } = await supabase
        .from('cron_run_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        variant: "destructive",
        title: "Could not fetch logs",
        description: "There was an error retrieving system logs.",
      });
      setLogs([]);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  return (
    <Card className="mb-8 border-orange-200 dark:border-orange-900 shadow-md">
      <CardHeader className="bg-orange-50 dark:bg-orange-950/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-orange-700 dark:text-orange-400">Admin Controls</CardTitle>
            <CardDescription>Manage content generation and system settings</CardDescription>
          </div>
          <Badge variant="outline" className={systemStatus.dbStatus === 'connected' ? 
            'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' : 
            'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
          }>
            {systemStatus.dbStatus === 'connected' ? 'System Online' : 'Check Connection'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="status">System Status</TabsTrigger>
            <TabsTrigger value="generation">Content Generation</TabsTrigger>
            <TabsTrigger value="logs">Error Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2">Content Status</h3>
                <div className="text-2xl font-bold">{systemStatus.articles}</div>
                <div className="text-sm text-gray-500">Total Articles</div>
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2">Last Generation</h3>
                <div className="text-lg font-medium">
                  {systemStatus.lastGeneration ? 
                    new Date(systemStatus.lastGeneration).toLocaleString() : 
                    'Never or Unknown'}
                </div>
                <div className="flex items-center mt-1">
                  {systemStatus.cronStatus === 'active' && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      CRON Active
                    </Badge>
                  )}
                  {systemStatus.cronStatus === 'error' && (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      CRON Error
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkSystemStatus}
              disabled={isLoadingStatus}
              className="w-full"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingStatus ? 'animate-spin' : ''}`} />
              {isLoadingStatus ? 'Checking Status...' : 'Check System Status'}
            </Button>
          </TabsContent>
          
          <TabsContent value="generation">
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Manual Content Generation</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Generate fresh articles for all categories using the Gemini API. 
                  This may take several minutes.
                </p>
                
                <Button 
                  onClick={handleGenerateArticles} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  <Play className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
                  {isGenerating ? 'Generating Articles...' : 'Generate New Articles'}
                </Button>
                
                {lastGenerationResult && (
                  <div className="mt-4 p-3 text-sm border rounded-md bg-gray-50 dark:bg-gray-900">
                    <div className="font-medium">Generation Results:</div>
                    <div className="mt-1 space-y-1">
                      <div>
                        Articles: {lastGenerationResult.articlesGenerated || 0} generated
                      </div>
                      <div>
                        Errors: {lastGenerationResult.errorsEncountered || 0} encountered
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logs">
            <div className="space-y-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchLogs}
                disabled={isLoadingLogs}
                className="w-full"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                {isLoadingLogs ? 'Loading Logs...' : 'Refresh Error Logs'}
              </Button>
              
              <div className="border rounded-md overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {logs.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Level</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Job</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Message</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {logs.map((log) => (
                          <tr key={log.id}>
                            <td className="px-3 py-2 whitespace-nowrap text-xs">
                              <Badge variant={
                                log.status === 'error' ? 'destructive' : 
                                log.status === 'inactive' ? 'secondary' : 
                                'outline'
                              }>
                                {log.status || 'unknown'}
                              </Badge>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs">{log.job_name}</td>
                            <td className="px-3 py-2 text-xs">{log.error_message || 'No error'}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs">
                              {new Date(log.started_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      {isLoadingLogs ? 
                        "Loading logs..." : 
                        "No logs found. Click 'Refresh Error Logs' to check for new entries."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-orange-50 dark:bg-orange-950/30 text-xs text-gray-500 flex justify-between items-center">
        <span>Admin access only</span>
        <span>{new Date().toLocaleDateString()}</span>
      </CardFooter>
    </Card>
  );
};

export default AdminControls;
