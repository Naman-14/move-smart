
import { useArticles } from '@/hooks/useArticles';
import ArticleCarousel from '@/components/ArticleCarousel';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  description: string;
  category: string;
  route: string;
}

const CategorySection = ({ 
  title, 
  description, 
  category, 
  route 
}: CategorySectionProps) => {
  const { articles, isLoading } = useArticles({ 
    limit: 3,
    category 
  });
  
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
      <section className="container mx-auto px-4 py-12">
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
    return (
      <section className="container mx-auto px-4 py-12 border-t border-gray-100 dark:border-gray-800">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl">{description}</p>
        </div>
        <div className="text-center p-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No articles available in this category yet.</p>
          <Button asChild variant="outline">
            <Link to="/">
              Browse other categories
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12 border-t border-gray-100 dark:border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl">{description}</p>
        </div>
        <Button variant="outline" asChild className="mt-3 md:mt-0">
          <Link to={route} className="flex items-center">
            View all {category} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map(article => (
          <ArticleCard 
            key={article.id}
            article={article}
          />
        ))}
      </div>
    </section>
  );
};

// Create a styled ArticleCard component for consistency
const ArticleCard = ({ article }) => {
  return (
    <Link to={`/article/${article.slug}`} className="block h-full group">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="h-48 relative">
          <img 
            src={article.cover_image_url} 
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/800x400?text=MoveSmart';
            }}
          />
          <div className="absolute top-0 right-0 p-2">
            <div className="bg-parrot-green text-white text-xs font-medium px-2.5 py-0.5 rounded">
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </div>
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-bold text-lg mb-2 group-hover:text-parrot-green transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
            {article.summary}
          </p>
          
          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500">
            <span>{article.author || 'MoveSmart'}</span>
            <span>{article.reading_time || 3} min read</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategorySection;
