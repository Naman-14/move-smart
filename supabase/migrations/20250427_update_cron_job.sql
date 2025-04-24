
-- Update the cron job to run hourly, with better error handling and reporting
-- First drop existing cron job if it exists
SELECT cron.unschedule('movesmart-article-generation-hourly');

-- Create a new cron job with improved error handling
SELECT cron.schedule(
  'movesmart-article-generation-hourly',
  '0 * * * *', -- Run every hour at minute 0
  $$
  BEGIN
    -- Record attempt in the logs table
    INSERT INTO public.logs (level, category, message, details)
    VALUES ('info', 'cron_job', 'Starting scheduled article generation', jsonb_build_object('timestamp', now()));

    -- Record attempt in cron_run_logs
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
    
    -- Log successful completion
    INSERT INTO public.logs (level, category, message, details)
    VALUES ('info', 'cron_job', 'Scheduled article generation completed', jsonb_build_object('timestamp', now()));
    
  EXCEPTION WHEN OTHERS THEN
    -- Log the error
    INSERT INTO public.logs (level, category, message, details)
    VALUES ('error', 'cron_job', 'Scheduled article generation failed', 
      jsonb_build_object(
        'error', SQLERRM,
        'detail', SQLSTATE,
        'timestamp', now()
      )
    );
    
    -- Update cron run log
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
COMMENT ON CRON.JOB movesmart-article-generation-hourly IS 'Generates new AI-powered articles hourly with error tracking';
