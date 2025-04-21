
import { useState, useEffect, useCallback } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import ArticleCard from './ArticleCard';
import { useToast } from '@/components/ui/use-toast';

interface Article {
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  category: string;
  slug: string;
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
  const [api, setApi] = useState<any>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { toast } = useToast();

  // Handle auto sliding
  useEffect(() => {
    if (!api || articles.length <= 1) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, autoSlideInterval);
    
    return () => clearInterval(interval);
  }, [api, autoSlideInterval, articles.length]);
  
  // Update current slide indicator
  const handleSelect = useCallback(() => {
    if (!api) return;
    setCurrentSlide(api.selectedScrollSnap());
  }, [api]);
  
  useEffect(() => {
    if (!api) return;
    
    api.on('select', handleSelect);
    api.on('reInit', handleSelect);
    
    return () => {
      api.off('select', handleSelect);
      api.off('reInit', handleSelect);
    };
  }, [api, handleSelect]);

  // No carousel if there's only one article
  if (articles.length <= 1) {
    return articles.length === 1 ? (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <ArticleCard {...articles[0]} />
      </div>
    ) : null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      
      <Carousel setApi={setApi} className="relative">
        <CarouselContent>
          {articles.map((article, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <ArticleCard {...article} />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {showControls && (
          <>
            <CarouselPrevious className="left-2 lg:left-4" />
            <CarouselNext className="right-2 lg:right-4" />
          </>
        )}
        
        {/* Slide indicator dots */}
        <div className="flex justify-center gap-1 mt-4">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index ? 'w-6 bg-parrot-green' : 'w-2 bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default ArticleCarousel;
