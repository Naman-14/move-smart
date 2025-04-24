
import { useState, useEffect } from 'react';
import HeroCarousel from '@/components/HeroCarousel';
import { useArticles } from '@/hooks/useArticles';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const HeroSection = () => {
  const { articles, isLoading } = useArticles({ 
    limit: 5,
    // Filter for articles with images to ensure good display
    // or from specific featured categories
  });
  
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Set initial load state after a delay to prevent flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Format hero slides from articles with proper error handling
  const heroSlides = articles.map(article => {
    // Format date safely
    let formattedDate;
    try {
      formattedDate = format(new Date(article.created_at), 'MMMM dd, yyyy');
    } catch (e) {
      formattedDate = 'Recent';
      console.error('Date formatting error:', e);
    }
    
    // Calculate reading time if not provided
    const readingTime = article.reading_time || 
      (article.content ? Math.ceil(article.content.length / 1000) : 3);
    
    return {
      id: article.id,
      title: article.title,
      excerpt: article.summary,
      imageUrl: article.cover_image_url,
      category: article.category,
      author: article.author || 'MoveSmart',
      publishedAt: formattedDate,
      slug: article.slug,
      readingTime: readingTime
    };
  });

  if (isLoading || isInitialLoad) {
    return (
      <section className="container mx-auto px-4 py-6">
        <Skeleton className="h-[500px] md:h-[600px] w-full rounded-lg" />
      </section>
    );
  }

  if (heroSlides.length === 0) {
    return (
      <section className="container mx-auto px-4 py-6">
        <div className="h-[300px] md:h-[400px] bg-gradient-to-r from-parrot-green/20 to-parrot-blue/20 rounded-lg flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Welcome to MoveSmart</h2>
            <p className="text-gray-600 dark:text-gray-300">
              The latest tech startup news, case studies, and funding updates. Check back soon for fresh content!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-6">
      <HeroCarousel slides={heroSlides} autoplayInterval={5000} />
    </section>
  );
};

export default HeroSection;
