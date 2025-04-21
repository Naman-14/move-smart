
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Globe, MapPin, Calendar, Users, DollarSign, BarChart2, ArrowRight, GitBranch, Target, ThumbsUp, Bookmark, Share2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import NewsletterForm from '@/components/NewsletterForm';

// Mock startup data - In a real app, this would come from an API/database
const startupData = {
  name: 'Anthropic',
  tagline: 'Building reliable, interpretable, and steerable AI systems',
  description: 'Anthropic is an AI safety company that's working on developing reliable, interpretable, and steerable AI systems. Founded by former members of OpenAI, the company is focused on research aimed at building AI that's aligned with human values and can be trusted to act safely and beneficially.',
  longDescription: `
    <p class="text-lg mb-4">Founded in 2021, Anthropic emerged as a response to growing concerns about the safety and alignment challenges of increasingly powerful AI systems. The company was founded by Dario Amodei, former VP of Research at OpenAI, along with several other former OpenAI researchers who shared a vision for developing AI systems with better safety properties.</p>
    
    <h3 class="text-xl font-bold mt-8 mb-3">The Problem</h3>
    <p class="mb-4">As AI systems become more capable, ensuring they remain aligned with human values and beneficial intentions becomes increasingly difficult. Anthropic recognized that many AI systems were being developed with insufficient attention to safety, interpretability, and alignment issues that would become critical as these systems approached human-level capabilities in more domains.</p>
    
    <h3 class="text-xl font-bold mt-8 mb-3">The Solution</h3>
    <p class="mb-4">Anthropic's approach centers on developing techniques for training AI systems to be helpful, harmless, and honest - what they call "Constitutional AI." This involves creating AI assistants that can explain their reasoning, remain aligned with human values even as they improve, and resist manipulative or harmful requests.</p>
    
    <p class="mb-4">The company's flagship product, Claude, is an AI assistant designed with these principles in mind. Unlike many competitors, Anthropic has focused on making Claude's behavior more predictable, transparent, and aligned with human values from the ground up, rather than applying safety measures as an afterthought.</p>
    
    <h3 class="text-xl font-bold mt-8 mb-3">Technology & Innovation</h3>
    <p class="mb-4">Anthropic has pioneered several important techniques in AI alignment and safety:</p>
    <ul class="list-disc pl-5 space-y-2 mb-6">
      <li><strong>Constitutional AI</strong> - A method for training AI systems according to a set of principles rather than just optimizing for user satisfaction</li>
      <li><strong>RLHF (Reinforcement Learning from Human Feedback)</strong> - Advanced implementation of this approach to align AI with human preferences</li>
      <li><strong>Interpretability research</strong> - Developing methods to better understand how large language models work internally</li>
      <li><strong>Red-teaming</strong> - Rigorous testing of AI systems to find and fix potential harmful behaviors before deployment</li>
    </ul>
    
    <h3 class="text-xl font-bold mt-8 mb-3">Business Model & Growth</h3>
    <p class="mb-4">Anthropic operates with a hybrid business model. While conducting fundamental research on AI safety, the company also offers commercial access to Claude through its API and direct interfaces. This allows organizations to build applications powered by Claude while benefiting from Anthropic's focus on safety and reliability.</p>
    
    <p class="mb-4">The company has secured substantial funding, including investments from Google, Amazon, and other major technology firms, reflecting the strategic importance of its approach to AI development in an increasingly competitive landscape.</p>
    
    <h3 class="text-xl font-bold mt-8 mb-3">Challenges & Pivots</h3>
    <p class="mb-4">Anthropic faces several significant challenges:</p>
    <ul class="list-disc pl-5 space-y-2 mb-6">
      <li>Balancing commercial viability with research priorities</li>
      <li>Competing with larger, better-resourced companies like OpenAI, Google, and Meta</li>
      <li>Maintaining its safety-first approach while meeting user expectations for capabilities</li>
      <li>Navigating the complex regulatory environment emerging around AI systems</li>
    </ul>
    
    <p class="mb-4">While not executing a complete pivot, Anthropic has evolved from a purely research-focused organization to one that also delivers commercial products, necessitated by the capital-intensive nature of developing frontier AI systems.</p>
    
    <h3 class="text-xl font-bold mt-8 mb-3">Impact & Future Outlook</h3>
    <p class="mb-4">Anthropic has helped elevate industry standards for responsible AI development, demonstrating that safety and capability can advance in tandem. As AI capabilities continue to increase, Anthropic's research and products are likely to play an important role in establishing norms and techniques for ensuring advanced AI systems remain beneficial and aligned with human values.</p>
    
    <p class="mb-6">Looking forward, Anthropic's success will likely depend on its ability to continue advancing the state of the art in both AI capabilities and safety techniques, while building a sustainable business that can fund its ambitious research agenda.</p>
  `,
  logoUrl: 'https://images.unsplash.com/photo-1677442135132-141996581d28?q=80&w=2070&auto=format&fit=crop',
  headerImageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2964&auto=format&fit=crop',
  website: 'https://www.anthropic.com',
  founded: '2021',
  location: 'San Francisco, CA',
  founders: [
    { name: 'Dario Amodei', title: 'CEO', imageUrl: '' },
    { name: 'Daniela Amodei', title: 'President', imageUrl: '' },
    { name: 'Tom Brown', title: 'Co-Founder', imageUrl: '' },
    { name: 'Sam McCandlish', title: 'Co-Founder', imageUrl: '' }
  ],
  category: 'Artificial Intelligence',
  tags: ['AI Safety', 'AI Alignment', 'Natural Language Processing', 'Machine Learning'],
  techStack: ['PyTorch', 'JAX', 'TensorFlow', 'AWS', 'GCP'],
  businessModel: 'Freemium API Access',
  fundingStage: 'Series C',
  totalFunding: '$1.5B',
  employees: '200+',
  competitors: ['OpenAI', 'Google DeepMind', 'Meta AI', 'Cohere'],
  products: [
    { name: 'Claude 2', description: 'Flagship conversational AI assistant known for helpfulness, harmlessness, and honesty' },
    { name: 'Claude API', description: 'API access to Claude for developers and enterprises' },
    { name: 'Constitutional AI', description: 'Research framework for developing safe and aligned AI systems' }
  ],
  fundingRounds: [
    { date: 'May 2021', amount: '$124M', stage: 'Series A', investors: ['Dustin Moskovitz', 'Eric Schmidt', 'Jaan Tallinn', 'James McClave'] },
    { date: 'April 2022', amount: '$580M', stage: 'Series B', investors: ['Sam Bankman-Fried', 'Caroline Ellison', 'Nishad Singh', 'Jaan Tallinn', 'James McClave'] },
    { date: 'May 2023', amount: '$450M', stage: 'Series C', investors: ['Google', 'Spark Capital', 'Salesforce Ventures', 'Sound Ventures', 'Zoom Ventures'] },
    { date: 'December 2023', amount: '$300M', stage: 'Extended C', investors: ['Amazon'] }
  ],
  keyMilestones: [
    { date: 'January 2021', title: 'Company founded by former OpenAI researchers' },
    { date: 'December 2022', title: 'Released Claude 1.0, first public AI assistant' },
    { date: 'July 2023', title: 'Launched Claude 2 with improved capabilities' },
    { date: 'February 2024', title: 'Released Claude 3 family of models' },
    { date: 'March 2024', title: 'Announced partnership with Amazon for Claude integration in AWS' }
  ],
  challenges: [
    'Balancing safety with keeping pace in the competitive AI landscape',
    'Managing rapid growth while maintaining research focus',
    'Developing sustainable business model that aligns with safety mission',
    'Navigating complex and evolving regulatory environment'
  ],
  lessonsLearned: [
    'Safety-first AI development can be compatible with commercial viability',
    'Building transparent, aligned systems requires intentional design from the start',
    'Strategic partnerships are crucial for scaling research-driven AI companies',
    'Interdisciplinary expertise is essential for addressing complex AI alignment problems'
  ],
  relatedArticles: [
    {
      title: "Anthropic's Claude 3 Family Sets New Benchmarks in AI Safety and Performance",
      excerpt: "The latest models from Anthropic demonstrate significant improvements in reasoning, safety, and specialized knowledge domains.",
      imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2964&auto=format&fit=crop",
      date: "March 15, 2024",
      category: "AI",
      slug: "anthropic-claude3-benchmarks"
    },
    {
      title: "Anthropic Secures $450M Series C to Advance AI Safety Research",
      excerpt: "The AI safety company raises substantial funding to continue development of constitutional AI approaches.",
      imageUrl: "https://images.unsplash.com/photo-1677442135132-141996581d28?q=80&w=2070&auto=format&fit=crop",
      date: "May 23, 2023",
      category: "Funding",
      slug: "anthropic-series-c-funding"
    },
    {
      title: "The Rise of AI Safety: How Anthropic is Reshaping the Industry",
      excerpt: "An in-depth look at how Anthropic's focus on safety-first AI development is influencing the broader AI ecosystem.",
      imageUrl: "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?q=80&w=2201&auto=format&fit=crop",
      date: "February 10, 2024",
      category: "Analysis",
      slug: "anthropic-ai-safety-impact"
    }
  ]
};

const StartupProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // In a real app, you would fetch the startup data using the slug
  const startup = startupData;
  
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-parrot-green">Home</Link>
            <ChevronRight size={14} className="mx-1" />
            <Link to="/startups" className="hover:text-parrot-green">Startups</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="truncate max-w-xs">{startup.name}</span>
          </div>
        </div>
        
        {/* Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Logo and Name */}
            <div className="flex items-center">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden mr-4 bg-gray-100 flex items-center justify-center">
                {startup.logoUrl ? (
                  <img src={startup.logoUrl} alt={startup.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-gray-400">{startup.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{startup.name}</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">{startup.tagline}</p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              <a href={startup.website} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="flex items-center gap-2">
                  <Globe size={16} />
                  <span>Website</span>
                </Button>
              </a>
              <Button 
                variant="ghost" 
                onClick={handleBookmark}
                className={isBookmarked ? 'text-parrot-blue' : ''}
              >
                <Bookmark size={20} />
              </Button>
              <Button variant="ghost">
                <Share2 size={20} />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Media & Overview */}
        <div className="container mx-auto px-4 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Image */}
            <div className="lg:col-span-2">
              <div className="rounded-xl overflow-hidden mb-6 h-80 md:h-96">
                <img 
                  src={startup.headerImageUrl} 
                  alt={`${startup.name} featured image`} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Quick Facts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={16} className="text-gray-500" />
                    <p className="text-sm text-gray-500">Founded</p>
                  </div>
                  <p className="font-semibold">{startup.founded}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-gray-500" />
                    <p className="text-sm text-gray-500">Location</p>
                  </div>
                  <p className="font-semibold">{startup.location}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={16} className="text-gray-500" />
                    <p className="text-sm text-gray-500">Total Funding</p>
                  </div>
                  <p className="font-semibold">{startup.totalFunding}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={16} className="text-gray-500" />
                    <p className="text-sm text-gray-500">Employees</p>
                  </div>
                  <p className="font-semibold">{startup.employees}</p>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 text-lg">{startup.description}</p>
              </div>
              
              {/* Tags */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {startup.tags.map(tag => (
                    <Link key={tag} to={`/startups?tag=${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Badge variant="secondary" className="px-3 py-1">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar: Key Data */}
            <div className="lg:col-span-1 space-y-6">
              {/* Funding Rounds */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Funding History</h3>
                <div className="space-y-4">
                  {startup.fundingRounds.map((round, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{round.stage}</span>
                        <span className="text-parrot-green font-medium">{round.amount}</span>
                      </div>
                      <p className="text-sm text-gray-500">{round.date}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {round.investors.slice(0, 2).join(', ')}
                        {round.investors.length > 2 && ` +${round.investors.length - 2} more`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Founding Team */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Founding Team</h3>
                <div className="space-y-4">
                  {startup.founders.map((founder, index) => (
                    <div key={index} className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center">
                        {founder.imageUrl ? (
                          <img src={founder.imageUrl} alt={founder.name} className="h-full w-full object-cover rounded-full" />
                        ) : (
                          <span className="text-lg font-bold text-gray-400">{founder.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{founder.name}</p>
                        <p className="text-sm text-gray-500">{founder.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Technical Details */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {startup.techStack.map((tech, index) => (
                    <Badge key={index} variant="outline" className="bg-white dark:bg-gray-800">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed Content */}
        <div className="container mx-auto px-4 py-8 border-t border-gray-100 dark:border-gray-900">
          <Tabs defaultValue="story" className="w-full">
            <TabsList className="mb-8 w-full max-w-2xl justify-start">
              <TabsTrigger value="story">Company Story</TabsTrigger>
              <TabsTrigger value="products">Products & Solutions</TabsTrigger>
              <TabsTrigger value="milestones">Key Milestones</TabsTrigger>
              <TabsTrigger value="lessons">Lessons Learned</TabsTrigger>
            </TabsList>
            
            <TabsContent value="story" className="p-0">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold mb-6">The {startup.name} Story</h2>
                <div className="prose dark:prose-invert prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: startup.longDescription }} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="p-0">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold mb-6">Products & Solutions</h2>
                <div className="space-y-8">
                  {startup.products.map((product, index) => (
                    <div key={index} className="border-b border-gray-100 dark:border-gray-800 pb-8 last:border-0">
                      <h3 className="text-xl font-bold mb-3">{product.name}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-xl font-bold mt-12 mb-4">Competitors</h3>
                <div className="flex flex-wrap gap-2">
                  {startup.competitors.map((competitor, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1.5">
                      {competitor}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="milestones" className="p-0">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold mb-6">Journey & Key Milestones</h2>
                
                <div className="relative border-l border-gray-200 dark:border-gray-800 ml-3 pl-8 py-4">
                  {startup.keyMilestones.map((milestone, index) => (
                    <div key={index} className="mb-10 last:mb-0">
                      <div className="absolute -left-3">
                        <div className="h-6 w-6 rounded-full bg-parrot-green flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{milestone.date}</p>
                      <h3 className="text-lg font-bold">{milestone.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="lessons" className="p-0">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold mb-6">Key Challenges & Insights</h2>
                
                <h3 className="text-xl font-bold mb-4">Challenges</h3>
                <div className="space-y-4 mb-10">
                  {startup.challenges.map((challenge, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="h-6 w-6 rounded-full bg-parrot-soft-orange text-parrot-orange flex items-center justify-center shrink-0 mt-0.5">
                        <GitBranch size={14} />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{challenge}</p>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-xl font-bold mb-4">Lessons & Insights</h3>
                <div className="space-y-4">
                  {startup.lessonsLearned.map((lesson, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="h-6 w-6 rounded-full bg-parrot-soft-green text-parrot-green flex items-center justify-center shrink-0 mt-0.5">
                        <ThumbsUp size={14} />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{lesson}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Articles */}
        <section className="container mx-auto px-4 py-12 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {startup.relatedArticles.map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
          </div>
        </section>
        
        {/* More Startups */}
        <section className="container mx-auto px-4 py-12 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">More {startup.category} Companies</h2>
            <Link to={`/startups?category=${startup.category}`} className="flex items-center gap-1 text-parrot-green hover:underline">
              <span>View all</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/startup/openai" className="block p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-parrot-green hover:shadow-md transition-all">
              <div className="text-xl font-bold mb-1">OpenAI</div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Pioneering general AI systems with extensive capabilities.</p>
            </Link>
            <Link to="/startup/deepmind" className="block p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-parrot-green hover:shadow-md transition-all">
              <div className="text-xl font-bold mb-1">DeepMind</div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Building advanced AI for scientific discovery and beneficial applications.</p>
            </Link>
            <Link to="/startup/cohere" className="block p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-parrot-green hover:shadow-md transition-all">
              <div className="text-xl font-bold mb-1">Cohere</div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Providing developers access to enterprise-grade language models.</p>
            </Link>
            <Link to="/startup/stability" className="block p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-parrot-green hover:shadow-md transition-all">
              <div className="text-xl font-bold mb-1">Stability AI</div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Developing open foundation models for generative AI applications.</p>
            </Link>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="bg-brand-dark text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Get Regular Startup Updates</h2>
              <p className="text-gray-300 mb-8">
                Join our newsletter for weekly profiles of innovative startups and market trends.
              </p>
              <div className="max-w-md mx-auto">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default StartupProfile;
