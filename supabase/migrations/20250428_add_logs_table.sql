
-- Create logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warning', 'error', 'critical')),
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS idx_logs_level_category ON public.logs (level, category);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs (created_at);

-- Add generation_errors table for tracking content generation failures
CREATE TABLE IF NOT EXISTS public.generation_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  stack TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS idx_generation_errors_category ON public.generation_errors (category);
CREATE INDEX IF NOT EXISTS idx_generation_errors_timestamp ON public.generation_errors (timestamp);
