
import { useArticles } from '@/hooks/useArticles';
import ArticleCarousel from '@/components/ArticleCarousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';

const LatestArticles = () => {
  const { articles, isLoading } = useArticles({ limit: 6 });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Set initial load state after a delay to prevent flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading || isInitialLoad) {
    return (
      <section className="container mx-auto px-4 py-10">
        <Skeleton className="h-8 w-72 mb-6" />
        <Skeleton className="h-6 w-full max-w-xl mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }
  
  if (articles.length === 0) {
    return null;
  }
  
  return (
    <section className="container mx-auto px-4 py-10 bg-gray-50 dark:bg-gray-900/50">
      <ArticleCarousel
        title="Latest Articles"
        description="Stay updated with the freshest content from across the tech ecosystem"
        articles={articles}
        autoSlideInterval={5000}
        className="mb-0"
      />
    </section>
  );
};

export default LatestArticles;
