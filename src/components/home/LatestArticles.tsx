
import { useNavigate } from 'react-router-dom';
import ArticleCard from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { useArticles } from '@/hooks/useArticles';
import { format } from 'date-fns';

const LatestArticles = () => {
  const navigate = useNavigate();
  const { articles, isLoading, hasMore, loadMore } = useArticles({ limit: 6 });

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Latest Stories</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            
            {hasMore && (
              <div className="mt-8 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => loadMore()}
                  disabled={isLoading}
                  className="min-w-[200px]"
                >
                  {isLoading ? 'Loading...' : 'Load More Stories'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No articles available</p>
            <Button onClick={() => navigate('/generate-content')} variant="default">
              Generate Content
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestArticles;
