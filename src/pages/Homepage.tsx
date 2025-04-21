import { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '@/components/HeroCarousel';
import CategoryTabs from '@/components/CategoryTabs';
import ArticleCard from '@/components/ArticleCard';
import TrendingSidebar from '@/components/TrendingSidebar';
import ArticleCarousel from '@/components/ArticleCarousel';
import FeaturedArticle from '@/components/FeaturedArticle';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedNewsletterForm from '@/components/EnhancedNewsletterForm';
import { Search, ArrowRight } from 'lucide-react';

// Mock data
const heroSlides = [
  {
    id: '1',
    title: 'Anthropic Unveils Claude 3.5 Sonnet: The New SOTA AI Assistant',
    excerpt: 'The latest model from Anthropic outperforms GPT-4 on various benchmarks while maintaining strong safety features and reasoning capabilities.',
    imageUrl: 'https://images.unsplash.com/photo-1562408590-e32931084e23?q=80&w=3270&auto=format&fit=crop',
    category: 'AI',
    author: 'Sarah Johnson',
    publishedAt: 'April 20, 2025',
    slug: 'anthropic-claude-35-sonnet'
  },
  {
    id: '2',
    title: 'Stripe Acquires Fintech Startup Anchor for $1.5B to Expand Financial Services',
    excerpt: 'The payments giant makes its largest acquisition to date, signaling a strategic move into broader financial services infrastructure.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2940&auto=format&fit=crop',
    category: 'Fintech',
    author: 'Michael Chen',
    publishedAt: 'April 18, 2025',
    slug: 'stripe-acquires-anchor'
  },
  {
    id: '3',
    title: "Inside Notion's Product Strategy: How They Built a $10B Company",
    excerpt: 'An exclusive look at how Notion evolved from a struggling startup to a productivity powerhouse valued at over $10 billion.',
    imageUrl: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=2070&auto=format&fit=crop',
    category: 'Case Study',
    author: 'Emma Richards',
    publishedAt: 'April 15, 2025',
    slug: 'notion-product-strategy'
  }
];

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

const latestArticles = [
  {
    id: '1',
    title: 'How Plaid Built the Financial Data Infrastructure Powering Thousands of Fintech Apps',
    excerpt: 'A deep dive into how Plaid created and scaled the critical infrastructure that fuels the modern fintech ecosystem.',
    imageUrl: 'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?q=80&w=2201&auto=format&fit=crop',
    date: 'April 19, 2025',
    category: 'Case Study',
    slug: 'plaid-financial-infrastructure'
  },
  {
    id: '2',
    title: 'The Rise of Vertical SaaS: Industry-Specific Solutions Taking Over',
    excerpt: 'How specialized software companies are creating massive value by focusing on specific industries rather than horizontal solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop',
    date: 'April 18, 2025',
    category: 'SaaS',
    slug: 'vertical-saas-rise'
  },
  {
    id: '3',
    title: "OpenAI's New Fund Invests $1B in AI Safety Research and Alignment",
    excerpt: 'The creator of ChatGPT announces a major initiative to support research on AI alignment, safety, and beneficial AGI development.',
    imageUrl: 'https://images.unsplash.com/photo-1677442135132-141996581d28?q=80&w=2070&auto=format&fit=crop',
    date: 'April 17, 2025',
    category: 'AI',
    slug: 'openai-safety-fund'
  },
  {
    id: '4',
    title: "Figma's Path to a $20B Acquisition: Lessons from the Design Leader",
    excerpt: 'How Figma revolutionized collaborative design and became Adobe\'s largest acquisition target in history.',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2964&auto=format&fit=crop',
    date: 'April 16, 2025',
    category: 'Case Study',
    slug: 'figma-acquisition-path'
  }
];

const trendingArticles = [
  {
    id: '1',
    title: "Y Combinator's Winter 2025 Batch: Top 10 Startups to Watch",
    excerpt: "An exclusive look at the most promising startups from YC's latest cohort.",
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    date: 'April 20, 2025',
    category: 'Startups',
    slug: 'yc-winter-2025'
  },
  {
    id: '2',
    title: "DeepMind's New Multimodal Model Achieves Breakthrough in Scientific Discovery",
    excerpt: 'The Google subsidiary unveils an AI system that can propose novel scientific hypotheses.',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2964&auto=format&fit=crop',
    date: 'April 19, 2025',
    category: 'AI',
    slug: 'deepmind-multimodal'
  },
  {
    id: '3',
    title: 'How Discord Built a Community-First Platform Worth Billions',
    excerpt: 'The evolution of Discord from gaming chat to versatile community platform.',
    imageUrl: 'https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?q=80&w=2574&auto=format&fit=crop',
    date: 'April 18, 2025',
    category: 'Case Study',
    slug: 'discord-community-platform'
  },
  {
    id: '4',
    title: "The Tech Behind Stripe's Success Story",
    excerpt: 'How Stripe revolutionized online payments and became the backbone of internet commerce.',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2940&auto=format&fit=crop',
    date: 'April 17, 2025',
    category: 'Case Study',
    slug: 'stripe-success-story'
  }
];

const editorsPicksArticles = [
  {
    id: '1',
    title: 'The Future of Remote Work: How Tech Companies Are Adapting',
    excerpt: 'An in-depth analysis of how the tech industry is reimagining workplace culture and collaboration in a distributed world.',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop',
    date: 'April 21, 2025',
    category: 'Analysis',
    slug: 'future-remote-work'
  },
  {
    id: '2',
    title: 'Bootstrapped to $10M: Lessons from Five Founders Who Skipped VC Funding',
    excerpt: 'Meet the entrepreneurs who built significant companies without raising venture capital and the strategies they used to succeed.',
    imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop',
    date: 'April 19, 2025',
    category: 'Founders',
    slug: 'bootstrapped-success-stories'
  },
  {
    id: '3',
    title: 'The AI Governance Gap: Policy Challenges for the Next Decade',
    excerpt: 'As AI capabilities accelerate, policymakers worldwide struggle to create effective oversight frameworks. Here\'s what\'s at stake.',
    imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2070&auto=format&fit=crop',
    date: 'April 18, 2025',
    category: 'Policy',
    slug: 'ai-governance-challenges'
  }
];

const categoryFeatured = {
  ai: [
    {
      id: '1',
      title: 'The Open-Source AI Revolution: How Competing Models Are Democratizing Advanced AI',
      excerpt: 'From Llama to Mistral, open-source models are challenging the dominance of proprietary AI systems like GPT-4 and Claude.',
      imageUrl: 'https://images.unsplash.com/photo-1677442135132-141996581d28?q=80&w=2070&auto=format&fit=crop',
      date: 'April 21, 2025',
      category: 'AI',
      slug: 'open-source-ai-revolution'
    },
    {
      id: '2',
      title: 'AI Safety Research: The Critical Path to Beneficial AGI',
      excerpt: 'How leading labs are working to ensure increasingly powerful AI systems remain aligned with human values and intentions.',
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2964&auto=format&fit=crop',
      date: 'April 20, 2025',
      category: 'AI',
      slug: 'ai-safety-research'
    },
    {
      id: '3',
      title: 'Enterprise AI Adoption: Beyond the Chatbot',
      excerpt: 'How innovative companies are implementing AI to transform core business processes and create sustainable competitive advantages.',
      imageUrl: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?q=80&w=2066&auto=format&fit=crop',
      date: 'April 18, 2025',
      category: 'AI',
      slug: 'enterprise-ai-adoption'
    }
  ],
  funding: [
    {
      id: '1',
      title: 'Climate Tech Funding Surges: $40B Invested in Q1 2025',
      excerpt: 'Venture capital flows into climate solutions reach record highs as investors bet on decarbonization technologies.',
      imageUrl: 'https://images.unsplash.com/photo-1569511166584-c11efb436e27?q=80&w=2069&auto=format&fit=crop',
      date: 'April 20, 2025',
      category: 'Funding',
      slug: 'climate-tech-funding-surge'
    },
    {
      id: '2',
      title: 'Biotech Startups Secure $15B in Series A Rounds',
      excerpt: 'Early-stage biotech companies focused on longevity and precision medicine attract unprecedented investor interest.',
      imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2070&auto=format&fit=crop',
      date: 'April 19, 2025',
      category: 'Funding',
      slug: 'biotech-series-a-rounds'
    },
    {
      id: '3',
      title: 'Tiger Global Returns to VC with New $5B Fund',
      excerpt: 'After a period of reduced activity, the influential investment firm unveils a new strategy targeting AI infrastructure and enterprise software.',
      imageUrl: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?q=80&w=2070&auto=format&fit=crop',
      date: 'April 17, 2025',
      category: 'Funding',
      slug: 'tiger-global-new-fund'
    }
  ]
};

const Homepage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // In a real app, this would filter articles by category
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      <Header />
      
      <main className="flex-grow">
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
        
        {/* Hero Carousel */}
        <section className="container mx-auto px-4 pt-4 pb-8">
          <HeroCarousel slides={heroSlides} autoplayInterval={7000} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {latestArticles.map(article => (
                  <ArticleCard key={article.id} {...article} />
                ))}
              </div>
              
              {/* Editor's Picks Section */}
              <div className="mt-12 mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Editor's Picks</h2>
                  <Link to="/editors-picks" className="flex items-center text-parrot-green hover:underline">
                    <span>View all</span>
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {editorsPicksArticles.map(article => (
                    <ArticleCard key={article.id} {...article} />
                  ))}
                </div>
              </div>
              
              {/* Featured Category: AI */}
              <div className="mt-12 mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">AI Innovation</h2>
                  <Link to="/ai" className="flex items-center text-parrot-green hover:underline">
                    <span>More AI stories</span>
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {categoryFeatured.ai.map(article => (
                    <ArticleCard key={article.id} {...article} />
                  ))}
                </div>
              </div>
              
              {/* Featured Category: Funding */}
              <div className="mt-12 mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Latest Funding</h2>
                  <Link to="/funding" className="flex items-center text-parrot-green hover:underline">
                    <span>More funding news</span>
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {categoryFeatured.funding.map(article => (
                    <ArticleCard key={article.id} {...article} />
                  ))}
                </div>
              </div>
              
              {/* Startup Profiles Carousel */}
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
                    articles={[
                      {
                        title: "Anthropic: Building AI Systems That Understand Human Values",
                        excerpt: "Founded by former OpenAI researchers, Anthropic focuses on developing safe and interpretable AI systems.",
                        imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2964&auto=format&fit=crop",
                        date: "Founded: 2021",
                        category: "AI Safety",
                        slug: "startup/anthropic"
                      },
                      {
                        title: "Stripe: Revolutionizing Internet Commerce Infrastructure",
                        excerpt: "How Stripe built the payments platform powering millions of businesses worldwide.",
                        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2940&auto=format&fit=crop",
                        date: "Founded: 2010",
                        category: "Fintech",
                        slug: "startup/stripe"
                      },
                      {
                        title: "Notion: The All-in-One Workspace for Teams",
                        excerpt: "Notion's journey from struggling startup to productivity powerhouse valued at over $10B.",
                        imageUrl: "https://images.unsplash.com/photo-1573164574230-db1d5e960238?q=80&w=2069&auto=format&fit=crop",
                        date: "Founded: 2013",
                        category: "Productivity",
                        slug: "startup/notion"
                      }
                    ]}
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
              
              <div className="text-center mt-8">
                <Button variant="outline" className="border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                  Load More Stories
                </Button>
              </div>
            </div>
            
            {/* Sidebar - 1/3 width */}
            <div className="lg:col-span-1">
              <TrendingSidebar trendingArticles={trendingArticles} />
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
