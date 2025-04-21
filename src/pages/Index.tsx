
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterModal from '@/components/NewsletterModal';
import CookieConsent from '@/components/CookieConsent';
import NewsletterForm from '@/components/NewsletterForm';
import FeaturedArticle from '@/components/FeaturedArticle';
import ArticleCard from '@/components/ArticleCard';
import StartupCard from '@/components/StartupCard';
import ContentFilter, { ContentFilters } from '@/components/ContentFilter';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Mock data for demonstration
const mockFeaturedArticle = {
  title: 'How Notion Disrupted the Productivity Software Market',
  excerpt: 'A deep dive into Notion\'s meteoric rise, innovative product strategy, and how it captured a devoted user base in a crowded market.',
  imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&fit=crop&auto=format',
  date: 'April 15, 2023',
  slug: 'notion-disruption',
  category: 'Case Study'
};

const mockArticles = [
  {
    title: 'OpenAI Secures $2B in New Funding Round',
    excerpt: 'The AI research lab behind ChatGPT has raised additional funding to accelerate product development and expand operations globally.',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2940&auto=format&fit=crop',
    date: 'April 10, 2023',
    category: 'Funding News',
    slug: 'openai-funding'
  },
  {
    title: 'The Rise of Vertical SaaS: Industry-Specific Software Solutions',
    excerpt: 'How specialized software is creating massive value by catering to industry-specific needs, unlike horizontal solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2940&auto=format&fit=crop',
    date: 'April 5, 2023',
    category: 'Tech Trends',
    slug: 'vertical-saas'
  },
  {
    title: 'FinTech Revolution in Emerging Markets',
    excerpt: 'How innovative payment solutions are transforming financial inclusion in regions with limited banking infrastructure.',
    imageUrl: 'https://images.unsplash.com/photo-1613243555988-441166d4d6fd?q=80&w=2940&auto=format&fit=crop',
    date: 'March 28, 2023',
    category: 'Market Analysis',
    slug: 'fintech-emerging-markets'
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

// Filter options
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
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-parrot-soft-green to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                The Global Tech <span className="text-parrot-green">Startup Pulse</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Get the latest tech startup news, case studies, funding updates, and innovative ideas from around the world.
              </p>
              <div className="max-w-md mx-auto">
                <NewsletterForm variant="inline" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Latest Articles Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="section-title text-center">Latest Insights</h2>
            
            <ContentFilter 
              categories={filterCategories}
              regions={filterRegions}
              fundingStages={filterFundingStages}
              tags={filterTags}
              onFilterChange={setFilters}
            />
            
            {/* Featured Article */}
            <div className="mb-12">
              <FeaturedArticle {...mockFeaturedArticle} />
            </div>
            
            {/* Regular Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {mockArticles.map((article, index) => (
                <ArticleCard key={index} {...article} />
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/archive">
                <Button variant="outline" className="btn-outline">
                  View All Articles
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Featured Startups Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="section-title text-center">Featured Startups</h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              In-depth analyses of innovative companies changing the tech landscape through disruptive products and business models.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {mockStartups.map((startup, index) => (
                <StartupCard key={index} {...startup} />
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/startups">
                <Button variant="outline" className="btn-outline">
                  Explore All Startups
                </Button>
              </Link>
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
      <NewsletterModal delayInSeconds={10} />
      <CookieConsent />
    </div>
  );
};

export default Index;
