
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Share2, ThumbsUp, Bookmark } from 'lucide-react';

// Mock data for demonstration purposes
const mockArticleData = {
  'notion-disruption': {
    title: 'How Notion Disrupted the Productivity Software Market',
    excerpt: 'A deep dive into Notion\'s meteoric rise, innovative product strategy, and how it captured a devoted user base in a crowded market.',
    fullContent: `
      <p>In a market dominated by established players like Evernote, Google Docs, and Microsoft Office, Notion managed to carve out a significant niche by rethinking the very concept of productivity software. By creating a flexible, all-in-one workspace that combined notes, tasks, wikis, and databases, Notion addressed a fundamental problem: the fragmentation of work across too many specialized tools.</p>
      <p>Founded in 2016 after a failed previous attempt, Notion represents one of the most interesting product-led growth stories in recent SaaS history. Let's dive deep into how they built a product that users love so much they spontaneously share it with their networks.</p>
    `,
    founders: 'Ivan Zhao, Simon Last',
    founded: '2016',
    problemStatement: 'Knowledge workers were using too many fragmented tools for notes, tasks, wikis, and databases, creating friction and reducing productivity.',
    solution: {
      product: 'All-in-one workspace combining notes, wikis, databases, and project management',
      techStack: 'React, Redux, PostgreSQL, Electron for desktop app',
      gtmStrategy: 'Product-led growth, bottom-up adoption starting with individual users who then advocated for team usage'
    },
    businessModel: 'Freemium SaaS with personal and team subscription tiers',
    tractionStrategy: 'Word of mouth, power user communities, template marketplace, and education-focused free tier',
    fundingHistory: [
      { round: 'Seed', date: 'March 2016', amount: '$2M', investors: 'First Round Capital, Elad Gil' },
      { round: 'Series A', date: 'July 2019', amount: '$10M', investors: 'Index Ventures' },
      { round: 'Series B', date: 'April 2020', amount: '$50M', investors: 'Index Ventures, Sequoia Capital' },
      { round: 'Series C', date: 'October 2021', amount: '$275M', investors: 'Sequoia Capital, Coatue' }
    ],
    challenges: 'Initial product was too complex for casual users; had to rebuild product completely after first version failed',
    status: 'Private company valued at $10B+ after Series C funding in 2021',
    lessons: 'Building an all-in-one tool that still feels focused is extremely difficult but can be revolutionary; giving users flexibility creates passionate ambassadors',
    aiSummary: 'Notion disrupted the productivity software market by creating a flexible all-in-one workspace that combined notes, tasks, wikis and databases, solving the problem of fragmented work tools. Founded in 2016 by Ivan Zhao and Simon Last, the company used a product-led growth strategy and freemium business model to achieve massive adoption. After raising $337M across four funding rounds, Notion is now valued at over $10B.',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&fit=crop&auto=format',
    date: 'April 15, 2023',
    category: 'Case Study',
    tags: ['SaaS', 'Productivity', 'Freemium']
  },
  'openai-funding': {
    title: 'OpenAI Secures $2B in New Funding Round',
    excerpt: 'The AI research lab behind ChatGPT has raised additional funding to accelerate product development and expand operations globally.',
    fullContent: `
      <p>OpenAI, the artificial intelligence research laboratory behind the groundbreaking ChatGPT and GPT-4 models, has secured an additional $2 billion in funding to accelerate its research and product development initiatives.</p>
      <p>The investment round was led by Microsoft with participation from existing investors and comes at a time when the company is facing increasing competition from other AI labs like Anthropic, Google's DeepMind, and various open-source efforts.</p>
    `,
    founders: 'Sam Altman, Greg Brockman, Ilya Sutskever, John Schulman, Wojciech Zaremba',
    founded: '2015',
    problemStatement: 'Advanced AI capabilities were restricted to a small number of researchers and companies, limiting innovation and application development.',
    solution: {
      product: 'API access to state-of-the-art language models, vision systems, and more',
      techStack: 'Python, PyTorch, distributed computing infrastructure',
      gtmStrategy: 'Freemium API access, direct enterprise partnerships, research publications'
    },
    businessModel: 'Freemium API access with usage-based pricing and enterprise contracts',
    tractionStrategy: 'Public research papers, impressive demos, free ChatGPT tier, developer community',
    fundingHistory: [
      { round: 'Seed', date: 'December 2015', amount: '$11M', investors: 'Sam Altman, Reid Hoffman, Peter Thiel, Elon Musk' },
      { round: 'Strategic Partnership', date: 'July 2019', amount: '$1B', investors: 'Microsoft' },
      { round: 'Series Unknown', date: 'January 2023', amount: '$10B', investors: 'Microsoft, a16z' },
      { round: 'Latest Round', date: 'April 2023', amount: '$2B', investors: 'Microsoft, existing investors' }
    ],
    challenges: 'Balancing open research with commercial applications; addressing safety and responsible AI concerns',
    status: 'Private company with multi-billion dollar valuation',
    lessons: 'Creating a safe path to artificial general intelligence requires both research excellence and commercial applications to fund ongoing work',
    aiSummary: 'OpenAI secured $2 billion in new funding led by Microsoft to accelerate its AI research and product development. Founded in 2015, the company behind ChatGPT and GPT-4 has transformed from a non-profit research lab to a commercial entity with a capped-profit structure. With a multi-billion dollar valuation, OpenAI continues to balance cutting-edge AI research with developing commercial applications that can fund its ultimate goal of safe artificial general intelligence.',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2940&auto=format&fit=crop',
    date: 'April 10, 2023',
    category: 'Funding News',
    tags: ['AI', 'Machine Learning', 'Funding']
  },
  'vertical-saas': {
    title: 'The Rise of Vertical SaaS: Industry-Specific Software Solutions',
    excerpt: 'How specialized software is creating massive value by catering to industry-specific needs, unlike horizontal solutions.',
    fullContent: `
      <p>While horizontal SaaS solutions like Salesforce and Slack serve companies across industries, vertical SaaS products are designed to address the specific needs of particular industries—from healthcare and real estate to construction and hospitality.</p>
      <p>This trend has been accelerating as founders with deep industry expertise identify pain points that generic software simply cannot address effectively.</p>
    `,
    founders: 'Various companies',
    founded: '2010-2023',
    problemStatement: 'Horizontal SaaS solutions often require extensive customization to meet industry-specific requirements, leading to higher costs and implementation challenges.',
    solution: {
      product: 'Purpose-built software addressing specific workflows, regulations, and terminology of particular industries',
      techStack: 'Varies by company, typically cloud-based architectures with industry-specific integrations',
      gtmStrategy: 'Industry-focused sales teams, trade show presence, vertical-specific marketing'
    },
    businessModel: 'SaaS subscription with industry-specific pricing models',
    tractionStrategy: 'Industry partnerships, regulatory compliance as a selling point, specialized feature set',
    fundingHistory: [
      { round: 'Various', date: '2020-2023', amount: '$12.3B across vertical SaaS companies', investors: 'Sector-focused VCs' }
    ],
    challenges: 'Smaller total addressable markets compared to horizontal solutions; need for deeper industry expertise',
    status: 'Growing segment within enterprise software',
    lessons: 'Deep domain expertise can be more valuable than technical innovation; solving specific problems well beats solving generic problems adequately',
    aiSummary: 'Vertical SaaS companies are creating significant value by developing industry-specific software solutions that address the unique requirements, workflows, and regulations of particular sectors. Unlike horizontal SaaS products that serve companies across industries, vertical solutions offer specialized features, terminology, and integrations that reduce implementation time and increase adoption. While they target smaller markets, vertical SaaS companies often achieve higher customer retention rates and can command premium pricing due to their specialized nature.',
    imageUrl: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2940&auto=format&fit=crop',
    date: 'April 5, 2023',
    category: 'Tech Trends',
    tags: ['SaaS', 'Vertical Markets', 'Enterprise Software']
  },
};

