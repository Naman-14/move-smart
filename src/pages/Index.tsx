import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterModal from '@/components/NewsletterModal';
import CookieConsent from '@/components/CookieConsent';
import NewsletterForm from '@/components/NewsletterForm';
import FeaturedArticle from '@/components/FeaturedArticle';
import ArticleCard from '@/components/ArticleCard';
import StartupCard from '@/components/StartupCard';
import ArticleCarousel from '@/components/ArticleCarousel';
import ContentFilter, { ContentFilters } from '@/components/ContentFilter';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Article {
  id: string;
  title: string;
  excerpt?: string;
  summary: string;
  imageUrl?: string;
  cover_image_url: string;
  date?: string;
  created_at: string;
  category: string;
  slug: string;
}

const mockFeaturedArticle = {
  id: 'featured-001',
  title: 'How Notion Disrupted the Productivity Software Market',
  excerpt: 'A deep dive into Notion\'s meteoric rise, innovative product strategy, and how it captured a devoted user base in a crowded market.',
  summary: 'A deep dive into Notion\'s meteoric rise, innovative product strategy, and how it captured a devoted user base in a crowded market.',
  imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&fit=crop&auto=format',
  cover_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&fit=crop&auto=format',
  date: 'April 15, 2023',
  created_at: '2023-04-15T12:00:00Z',
  slug: 'notion-disruption',
  category: 'Case Study'
};

const mockArticles: Article[] = [
  {
    id: 'article-001',
    title: 'OpenAI Secures $2B in New Funding Round',
    summary: 'The AI research lab behind ChatGPT has raised additional funding to accelerate product development and expand operations globally.',
    cover_image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2940&auto=format&fit=crop',
    created_at: '2023-04-10T12:00:00Z',
    category: 'Funding News',
    slug: 'openai-funding'
  },
  {
    id: 'article-002',
    title: 'The Rise of Vertical SaaS: Industry-Specific Software Solutions',
    summary: 'How specialized software is creating massive value by catering to industry-specific needs, unlike horizontal solutions.',
    cover_image_url: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2940&auto=format&fit=crop',
    created_at: '2023-04-05T12:00:00Z', 
    category: 'Tech Trends',
    slug: 'vertical-saas'
  },
  {
    id: 'article-003',
    title: 'FinTech Revolution in Emerging Markets',
    summary: 'How innovative payment solutions are transforming financial inclusion in regions with limited banking infrastructure.',
    cover_image_url: 'https://images.unsplash.com/photo-1613243555988-441166d4d6fd?q=80&w=2940&auto=format&fit=crop',
    created_at: '2023-03-28T12:00:00Z',
    category: 'Market Analysis',
    slug: 'fintech-emerging-markets'
  }
];

const trendingArticles: Article[] = [
  {
    id: 'trending-001',
    title: 'How Plaid Built the Fintech API Infrastructure',
    summary: 'A deep dive into how Plaid created the essential infrastructure that powers thousands of fintech applications.',
    cover_image_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2940&auto=format&fit=crop',
    created_at: '2023-04-18T12:00:00Z',
    category: 'Tech Deep Dive',
    slug: 'plaid-api-infrastructure'
  },
  {
    id: 'trending-002',
    title: 'The Tech Behind Stripe\'s Success Story',
    summary: 'How Stripe revolutionized online payments and became the backbone of internet commerce.',
    cover_image_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2940&auto=format&fit=crop',
    created_at: '2023-04-14T12:00:00Z',
    category: 'Case Study',
    slug: 'stripe-success-story'
  },
  {
    id: 'trending-003',
    title: 'Figma\'s Path to a $20B Valuation',
    summary: 'The design tool that changed collaboration and caught Adobe\'s attention with a revolutionary product approach.',
    cover_image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2940&auto=format&fit=crop',
    created_at: '2023-04-08T12:00:00Z',
    category: 'Growth Analysis',
    slug: 'figma-valuation'
  },
  {
    id: 'trending-004',
    title: 'How Discord Built a Community-First Platform',
    summary: 'The evolution of Discord from gaming chat to a versatile community platform worth billions.',
    cover_image_url: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=2940&auto=format&fit=crop',
    created_at: '2023-04-02T12:00:00Z',
    category: 'Community Building',
    slug: 'discord-community'
  }
];

