import { useState } from 'react';
import { Link } from 'react-router-dom';
import ArticleHero from '@/components/ArticleHero';
import CategoryTabs from '@/components/CategoryTabs';
import ArticleCard from '@/components/ArticleCard';
import TrendingSidebar from '@/components/TrendingSidebar';
import ArticleCarousel from '@/components/ArticleCarousel';
import FeaturedArticle from '@/components/FeaturedArticle';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedNewsletterForm from '@/components/EnhancedNewsletterForm';
import AdminControls from '@/components/AdminControls';
import { Search, ArrowRight } from 'lucide-react';
import { useArticles } from '@/hooks/useArticles';
import { format } from 'date-fns';

// Categories data
const categories = [
  { id: 'all', name: 'All', slug: 'all' },
  { id: 'startups', name: 'Startups', slug: 'startups' },
  { id: 'funding', name: 'Funding', slug: 'funding' },
  { id: 'ai', name: 'AI', slug: 'ai' },
  { id: 'fintech', name: 'Fintech', slug: 'fintech' },
  { id: 'case-studies', name: 'Case Studies', slug: 'case-studies' },
  { id: 'blockchain', name: 'Blockchain', slug: 'blockchain' },
  { id: 'climate-tech', name: 'Climate Tech', slug: 'climate-tech' }
];

const Homepage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Fetch articles for different sections
  const { articles: latestArticles, isLoading: isLoadingLatest } = useArticles({ 
    limit: 4,
    ...(selectedCategory !== 'all' && { category: selectedCategory })
  });
  
  const { articles: aiArticles } = useArticles({ 
    limit: 3,
    category: 'ai'
  });
  
  const { articles: fundingArticles } = useArticles({ 
    limit: 3,
    category: 'funding'
  });
  
  // Fetch articles for the startups carousel
  const { articles: startupArticles } = useArticles({
    limit: 3,
    category: 'startups'
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Filter articles by category
  };

  // Transform articles for the startups carousel
  const startupCarouselArticles = startupArticles.map(article => ({
    title: article.title,
    excerpt: article.summary,
    imageUrl: article.cover_image_url,
    date: format(new Date(article.created_at), 'MMMM dd, yyyy'),
    category: article.category,
    slug: article.slug
  }));

  const mockTrendingArticles = [
    {
      id: '1',
      title: 'How Plaid Built the Fintech API Infrastructure',
      excerpt: 'A deep dive into how Plaid created the essential infrastructure that powers thousands of fintech applications.',
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2940&auto=format&fit=crop',
      date: 'April 18, 2023',
      category: 'Tech Deep Dive',
      slug: 'plaid-api-infrastructure'
    },
    {
      id: '2',
      title: 'The Tech Behind Stripe\'s Success Story',
      excerpt: 'How Stripe revolutionized online payments and became the backbone of internet commerce.',
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2940&auto=format&fit=crop',
      date: 'April 14, 2023',
      category: 'Case Study',
      slug: 'stripe-success-story'
    },
    {
      id: '3',
      title: 'Figma\'s Path to a $20B Valuation',
      excerpt: 'The design tool that changed collaboration and caught Adobe\'s attention with a revolutionary product approach.',
      imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2940&auto=format&fit=crop',
      date: 'April 8, 2023',
      category: 'Growth Analysis',
      slug: 'figma-valuation'
    },
    {
      id: '4',
      title: 'How Discord Built a Community-First Platform',
      excerpt: 'The evolution of Discord from gaming chat to a versatile community platform worth billions.',
      imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=2940&auto=format&fit=crop',
      date: 'April 2, 2023',
      category: 'Community Building',
      slug: 'discord-community'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      <Header />
      
      <main className="flex-grow">
        {/* Add AdminControls at the top of the main content */}
        <div className="container mx-auto px-4 mt-4">
          <AdminControls />
        </div>
        
        {/* Global Search Bar - Mobile Only */}
        <div className="md:hidden p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="search" 
              placeholder="Search for startups, articles, topics..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-full focus:outline-none focus:ring-1 focus:ring-parrot-green dark:bg-gray-900"
            />
          </div>
        </div>
        
        {/* Dynamic Hero Carousel */}
        <section className="container mx-auto px-4 pt-4 pb-8">
          <ArticleHero />
        </section>
        
        {/* Category Navigation */}
        <section className="container mx-auto px-4">
          <CategoryTabs categories={categories} onSelectCategory={handleCategorySelect} />
        </section>
        
        {/* Main Content + Sidebar */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column - 2/3 width */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Latest Stories</h2>
              
              {isLoadingLatest ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse" />
                  ))}
                </div>
              ) : latestArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {latestArticles.map(article => (
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
                <div className="text-center py-10 bg-gray-50 rounded-xl mb-8">
                  <p className="text-gray-500">No articles found</p>
                </div>
              )}
              
              {/* Featured Category: AI */}
              {aiArticles.length > 0 && (
                <div className="mt-12 mb-10">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">AI Innovation</h2>
                    <Link to="/ai" className="flex items-center text-parrot-green hover:underline">
                      <span>More AI stories</span>
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
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
                </div>
              )}
              
              {/* Featured Category: Funding */}
              {fundingArticles.length > 0 && (
                <div className="mt-12 mb-10">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Latest Funding</h2>
                    <Link to="/funding" className="flex items-center text-parrot-green hover:underline">
                      <span>More funding news</span>
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
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
                </div>
              )}
              
              {/* Startup Profiles Carousel */}
              {startupCarouselArticles.length > 0 && (
                <div className="mt-12 mb-10">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Startup Profiles</h2>
                    <Link to="/startups" className="flex items-center text-parrot-green hover:underline">
                      <span>Explore all startups</span>
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                    <ArticleCarousel
                      title=""
                      articles={startupCarouselArticles}
                      autoSlideInterval={6000}
                      showControls={true}
                    />
                    
                    <div className="text-center mt-6">
                      <Button asChild>
                        <Link to="/startups">
                          Explore All Startup Profiles
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-center mt-8">
                <Button variant="outline" className="border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                  Load More Stories
                </Button>
              </div>
            </div>
            
            {/* Sidebar - 1/3 width */}
            <div className="lg:col-span-1">
              <TrendingSidebar trendingArticles={mockTrendingArticles} />
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
                <EnhancedNewsletterForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Homepage;
