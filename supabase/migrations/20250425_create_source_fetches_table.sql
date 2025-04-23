
-- Create source_fetches table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.source_fetches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  source TEXT NOT NULL,
  query TEXT NOT NULL,
  country TEXT NOT NULL,
  articles_fetched INTEGER NOT NULL DEFAULT 0,
  articles_processed INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT
);

-- Add comment to the table
COMMENT ON TABLE public.source_fetches IS 'Records of article source data fetching operations';
