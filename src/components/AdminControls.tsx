import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Check, Clock, RefreshCw, X } from 'lucide-react';
import { triggerArticleGeneration } from '@/utils/articleGeneration';
import { format, formatDistanceToNow } from 'date-fns';

type SourceFetch = {
  id: string;
  query: string;
  source: string;
  status: 'started' | 'fetched' | 'completed' | 'error' | 'partial_success';
  created_at: string;
  completed_at?: string | null;
  articles_generated?: number | null;
  response_data?: any;
};

type ErrorLog = {
  id: string;
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  category: string;
  message: string;
  details?: any;
  created_at: string;
};

type CronRunLog = {
  id: string;
  job_name: string;
  status: string;
  started_at: string;
  completed_at?: string;
  error_message?: string;
};

const AdminControls = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [fetchLogs, setFetchLogs] = useState<SourceFetch[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [cronLogs, setCronLogs] = useState<CronRunLog[]>([]);
  const [fetchingLogs, setFetchingLogs] = useState(false);

  const handleGenerateArticles = async () => {
    setIsGenerating(true);
    try {
      toast({
        title: "Starting article generation",
        description: "This may take a minute to complete...",
      });

      const result = await triggerArticleGeneration();
      
      if (result.success) {
        toast({
          title: "Articles generated successfully",
          description: `Generated ${result.articlesGenerated} new articles.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error generating articles",
          description: "Unknown error occurred",
        });
      }
    } catch (error) {
      console.error("Error generating articles:", error);
      toast({
        variant: "destructive",
        title: "Error generating articles",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const loadLogs = async () => {
    setFetchingLogs(true);
    try {
      const { data: fetchesData, error: fetchesError } = await supabase
        .from('source_fetches')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (fetchesError) {
        console.error("Error fetching source_fetches:", fetchesError);
      } else {
        setFetchLogs(fetchesData || []);
      }

      const { data: cronData, error: cronError } = await supabase
        .from('cron_run_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);

      if (cronError) {
        console.error("Error fetching cron_run_logs:", cronError);
      } else {
        setCronLogs(cronData || []);
      }

      const { data: errorData, error: logError } = await supabase
        .from('logs')
        .select('*')
        .eq('level', 'error')
        .order('created_at', { ascending: false })
        .limit(15);

      if (logError) {
        console.error("Error fetching logs:", logError);
      } else {
        setErrorLogs(errorData || []);
      }
    } catch (error) {
      console.error("Error loading logs:", error);
      toast({
        variant: "destructive",
        title: "Error loading logs",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setFetchingLogs(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'error':
        return 'destructive';
      case 'started':
        return 'secondary';
      case 'partial_success':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Admin Controls</span>
          <Badge variant="outline">Development Only</Badge>
        </CardTitle>
        <CardDescription>
          Use these controls to manage content generation and view logs.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-4 mb-6">
          <Button 
            onClick={handleGenerateArticles} 
            disabled={isGenerating}
            className="relative"
          >
            {isGenerating ? 
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 
                Generating...
              </> : 
              <>
                <Clock className="mr-2 h-4 w-4" /> 
                Generate Articles
              </>
            }
          </Button>

          <Button 
            variant="outline" 
            onClick={loadLogs} 
            disabled={fetchingLogs}
          >
            {fetchingLogs ? 
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> :
              <RefreshCw className="mr-2 h-4 w-4" />
            }
            Refresh Logs
          </Button>
        </div>

        <Tabs defaultValue="fetches">
          <TabsList>
            <TabsTrigger value="fetches">Source Fetches</TabsTrigger>
            <TabsTrigger value="cron">Cron Jobs</TabsTrigger>
            <TabsTrigger value="errors">Error Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="fetches" className="border rounded-md p-4 max-h-96 overflow-y-auto">
            {fetchLogs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No logs found. Click "Refresh Logs" to load data.</p>
            ) : (
              <div className="space-y-3">
                {fetchLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="border rounded p-3 text-sm"
                  >
                    <div className="flex justify-between">
                      <div>
                        <Badge variant={getStatusColor(log.status)}>{log.status}</Badge>
                        <span className="ml-2 font-medium">{log.query}</span>
                      </div>
                      <div className="text-gray-500">
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div>
                        <span>Source: {log.source}</span>
                        {log.articles_generated && (
                          <span className="ml-3">Articles: {log.articles_generated}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cron" className="border rounded-md p-4 max-h-96 overflow-y-auto">
            {cronLogs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No cron logs found. Click "Refresh Logs" to load data.</p>
            ) : (
              <div className="space-y-3">
                {cronLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="border rounded p-3 text-sm"
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Badge variant={getStatusColor(log.status)}>
                          {log.status === 'completed' ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : log.status === 'error' ? (
                            <X className="h-3 w-3 mr-1" />
                          ) : log.status === 'started' ? (
                            <Clock className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {log.status}
                        </Badge>
                        <span className="ml-2 font-medium">{log.job_name}</span>
                      </div>
                      <div className="text-gray-500">
                        {log.completed_at ? (
                          formatDistanceToNow(new Date(log.completed_at), { addSuffix: true })
                        ) : (
                          "Running..."
                        )}
                      </div>
                    </div>
                    
                    {log.error_message && (
                      <div className="mt-2 text-red-500 bg-red-50 p-2 rounded text-xs">
                        {log.error_message}
                      </div>
                    )}
                    
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <div>
                        Started: {format(new Date(log.started_at), 'MMM d, yyyy HH:mm:ss')}
                      </div>
                      {log.completed_at && (
                        <div>
                          Completed: {format(new Date(log.completed_at), 'MMM d, yyyy HH:mm:ss')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="errors" className="border rounded-md p-4 max-h-96 overflow-y-auto">
            {errorLogs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No error logs found. Click "Refresh Logs" to load data.</p>
            ) : (
              <div className="space-y-3">
                {errorLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="border border-red-200 bg-red-50 rounded p-3 text-sm"
                  >
                    <div className="flex justify-between">
                      <div>
                        <Badge variant="destructive" className="font-bold">
                          {log.level}
                        </Badge>
                        <Badge variant="outline" className="ml-2">
                          {log.category}
                        </Badge>
                      </div>
                      <div className="text-gray-500">
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    
                    <div className="mt-3 text-red-700">
                      {log.message}
                    </div>
                    
                    {log.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-600 cursor-pointer">
                          Show details
                        </summary>
                        <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-500">
                      {format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter>
        <p className="text-xs text-gray-500">
          Note: Article generation will run automatically each hour via scheduled cron job.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AdminControls;
