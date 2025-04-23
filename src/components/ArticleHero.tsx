
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useArticles, Article } from '@/hooks/useArticles';

const ArticleHero = () => {
  const { articles, isLoading } = useArticles({ limit: 5, featured: true });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    if (!isLoading && articles.length > 0 && isAutoPlaying) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % articles.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoading, articles.length, isAutoPlaying]);

  // Pause auto-rotation when hovering
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Navigation functions
  const goToSlide = (index: number) => {
    setActiveIndex(index);
    // Briefly pause auto-rotation when manually navigating
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToPrevSlide = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? articles.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setActiveIndex((prevIndex) => 
      (prevIndex + 1) % articles.length
    );
  };

  // Touch handling for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Swipe threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left
        goToNextSlide();
      } else {
        // Swipe right
        goToPrevSlide();
      }
    }
    
    setTouchStart(null);
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] bg-gray-100 animate-pulse rounded-xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {articles.map((article, index) => (
        <ArticleSlide 
          key={article.id}
          article={article}
          isActive={index === activeIndex}
        />
      ))}
      
      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 rounded-full p-2 shadow-md hover:bg-white dark:hover:bg-gray-900 z-10"
        onClick={(e) => {
          e.preventDefault();
          goToPrevSlide();
        }}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 rounded-full p-2 shadow-md hover:bg-white dark:hover:bg-gray-900 z-10"
        onClick={(e) => {
          e.preventDefault();
          goToNextSlide();
        }}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              goToSlide(index);
            }}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              index === activeIndex 
                ? "bg-parrot-green w-6" 
                : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

interface ArticleSlideProps {
  article: Article;
  isActive: boolean;
}

const ArticleSlide = ({ article, isActive }: ArticleSlideProps) => {
  return (
    <Link 
      to={`/article/${article.slug}`}
      className={cn(
        "absolute inset-0 transition-opacity duration-700 ease-in-out",
        isActive ? "opacity-100 z-[5]" : "opacity-0 z-0"
      )}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${article.cover_image_url})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10 text-white">
        <Badge className="mb-3 bg-parrot-green hover:bg-parrot-green">
          {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
        </Badge>
        
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-white line-clamp-2">
          {article.title}
        </h2>
        
        <p className="text-gray-200 mb-4 line-clamp-2 md:line-clamp-3 max-w-3xl">
          {article.summary}
        </p>
        
        <Button className="bg-parrot-green hover:bg-parrot-green/90">
          Read Full Article
        </Button>
      </div>
    </Link>
  );
};

export default ArticleHero;
