
-- Create source_fetches table for tracking content fetching operations
CREATE TABLE IF NOT EXISTS public.source_fetches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('started', 'fetched', 'completed', 'error', 'partial_success')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  articles_generated INTEGER,
  response_data JSONB
);

-- Add index for faster querying
CREATE INDEX IF NOT EXISTS idx_source_fetches_status ON public.source_fetches (status);
CREATE INDEX IF NOT EXISTS idx_source_fetches_created_at ON public.source_fetches (created_at);

-- Update supabase config to include new function schedules if needed