const Article = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call to fetch the article data
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (slug && mockArticleData[slug as keyof typeof mockArticleData]) {
          setArticle(mockArticleData[slug as keyof typeof mockArticleData]);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
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
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Article not found'}
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn't find the article you're looking for.
          </p>
          <Link to="/">
            <Button>Return to Homepage</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-96 bg-gray-900">
          <div className="absolute inset-0">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover opacity-60"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-8">
            <Badge className="mb-4 bg-parrot-blue hover:bg-parrot-blue/90">
              {article.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl">
              {article.title}
            </h1>
            <p className="text-gray-200 mb-6 max-w-3xl text-lg">
              {article.excerpt}
            </p>
            <div className="flex items-center text-gray-200 text-sm">
              <span>{article.date}</span>
              <span className="mx-2">•</span>
              <span>MoveSmart Editorial</span>
            </div>
          </div>
        </section>
        
        {/* Article Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* AI Summary */}
                <div className="bg-parrot-soft-green p-6 rounded-lg mb-8">
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    <span className="bg-parrot-green text-white text-xs py-1 px-2 rounded mr-2">AI</span> 
                    Summary
                  </h3>
                  <p className="text-gray-700">{article.aiSummary}</p>
                </div>
                
                {/* Article Body */}
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: article.fullContent }} />
                </div>

                {/* Social Interactions */}
                <div className="flex items-center gap-4 mt-12 border-t border-gray-200 pt-6">
                  <Button 
                    variant={liked ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setLiked(!liked)}
                    className={liked ? "bg-parrot-green hover:bg-parrot-green/90" : ""}
                  >
                    <ThumbsUp size={18} className="mr-2" />
                    {liked ? "Liked" : "Like"}
                  </Button>
                  
                  <Button 
                    variant={bookmarked ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setBookmarked(!bookmarked)}
                    className={bookmarked ? "bg-parrot-blue hover:bg-parrot-blue/90" : ""}
                  >
                    <Bookmark size={18} className="mr-2" />
                    {bookmarked ? "Saved" : "Save"}
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Share2 size={18} className="mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Startup Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                  <h3 className="text-xl font-bold mb-4 border-b border-gray-100 pb-2">Startup Profile</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm text-gray-500">Founders</h4>
                      <p className="font-medium">{article.founders}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500">Founded</h4>
                      <p className="font-medium">{article.founded}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500">Business Model</h4>
                      <p className="font-medium">{article.businessModel}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500">Current Status</h4>
                      <p className="font-medium">{article.status}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500">Tech Stack</h4>
                      <p className="font-medium">{article.solution.techStack}</p>
                    </div>
                  </div>
                </div>
                
                {/* Funding History */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                  <h3 className="text-xl font-bold mb-4 border-b border-gray-100 pb-2">Funding History</h3>
                  
                  <div className="space-y-6">
                    {article.fundingHistory.map((round: any, index: number) => (
                      <div key={index} className="relative pl-6 border-l border-gray-200">
                        <div className="absolute top-0 left-0 w-3 h-3 -ml-1.5 rounded-full bg-parrot-green"></div>
                        <h4 className="font-bold text-sm">{round.round} - {round.date}</h4>
                        <p className="text-lg font-bold text-parrot-green">{round.amount}</p>
                        <p className="text-sm text-gray-600">{round.investors}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Tags */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-bold mb-4 border-b border-gray-100 pb-2">Tags</h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-gray-50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Key Insights Section */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Key Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-2">Problem Statement</h3>
                <p className="text-gray-700">{article.problemStatement}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-2">Go-To-Market Strategy</h3>
                <p className="text-gray-700">{article.solution.gtmStrategy}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-2">Traction Strategy</h3>
                <p className="text-gray-700">{article.tractionStrategy}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-2">Challenges & Pivots</h3>
                <p className="text-gray-700">{article.challenges}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
              <h3 className="font-bold text-lg mb-2">Lessons Learned</h3>
              <p className="text-gray-700">{article.lessons}</p>
            </div>
          </div>
        </section>
        
        {/* Related Articles */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">You might also like</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(mockArticleData)
                .filter(([key]) => key !== slug)
                .slice(0, 3)
                .map(([key, article]: [string, any]) => (
                  <Link key={key} to={`/article/${key}`} className="block">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full border border-gray-100">
                      {article.imageUrl && (
                        <div className="h-48 relative">
                          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                          <Badge className="absolute top-3 left-3 bg-parrot-blue hover:bg-parrot-blue/90">
                            {article.category}
                          </Badge>
                        </div>
                      )}
                      <div className="p-5">
                        <p className="text-sm text-gray-500 mb-2">{article.date}</p>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
                        <p className="text-gray-600 line-clamp-3">{article.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Article;
