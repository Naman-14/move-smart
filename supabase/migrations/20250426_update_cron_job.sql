
-- Update the cron job to run hourly, with better error handling and reporting
-- First drop existing cron job if it exists
SELECT cron.unschedule('movesmart-article-generation-hourly');

-- Create a new cron job with improved error handling
SELECT cron.schedule(
  'movesmart-article-generation-hourly',
  '0 * * * *', -- Run every hour at minute 0
  $$
  BEGIN
    -- Record attempt in a log table
    INSERT INTO public.cron_run_logs (job_name, status, started_at)
    VALUES ('article-generation', 'started', now());

    -- Make the HTTP request to trigger article generation
    PERFORM
      net.http_post(
        url:='https://uagckghgdqmioejsopzv.supabase.co/functions/v1/schedule-article-generation',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhZ2NrZ2hnZHFtaW9lanNvcHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjIzNDcsImV4cCI6MjA2MDgzODM0N30.wR2Dvyg9YAFwgwuHgHet5LlacS2YLulvDFZ4YVpBXP8"}'::jsonb,
        body:=concat('{"scheduled": true, "timestamp": "', now()::text, '"}')::jsonb
      );
      
    -- Update log with success
    UPDATE public.cron_run_logs 
    SET status = 'completed', completed_at = now()
    WHERE job_name = 'article-generation' AND completed_at IS NULL
    ORDER BY started_at DESC
    LIMIT 1;
    
  EXCEPTION WHEN OTHERS THEN
    -- Log the error
    UPDATE public.cron_run_logs 
    SET status = 'error', error_message = SQLERRM, completed_at = now()
    WHERE job_name = 'article-generation' AND completed_at IS NULL
    ORDER BY started_at DESC
    LIMIT 1;
    
    -- Raise again to ensure error is visible in logs
    RAISE;
  END;
  $$
);

-- Add comment to the job
COMMENT ON CRON.JOB movesmart-article-generation-hourly IS 'Generates new AI-powered articles hourly';

-- Create a table to track cron job runs if it doesn't exist
CREATE TABLE IF NOT EXISTS public.cron_run_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add index for faster queries by job name and status
CREATE INDEX IF NOT EXISTS idx_cron_run_logs_job_name ON public.cron_run_logs (job_name);
CREATE INDEX IF NOT EXISTS idx_cron_run_logs_status ON public.cron_run_logs (status);
