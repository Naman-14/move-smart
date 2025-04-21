
import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface HeroSlide {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  publishedAt: string;
  slug: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoplayInterval?: number;
}

const HeroCarousel = ({ slides, autoplayInterval = 7000 }: HeroCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current === slides.length - 1 ? 0 : current + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [nextSlide, autoplayInterval, isPaused, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div 
      className="relative h-[500px] md:h-[600px] overflow-hidden rounded-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-0">
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-10">
            <Badge className="w-fit mb-4 bg-parrot-green hover:bg-parrot-green/90">
              {slide.category}
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
              {slide.title}
            </h2>
            <p className="text-white/80 mb-4 max-w-3xl line-clamp-3 md:line-clamp-2">
              {slide.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <p className="text-sm text-white/70">By {slide.author}</p>
                <span className="text-white/50">•</span>
                <p className="text-sm text-white/70">{slide.publishedAt}</p>
              </div>
              <Link to={`/article/${slide.slug}`}>
                <Button variant="secondary" className="hover:bg-white hover:text-black transition-colors">
                  Read More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex space-x-2 z-20">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-black/30 border-white/20 text-white hover:bg-white hover:text-black"
          onClick={prevSlide}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          className="bg-black/30 border-white/20 text-white hover:bg-white hover:text-black"
          onClick={nextSlide}
        >
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
