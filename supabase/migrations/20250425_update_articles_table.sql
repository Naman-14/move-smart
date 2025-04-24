
-- Add reading_time and author fields to articles table
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 3;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author TEXT;

-- Add table for newsletter subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set RLS policies for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert to subscriptions" ON public.subscriptions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow service role select" ON public.subscriptions FOR SELECT TO service_role USING (true);
