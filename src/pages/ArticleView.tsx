
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, Facebook, Twitter, Linkedin, Link2, Bookmark, Share2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterForm from '@/components/NewsletterForm';
import ArticleCard from '@/components/ArticleCard';

// Mock article data - in a real app, this would come from an API
const articleData = {
  id: '1',
  title: 'How Notion Disrupted the Productivity Software Market',
  subtitle: 'A deep dive into Notion\'s meteoric rise, innovative product strategy, and how it captured a devoted user base in a crowded market.',
  content: `
    <p class="text-xl leading-relaxed mb-6">In less than a decade, Notion has transformed from a struggling startup to a productivity powerhouse valued at over $10 billion. How did they manage to disrupt a market dominated by tech giants?</p>
    
    <p class="mb-4">Founded in 2013, Notion spent its early years in relative obscurity. The founding team, led by Ivan Zhao, had a vision for a revolutionary all-in-one workspace tool but faced significant technical challenges. After nearly running out of money in 2015, the team rebuilt the product from scratch with a focus on performance and flexibility.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">Product-Market Fit: The "All-in-One" Breakthrough</h2>
    
    <p class="mb-4">Notion's key insight was that users were suffering from "tool fatigue" - using too many specialized apps that didn't communicate well with each other. By creating a single platform that could replace documents, wikis, task managers, and databases, Notion offered a compelling alternative.</p>
    
    <p class="mb-4">Their "blocks" system, which allows users to mix and match different content types on the same page, was revolutionary. This flexibility meant users could build exactly what they needed rather than adapting their workflows to rigid software.</p>
    
    <blockquote class="border-l-4 border-parrot-green pl-4 italic my-6">
      "We wanted to create a tool that felt like a blank canvas where people could build their own tools without knowing how to code." - Ivan Zhao, Notion CEO
    </blockquote>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">Go-to-Market Strategy: Community-Driven Growth</h2>
    
    <p class="mb-4">Notion's growth was primarily organic, driven by passionate users who became evangelists. The company invested heavily in templates and educational content rather than traditional marketing.</p>
    
    <p class="mb-4">This approach created a virtuous cycle: users would create innovative templates and workflows, share them publicly, and attract new users who would discover new use cases for the product.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">Pricing Innovation: The Prosumer Strategy</h2>
    
    <p class="mb-4">Notion adopted a "prosumer" approach to pricing - offering a generous free tier for individuals while charging for team features and advanced functionality. This allowed them to gain widespread adoption among individuals who would then bring Notion into their workplaces.</p>
    
    <p class="mb-4">The company also targeted startups and smaller teams first, only gradually moving upmarket to enterprise customers as the product matured - a classic disruption strategy.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">Key Lessons for Founders</h2>
    
    <ul class="list-disc pl-5 mb-6 space-y-2">
      <li>Focus on solving genuine pain points rather than incremental improvements</li>
      <li>Invest in flexibility and customization to serve diverse use cases</li>
      <li>Build community and education alongside your product</li>
      <li>Use pricing strategically to drive adoption and growth</li>
      <li>Don't be afraid to start over if your technical foundation isn't scalable</li>
    </ul>
    
    <p class="mb-4">As Notion continues to evolve with AI features and enterprise capabilities, they face new challenges from established players and emerging startups. Whether they can maintain their innovative edge while scaling remains to be seen, but their journey offers valuable insights for anyone looking to disrupt an established market.</p>
  `,
  imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&fit=crop&auto=format',
  publishedAt: 'April 15, 2023',
  updatedAt: 'April 17, 2023',
  author: {
    name: 'Emma Richards',
    title: 'Senior Tech Analyst',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop',
    twitter: '@emmarichtech'
  },
  category: 'Case Study',
  tags: ['Productivity', 'SaaS', 'Growth Strategy', 'Product-Led Growth'],
  relatedArticles: [
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
      title: 'Figma's Path to a $20B Acquisition: Lessons from the Design Leader',
      excerpt: 'How Figma revolutionized collaborative design and became Adobe\'s largest acquisition target in history.',
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2964&auto=format&fit=crop',
      date: 'April 16, 2025',
      category: 'Case Study',
      slug: 'figma-acquisition-path'
    },
    {
      id: '4',
      title: 'How Slack Built a $27B Business Through Product-Led Growth',
      excerpt: 'Examining how Slack's focus on product experience and viral adoption changed B2B software marketing.',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2940&auto=format&fit=crop',
      date: 'April 12, 2025',
      category: 'Case Study',
      slug: 'slack-product-led-growth'
    }
  ]
};

