
-- Create source_fetches table to track article generation runs
CREATE TABLE IF NOT EXISTS public.source_fetches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  source TEXT NOT NULL,
  query TEXT,
  country TEXT,
  articles_fetched INTEGER DEFAULT 0,
  articles_processed INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' NOT NULL,
  error TEXT
);

-- If the generate_slug function doesn't exist, create it
CREATE OR REPLACE FUNCTION public.generate_slug(title text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Convert to lowercase, replace non-alphanumeric with hyphens, trim multiple hyphens
  base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9]', '-', 'g'));
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  -- Start with the base slug
  final_slug := base_slug;
  
  -- Check if the slug exists and append counter if it does
  WHILE EXISTS (SELECT 1 FROM articles WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$;
