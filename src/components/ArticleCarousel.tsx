
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArticleCard from './ArticleCard';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Article {
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  category: string;
  slug: string;
  author?: string;
  readingTime?: number;
}

interface ArticleCarouselProps {
  articles: Article[];
  title: string;
  autoSlideInterval?: number; // in milliseconds
  showControls?: boolean;
}

const ArticleCarousel = ({
  articles,
  title,
  autoSlideInterval = 5000, // Default to 5 seconds
  showControls = true
}: ArticleCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();
  
  const totalSlides = Math.ceil(articles.length / 3); // Show 3 items per slide
  
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

  // No carousel if there's only one article
  if (articles.length <= 1) {
    return articles.length === 1 ? (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <ArticleCard {...articles[0]} />
      </div>
    ) : null;
  }

  // Get current slide articles
  const getSlideArticles = (slideIndex: number) => {
    const startIndex = slideIndex * 3;
    return articles.slice(startIndex, startIndex + 3);
  };
  
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div 
          className="flex transition-transform duration-500"
          style={{ 
            width: `${totalSlides * 100}%`, 
            transform: `translateX(-${(currentSlide / totalSlides) * 100}%)` 
          }}
        >
          {[...Array(totalSlides)].map((_, slideIndex) => (
            <div 
              key={slideIndex} 
              className="flex gap-4"
              style={{ width: `${100 / totalSlides}%` }}
            >
              {getSlideArticles(slideIndex).map((article, articleIndex) => (
                <div 
                  key={articleIndex} 
                  className="flex-1"
                  style={{ minWidth: `${100 / 3}%` }}
                >
                  <ArticleCard 
                    title={article.title} 
                    excerpt={article.excerpt} 
                    imageUrl={article.imageUrl} 
                    date={article.date}
                    category={article.category}
                    slug={article.slug}
                    author={article.author}
                    readingTime={article.readingTime}
                  />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
        
        {/* Navigation controls */}
        {showControls && totalSlides > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center pointer-events-none">
            <Button 
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="ml-2 bg-white/80 shadow-md pointer-events-auto"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous articles</span>
            </Button>
            
            <Button 
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="mr-2 bg-white/80 shadow-md pointer-events-auto"
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next articles</span>
            </Button>
          </div>
        )}
      </div>
      
      {/* Slide indicators */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-1 mt-4">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-6 bg-parrot-green' : 'w-2 bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleCarousel;
