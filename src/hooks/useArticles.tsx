
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
}

interface UseArticlesOptions {
  limit?: number;
  category?: string;
  tags?: string[];
  featured?: boolean;
}

export const useArticles = ({
  limit = 10,
  category,
  tags = [],
  featured = false
}: UseArticlesOptions = {}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let query = supabase
          .from('articles')
          .select('*')
          .eq('visible', true)
          .order('created_at', { ascending: false });

        // Apply category filter if provided
        if (category) {
          query = query.eq('category', category);
        }

        // Apply tags filter if provided
        if (tags && tags.length > 0) {
          // Use overlap for array intersection
          query = query.contains('tags', tags);
        }

        // Apply limit
        query = query.limit(limit);

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          setArticles(data as Article[]);
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
  }, [limit, category, JSON.stringify(tags), toast]);

  return { articles, isLoading, error };
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

        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('visible', true)
          .eq('slug', slug)
          .maybeSingle();

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          setArticle(data as Article);
        }
      } catch (error: any) {
        console.error('Error fetching article:', error);
        setError(error.message);
        toast({
          title: 'Error fetching article',
          description: 'Please try again later.',
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
