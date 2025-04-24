
-- Create logs table for error tracking and system events
CREATE TABLE IF NOT EXISTS public.logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warning', 'error', 'critical')),
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create source_fetches table to track article source fetches
CREATE TABLE IF NOT EXISTS public.source_fetches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  query TEXT NOT NULL,
  status TEXT NOT NULL,
  params JSONB,
  response_data JSONB,
  articles_generated INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indices for faster querying
CREATE INDEX IF NOT EXISTS idx_logs_level ON public.logs (level);
CREATE INDEX IF NOT EXISTS idx_logs_category ON public.logs (category);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs (created_at);

CREATE INDEX IF NOT EXISTS idx_source_fetches_source ON public.source_fetches (source);
CREATE INDEX IF NOT EXISTS idx_source_fetches_status ON public.source_fetches (status);
CREATE INDEX IF NOT EXISTS idx_source_fetches_created_at ON public.source_fetches (created_at);
