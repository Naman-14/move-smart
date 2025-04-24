
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Article {
  id: string;
  title: string;
  summary: string;
  slug: string;
  cover_image_url: string;
  category: string;
  created_at: string;
  author?: string;
  reading_time?: number;
  tags?: string[];
}

interface ArticleCarouselProps {
  articles: Article[];
  title: string;
  description?: string;
  autoSlideInterval?: number; // in milliseconds
  showControls?: boolean;
  itemsPerSlide?: number;
  className?: string;
}

const ArticleCarousel = ({
  articles,
  title,
  description,
  autoSlideInterval = 5000, // Default to 5 seconds
  showControls = true,
  itemsPerSlide = 3,
  className = ''
}: ArticleCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  
  // Calculate total slides based on articles length and items per slide
  const totalArticles = articles.length;
  const totalSlides = Math.max(1, Math.ceil(totalArticles / itemsPerSlide));
  
  // Handle auto-sliding
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, autoSlideInterval);
    
    return () => clearInterval(interval);
  }, [totalSlides, autoSlideInterval, isPaused]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);
  
  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Touch functionality for mobile swipe
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Threshold to determine if swipe was intentional
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    
    setTouchStart(null);
  };
  
  // If there are no articles, return a placeholder
  if (articles.length === 0) {
    return (
      <div className={`mb-8 ${className}`}>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const renderArticles = (startIdx: number) => {
    const endIdx = Math.min(startIdx + itemsPerSlide, totalArticles);
    const currentArticles = articles.slice(startIdx, endIdx);
    
    return currentArticles.map((article, idx) => (
      <div 
        key={article.id} 
        className="flex-1 min-w-0"
        style={{ minWidth: `${100 / Math.min(itemsPerSlide, totalArticles)}%` }}
      >
        <motion.div 
          whileHover={{ y: -5 }}
          className="mx-2"
        >
          <Link to={`/article/${article.slug}`} className="block h-full group">
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="h-40 relative">
                <img 
                  src={article.cover_image_url} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/800x400?text=MoveSmart';
                  }}
                />
                <div className="absolute top-0 right-0 p-2">
                  <Badge className="bg-parrot-green text-white hover:bg-parrot-green/90">
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold text-lg mb-2 group-hover:text-parrot-green transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">
                  {article.summary}
                </p>
                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span>{article.author || 'MoveSmart'}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{article.reading_time || 3} min</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    ));
  };

  return (
    <div className={`mb-12 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          {description && (
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
        {showControls && totalSlides > 1 && (
          <div className="flex gap-2 mt-3 md:mt-0">
            <Button 
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous articles</span>
            </Button>
            
            <Button 
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next articles</span>
            </Button>
          </div>
        )}
      </div>
      
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            className="flex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex w-full">
              {renderArticles(currentSlide * itemsPerSlide)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Slide indicators */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-1 mt-6">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === currentSlide ? "w-8 bg-parrot-green" : "w-1.5 bg-gray-300 dark:bg-gray-700"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleCarousel;
