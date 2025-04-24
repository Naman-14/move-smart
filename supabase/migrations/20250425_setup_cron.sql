
-- Enable required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Drop existing cron job if it exists
SELECT cron.unschedule('movesmart-article-generation-hourly');

-- Schedule hourly article generation
SELECT cron.schedule(
  'movesmart-article-generation-hourly',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
      url:='https://uagckghgdqmioejsopzv.supabase.co/functions/v1/schedule-article-generation',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhZ2NrZ2hnZHFtaW9lanNvcHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjIzNDcsImV4cCI6MjA2MDgzODM0N30.wR2Dvyg9YAFwgwuHgHet5LlacS2YLulvDFZ4YVpBXP8"}'::jsonb,
      body:=concat('{"scheduled": true, "timestamp": "', now()::text, '"}')::jsonb
    ) as request_id;
  $$
);

-- Add comment to the job
COMMENT ON CRON.JOB movesmart-article-generation-hourly IS 'Generates new AI-powered articles hourly';