const mockStartups = [
  {
    name: 'Vercel',
    description: 'Frontend cloud platform that enables developers to build and deploy web applications with unprecedented speed and scale.',
    logoUrl: '',
    founded: '2015',
    category: 'Developer Tools',
    businessModel: 'SaaS',
    fundingStage: 'Series C',
    slug: 'vercel'
  },
  {
    name: 'Anthropic',
    description: 'AI safety company working on building reliable, interpretable, and steerable AI systems.',
    logoUrl: '',
    founded: '2021',
    category: 'Artificial Intelligence',
    businessModel: 'Research & Commercial',
    fundingStage: 'Series B',
    slug: 'anthropic'
  },
  {
    name: 'Stripe',
    description: 'Financial infrastructure platform for businesses to accept payments, send payouts, and manage their businesses online.',
    logoUrl: '',
    founded: '2010',
    category: 'FinTech',
    businessModel: 'Payment Processing',
    fundingStage: 'Late Stage',
    slug: 'stripe'
  }
];

const filterCategories = [
  { id: 'tech-trends', label: 'Tech Trends' },
  { id: 'case-study', label: 'Case Study' },
  { id: 'funding-news', label: 'Funding News' },
  { id: 'market-analysis', label: 'Market Analysis' }
];

const filterRegions = [
  { id: 'north-america', label: 'North America' },
  { id: 'europe', label: 'Europe' },
  { id: 'asia-pacific', label: 'Asia Pacific' },
  { id: 'latin-america', label: 'Latin America' }
];

const filterFundingStages = [
  { id: 'seed', label: 'Seed' },
  { id: 'series-a', label: 'Series A' },
  { id: 'series-b', label: 'Series B' },
  { id: 'series-c', label: 'Series C' },
  { id: 'late-stage', label: 'Late Stage' }
];

const filterTags = [
  { id: 'ai', label: 'AI' },
  { id: 'saas', label: 'SaaS' },
  { id: 'fintech', label: 'FinTech' },
  { id: 'health-tech', label: 'Health Tech' },
  { id: 'clean-tech', label: 'Clean Tech' }
];

const Index = () => {
  const [filters, setFilters] = useState<ContentFilters>({
    search: '',
    categories: [],
    regions: [],
    fundingStages: [],
    tags: []
  });

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-950 dark:text-white">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-parrot-soft-green to-white dark:from-brand-dark dark:to-gray-900 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight dark:text-white">
                The Global Tech <span className="text-parrot-green">Startup Pulse</span>
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                Get the latest tech startup news, case studies, funding updates, and innovative ideas from around the world.
              </p>
              <div className="max-w-md mx-auto">
                <NewsletterForm variant="inline" />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Latest Insights</h2>
            
            <ContentFilter 
              categories={[
                { id: 'tech-trends', label: 'Tech Trends' },
                { id: 'case-study', label: 'Case Study' },
                { id: 'funding-news', label: 'Funding News' },
                { id: 'market-analysis', label: 'Market Analysis' }
              ]}
              regions={[
                { id: 'north-america', label: 'North America' },
                { id: 'europe', label: 'Europe' },
                { id: 'asia-pacific', label: 'Asia Pacific' },
                { id: 'latin-america', label: 'Latin America' }
              ]}
              fundingStages={[
                { id: 'seed', label: 'Seed' },
                { id: 'series-a', label: 'Series A' },
                { id: 'series-b', label: 'Series B' },
                { id: 'series-c', label: 'Series C' },
                { id: 'late-stage', label: 'Late Stage' }
              ]}
              tags={[
                { id: 'ai', label: 'AI' },
                { id: 'saas', label: 'SaaS' },
                { id: 'fintech', label: 'FinTech' },
                { id: 'health-tech', label: 'Health Tech' },
                { id: 'clean-tech', label: 'Clean Tech' }
              ]}
              onFilterChange={setFilters}
            />
            
            <div className="mb-12">
              <FeaturedArticle 
                title={mockFeaturedArticle.title}
                excerpt={mockFeaturedArticle.summary}
                imageUrl={mockFeaturedArticle.cover_image_url}
                date={mockFeaturedArticle.date || new Date(mockFeaturedArticle.created_at).toLocaleDateString()}
                slug={mockFeaturedArticle.slug}
                category={mockFeaturedArticle.category}
              />
            </div>
            
            <ArticleCarousel 
              title="Trending Stories" 
              articles={trendingArticles} 
              autoSlideInterval={5000} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {mockArticles.map((article, index) => (
                <ArticleCard key={index} 
                  title={article.title}
                  excerpt={article.summary}
                  imageUrl={article.cover_image_url}
                  date={article.date || new Date(article.created_at).toLocaleDateString()}
                  category={article.category}
                  slug={article.slug}
                />
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/archive">
                <Button variant="outline" className="border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                  View All Articles
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-16 dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2 text-center">Featured Startups</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              In-depth analyses of innovative companies changing the tech landscape through disruptive products and business models.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {mockStartups.map((startup, index) => (
                <StartupCard key={index} {...startup} />
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/startups">
                <Button variant="outline" className="border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                  Explore All Startups
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
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
      <NewsletterModal delayInSeconds={10} />
      <CookieConsent />
    </div>
  );
};

export default Index;
