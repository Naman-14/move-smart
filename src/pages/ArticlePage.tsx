
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Tag } from 'lucide-react';
import { useArticle, useArticles } from '@/hooks/useArticles';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import EnhancedNewsletterForm from '@/components/EnhancedNewsletterForm';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { article, isLoading, error } = useArticle(slug || '');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading article",
        description: "Could not load the requested article. Please try again.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Get related articles based on category and tags
  const { articles: relatedArticles } = useArticles({
    limit: 3,
    category: article?.category,
    // Exclude current article
    ...(article && { tags: article.tags.slice(0, 2) })
  });

  const filteredRelatedArticles = relatedArticles.filter(
    relatedArticle => relatedArticle.id !== article?.id
  ).slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
            <div className="h-96 w-full bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')} variant="default">
            Return to Home Page
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Format the date properly or provide a fallback
  let formattedDate;
  try {
    formattedDate = format(new Date(article.created_at), 'MMMM dd, yyyy');
  } catch (e) {
    formattedDate = 'Publication date unavailable';
    console.error('Date formatting error:', e);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-parrot-green">Home</Link>
            <ChevronRight size={14} className="mx-1" />
            <Link 
              to={`/category/${article.category}`} 
              className="hover:text-parrot-green"
            >
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="truncate max-w-xs">{article.title}</span>
          </div>
        </div>
        
        {/* Article Header */}
        <div className="container mx-auto px-4 mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap gap-2 items-center text-sm text-gray-500 mb-6">
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" />
              {formattedDate}
            </span>
            
            <span className="flex items-center ml-4">
              <Tag size={14} className="mr-1" />
              <Link 
                to={`/category/${article.category}`} 
                className="text-parrot-green hover:underline"
              >
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </Link>
            </span>
          </div>
        </div>
        
        {/* Featured Image */}
        <div className="container mx-auto px-4 mb-8">
          {article.cover_image_url && (
            <img 
              src={article.cover_image_url} 
              alt={article.title}
              className="w-full h-auto object-cover rounded-xl max-h-[500px]"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.src = 'https://placehold.co/800x400/EEE/31343C?text=MoveSmart';
                console.error('Failed to load article image:', article.cover_image_url);
              }}
            />
          )}
        </div>
        
        {/* Article Content */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Summary */}
              <div className="mb-8 text-lg font-medium text-gray-700 dark:text-gray-300">
                {article.summary}
              </div>
              
              {/* Main Content */}
              {article.content ? (
                <div
                  className="prose dark:prose-invert prose-lg max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : (
                <div className="prose dark:prose-invert prose-lg max-w-none mb-8">
                  <p>No content available for this article.</p>
                </div>
              )}
              
              {/* Tags */}
              <div className="mb-12">
                <div className="flex flex-wrap gap-2">
                  {article.tags && Array.isArray(article.tags) && article.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="hover:bg-gray-100">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Newsletter */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold mb-3">Stay Up to Date</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Get the latest startup news and industry insights delivered to your inbox.
                </p>
                <EnhancedNewsletterForm />
              </div>
              
              {/* Related Articles */}
              {filteredRelatedArticles.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Related Articles</h3>
                  <div className="space-y-6">
                    {filteredRelatedArticles.map(relatedArticle => (
                      <ArticleCard 
                        key={relatedArticle.id}
                        title={relatedArticle.title}
                        excerpt={relatedArticle.summary}
                        imageUrl={relatedArticle.cover_image_url}
                        date={format(new Date(relatedArticle.created_at), 'MMMM dd, yyyy')}
                        category={relatedArticle.category}
                        slug={relatedArticle.slug}
                        compact={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* More Articles */}
        <div className="container mx-auto px-4 py-12 mt-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-6">More From MoveSmart</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredRelatedArticles.length > 0 ? 
              filteredRelatedArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  excerpt={article.summary}
                  imageUrl={article.cover_image_url}
                  date={format(new Date(article.created_at), 'MMMM dd, yyyy')}
                  category={article.category}
                  slug={article.slug}
                />
              )) :
              <div className="col-span-3 text-center text-gray-500 py-8">
                <p>No related articles found</p>
                <Button onClick={() => navigate('/')} className="mt-4" variant="outline">
                  Explore All Articles
                </Button>
              </div>
            }
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticlePage;
