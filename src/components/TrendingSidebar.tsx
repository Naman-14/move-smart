
import { Link } from 'react-router-dom';
import ArticleCard from './ArticleCard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import NewsletterForm from './NewsletterForm';

interface TrendingArticle {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  category: string;
  slug: string;
}

interface TrendingSidebarProps {
  trendingArticles: TrendingArticle[];
}

const TrendingSidebar = ({ trendingArticles }: TrendingSidebarProps) => {
  return (
    <div className="space-y-8">
      {/* Newsletter Subscription */}
      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
        <h3 className="font-bold text-lg mb-4">Stay ahead of the curve</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          Get the latest startup insights, funding updates, and industry trends delivered to your inbox.
        </p>
        <NewsletterForm variant="inline" />
      </div>
      
      {/* Trending Articles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Trending Now</h3>
          <Link to="/trending" className="text-parrot-green text-sm hover:underline">
            See all
          </Link>
        </div>
        
        <div className="space-y-4">
          {trendingArticles.map(article => (
            <ArticleCard 
              key={article.id} 
              {...article} 
              compact={true} 
            />
          ))}
        </div>
      </div>
      
      {/* Latest Funding */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Latest Funding</h3>
          <Link to="/funding" className="text-parrot-green text-sm hover:underline">
            See all
          </Link>
        </div>
        
        <div className="space-y-4">
          {/* Sample funding items */}
          <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Anthropic</span>
              <span className="text-parrot-green font-medium">$2.5B</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Series D • AI Safety Research</p>
          </div>
          <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Notion AI</span>
              <span className="text-parrot-green font-medium">$1.2B</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Series C • Productivity</p>
          </div>
          <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Figma</span>
              <span className="text-parrot-green font-medium">$800M</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Series E • Design Tools</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingSidebar;