const ArticleView = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(127);
  const [hasLiked, setHasLiked] = useState(false);
  
  // In a real app, you would fetch the article using the slug
  const article = articleData; // This would normally be fetched based on slug
  
  const handleLike = () => {
    if (hasLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setHasLiked(!hasLiked);
  };
  
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
            <Link to="/case-studies" className="hover:text-parrot-green">{article.category}</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="truncate max-w-xs">{article.title}</span>
          </div>
        </div>
        
        {/* Article Header */}
        <header className="container mx-auto px-4 pt-6 pb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {article.subtitle}
          </p>
          
          <div className="flex flex-wrap items-center justify-between gap-y-4">
            {/* Author info */}
            <div className="flex items-center">
              <img 
                src={article.author.imageUrl} 
                alt={article.author.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium">{article.author.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{article.author.title}</p>
              </div>
            </div>
            
            {/* Date and read time */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <time dateTime={article.publishedAt}>Published: {article.publishedAt}</time>
              {article.updatedAt !== article.publishedAt && (
                <span> (Updated: {article.updatedAt})</span>
              )}
              <span className="mx-2">•</span>
              <span>7 min read</span>
            </div>
          </div>
        </header>
        
        {/* Article Content */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-8">
            {/* Social Share Sidebar - Desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 flex flex-col items-center space-y-4">
                <button 
                  onClick={handleLike}
                  className={`p-2 rounded-full flex flex-col items-center ${
                    hasLiked 
                      ? 'text-parrot-green bg-parrot-green/10' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <ThumbsUp size={20} />
                  <span className="text-xs mt-1">{likeCount}</span>
                </button>
                
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Facebook size={20} />
                </button>
                
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Twitter size={20} />
                </button>
                
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Linkedin size={20} />
                </button>
                
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Link2 size={20} />
                </button>
                
                <button 
                  onClick={handleBookmark}
                  className={`p-2 rounded-full ${
                    isBookmarked 
                      ? 'text-parrot-blue bg-parrot-blue/10' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Bookmark size={20} />
                </button>
              </div>
            </div>
            
            {/* Main Content */}
            <article className="col-span-12 lg:col-span-8">
              {/* Featured Image */}
              <figure className="mb-8">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-auto rounded-lg object-cover"
                />
                <figcaption className="text-sm text-gray-500 mt-2 text-center">
                  Notion's block-based interface revolutionized productivity tools. Credit: Notion
                </figcaption>
              </figure>
              
              {/* Mobile Social Share */}
              <div className="flex justify-between lg:hidden mb-6 border-y border-gray-200 dark:border-gray-800 py-3">
                <div className="flex space-x-2">
                  <button 
                    onClick={handleLike}
                    className={`p-2 rounded-full ${hasLiked ? 'text-parrot-green' : 'text-gray-500'}`}
                  >
                    <ThumbsUp size={18} />
                  </button>
                  <button className="p-2 rounded-full text-gray-500">
                    <Facebook size={18} />
                  </button>
                  <button className="p-2 rounded-full text-gray-500">
                    <Twitter size={18} />
                  </button>
                  <button className="p-2 rounded-full text-gray-500">
                    <Linkedin size={18} />
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full text-gray-500">
                    <Link2 size={18} />
                  </button>
                  <button 
                    onClick={handleBookmark} 
                    className={`p-2 rounded-full ${isBookmarked ? 'text-parrot-blue' : 'text-gray-500'}`}
                  >
                    <Bookmark size={18} />
                  </button>
                  <button className="p-2 rounded-full text-gray-500">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
              
              {/* Article Content */}
              <div className="prose dark:prose-invert prose-lg max-w-none mb-10">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
              
              {/* Tags */}
              <div className="mb-8">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tagged</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Link 
                      key={index} 
                      to={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Author Bio - Optional */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-6 pb-10">
                <div className="flex items-start">
                  <img 
                    src={article.author.imageUrl} 
                    alt={article.author.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{article.author.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">{article.author.title}</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Emma covers productivity tools, SaaS companies, and startup growth strategies. 
                      She previously worked as a product manager at several tech startups.
                      Follow her on Twitter: {article.author.twitter}
                    </p>
                  </div>
                </div>
              </div>
            </article>
            
            {/* Sidebar */}
            <aside className="col-span-12 lg:col-span-3">
              {/* Newsletter CTA */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl mb-8">
                <h3 className="font-bold text-lg mb-2">Get startup insights in your inbox</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  Join our newsletter for weekly updates on the latest tech startups, funding rounds, and industry trends.
                </p>
                <NewsletterForm variant="modal" />
              </div>
              
              {/* Related Articles */}
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-4">Related Articles</h3>
                <div className="space-y-6">
                  {article.relatedArticles.map((related) => (
                    <ArticleCard
                      key={related.id}
                      {...related}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
              
              {/* Trending Tags */}
              <div>
                <h3 className="font-bold text-lg mb-4">Trending Topics</h3>
                <div className="flex flex-wrap gap-2">
                  <Link to="/tag/ai" className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    AI
                  </Link>
                  <Link to="/tag/saas" className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    SaaS
                  </Link>
                  <Link to="/tag/fintech" className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    Fintech
                  </Link>
                  <Link to="/tag/funding" className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    Funding
                  </Link>
                  <Link to="/tag/product-led-growth" className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    Product-Led Growth
                  </Link>
                  <Link to="/tag/startup-strategy" className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    Startup Strategy
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
        
        {/* More From MoveSmart */}
        <section className="container mx-auto px-4 py-12 mt-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-6">More From MoveSmart</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {article.relatedArticles.map(related => (
              <ArticleCard key={related.id} {...related} />
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleView;
