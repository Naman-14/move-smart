import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { Database } from '@/integrations/supabase/types';

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image_url: string;
  tags: string[];
  created_at: string;
  category: string;
  author?: string;
  reading_time?: number;
  visible?: boolean; // Add this property to match usage in Index.tsx
  date?: string;     // Add this property to match usage in Index.tsx
}

interface UseArticlesOptions {
  limit?: number;
  category?: string;
  tags?: string[];
  featured?: boolean;
  offset?: number; // For pagination
}

export const useArticles = ({
  limit = 10,
  category,
  tags = [],
  featured = false,
  offset = 0
}: UseArticlesOptions = {}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true); // Track if more articles exist
  const [total, setTotal] = useState(0); // Track total article count
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log(`Fetching articles with: limit=${limit}, offset=${offset}, category=${category}, tags=${JSON.stringify(tags)}, featured=${featured}`);

        // First get the count of all matching articles (for pagination info)
        const countQuery = supabase
          .from('articles')
          .select('id', { count: 'exact' })
          .eq('visible', true);
          
        // Apply category filter if provided
        if (category) {
          countQuery.eq('category', category);
        }

        // Apply tags filter if provided
        if (tags && tags.length > 0) {
          countQuery.contains('tags', tags);
        }
        
        const { count: totalCount, error: countError } = await countQuery;
        
        if (countError) {
          console.error('Error fetching article count:', countError);
        } else if (totalCount !== null) {
          setTotal(totalCount);
          setHasMore(offset + limit < totalCount);
          console.log(`Found ${totalCount} total articles matching criteria`);
        }

        // Now fetch the actual articles
        let query = supabase
          .from('articles')
          .select('*')
          .eq('visible', true)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        // Apply category filter if provided
        if (category) {
          query = query.eq('category', category);
        }

        // Apply tags filter if provided
        if (tags && tags.length > 0) {
          // Use overlap for array intersection
          query = query.contains('tags', tags);
        }

        console.log('Executing Supabase query for articles');
        const { data, error } = await query;

        if (error) {
          console.error('Supabase error fetching articles:', error);
          throw new Error(error.message);
        }

        if (data && data.length > 0) {
          console.log(`Fetched ${data.length} articles successfully`);
          // If offset > 0, we're loading more, so append to existing
          if (offset > 0) {
            setArticles(prev => [...prev, ...data] as Article[]);
          } else {
            setArticles(data as Article[]);
          }
        } else {
          console.log('No articles returned from query');
          if (offset === 0) {
            setArticles([]);
          }
          // If we got no results and we're paginating, we've reached the end
          setHasMore(false);
        }
      } catch (error: any) {
        console.error('Error fetching articles:', error);
        setError(error.message);
        toast({
          title: 'Error fetching articles',
          description: 'Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [limit, offset, category, JSON.stringify(tags), featured, toast]);

  // Helper function to load more articles
  const loadMore = () => {
    if (hasMore && !isLoading) {
      return offset + limit;
    }
    return offset;
  };

  return { articles, isLoading, error, hasMore, total, loadMore };
};

export const useArticle = (slug: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        setError(null);

        console.log(`Fetching individual article with slug: ${slug}`);
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('visible', true)
          .eq('slug', slug)
          .maybeSingle();

        if (error) {
          console.error('Error fetching article:', error);
          throw new Error(error.message);
        }

        if (data) {
          console.log(`Successfully fetched article: ${data.title}`);
          setArticle(data as Article);
        } else {
          console.log(`No article found with slug: ${slug}`);
          setArticle(null);
          throw new Error('Article not found');
        }
      } catch (error: any) {
        console.error('Error fetching article:', error);
        setError(error.message);
        toast({
          title: 'Error fetching article',
          description: 'Article not found or has been removed.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug, toast]);

  return { article, isLoading, error };
};
