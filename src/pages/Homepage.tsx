
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterModal from '@/components/NewsletterModal';
import CookieConsent from '@/components/CookieConsent';
import NewsletterForm from '@/components/NewsletterForm';
import ArticleCard from '@/components/ArticleCard';
import HeroCarousel from '@/components/HeroCarousel';
import AdminControls from '@/components/AdminControls';
import { Button } from '@/components/ui/button';
import { useArticles } from '@/hooks/useArticles';
import { format } from 'date-fns';

const Homepage = () => {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const { articles, isLoading, hasMore, loadMore } = useArticles({ limit: 6, offset });

  // Fetch articles for each category section
  const { articles: startupArticles, isLoading: isLoadingStartups } = useArticles({ 
    limit: 3, category: 'startups' 
  });
  
  const { articles: aiArticles, isLoading: isLoadingAI } = useArticles({ 
    limit: 3, category: 'ai' 
  });
  
  const { articles: fundingArticles, isLoading: isLoadingFunding } = useArticles({ 
    limit: 3, category: 'funding' 
  });

  // Format hero slides from articles
  const heroSlides = articles.slice(0, 5).map(article => ({
    id: article.id,
    title: article.title,
    excerpt: article.summary,
    imageUrl: article.cover_image_url,
    category: article.category,
    author: 'MoveSmart',
    publishedAt: format(new Date(article.created_at), 'MMMM dd, yyyy'),
    slug: article.slug
  }));

  const handleLoadMore = () => {
    setOffset(loadMore());
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-950 dark:text-white">
      <Header />
      
      <main className="flex-grow">
        {/* Admin Controls - only visible in development */}
        {import.meta.env.DEV && <AdminControls />}
        
        {/* Hero Section with Carousel */}
        <section className="container mx-auto px-4 py-6">
          {isLoading ? (
            <div className="h-[500px] md:h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          ) : (
            <HeroCarousel slides={heroSlides} />
          )}
        </section>
        
        {/* Latest Articles Section */}
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
                      onClick={handleLoadMore}
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
        
        {/* Category Sections */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2">Startup Spotlight</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Innovative companies making waves in the tech ecosystem</p>
            
            {isLoadingStartups ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : startupArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {startupArticles.map(article => (
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
                <p className="text-gray-500 dark:text-gray-400">No startup articles available</p>
                <Button 
                  onClick={() => navigate('/startups')} 
                  variant="link" 
                  className="mt-2"
                >
                  Explore Startups
                </Button>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => navigate('/startups')}
                className="min-w-[200px]"
              >
                View All Startups
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2">AI Innovation</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Latest breakthroughs in artificial intelligence and machine learning</p>
            
            {isLoadingAI ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : aiArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiArticles.map(article => (
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
                <p className="text-gray-500 dark:text-gray-400">No AI articles available</p>
                <Button 
                  onClick={() => navigate('/ai')} 
                  variant="link" 
                  className="mt-2"
                >
                  Explore AI
                </Button>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => navigate('/ai')}
                className="min-w-[200px]"
              >
                View All AI Articles
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2">Funding News</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Latest investment rounds and venture capital activity</p>
            
            {isLoadingFunding ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : fundingArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {fundingArticles.map(article => (
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
                <p className="text-gray-500 dark:text-gray-400">No funding articles available</p>
                <Button 
                  onClick={() => navigate('/funding')} 
                  variant="link" 
                  className="mt-2"
                >
                  Explore Funding
                </Button>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => navigate('/funding')}
                className="min-w-[200px]"
              >
                View All Funding News
              </Button>
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-16 bg-brand-dark text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Ahead of the Curve</h2>
              <p className="text-gray-300 mb-8">
                Join thousands of founders, investors, and tech enthusiasts receiving our weekly newsletter with the latest startup insights.
              </p>
              <div className="max-w-md mx-auto">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <NewsletterModal delayInSeconds={15} />
      <CookieConsent />
    </div>
  );
};

export default Homepage;
