
import { useNavigate } from 'react-router-dom';
import ArticleCard from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { useArticles } from '@/hooks/useArticles';
import { format } from 'date-fns';

interface CategorySectionProps {
  title: string;
  description: string;
  category: string;
  route: string;
}

const CategorySection = ({ title, description, category, route }: CategorySectionProps) => {
  const navigate = useNavigate();
  const { articles, isLoading } = useArticles({ limit: 3, category });

  return (
    <section className={`py-12 ${category === 'ai' ? 'bg-gray-50 dark:bg-gray-900' : ''}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map(article => (
              <ArticleCard
                key={article.id}
                title={article.title}
                excerpt={article.summary}
                imageUrl={article.cover_image_url}
                date={format(new Date(article.created_at), 'MMMM dd, yyyy')}
                category={article.category}
                slug={article.slug}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No {category} articles available</p>
            <Button 
              onClick={() => navigate(route)} 
              variant="link" 
              className="mt-2"
            >
              Explore {title}
            </Button>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => navigate(route)}
            className="min-w-[200px]"
          >
            View All {title}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
