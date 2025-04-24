
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  imageUrl?: string;
  date: string;
  category: string;
  slug: string;
  compact?: boolean;
  author?: string;
  readingTime?: number;
}

const ArticleCard = ({
  title,
  excerpt,
  imageUrl,
  date,
  category,
  slug,
  compact = false,
  author = "MoveSmart",
  readingTime = 3
}: ArticleCardProps) => {
  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      >
        <Link to={`/article/${slug}`} className="block group">
          <div className="flex gap-4 py-4 border-b border-gray-100">
            {imageUrl && (
              <div className="h-16 w-16 rounded-md overflow-hidden shrink-0">
                <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
              </div>
            )}
            <div>
              <h3 className="font-medium group-hover:text-parrot-green transition-colors line-clamp-2">{title}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3">
                <span>{date}</span>
                <span className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  {readingTime} min read
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Link to={`/article/${slug}`} className="block h-full">
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full border border-gray-100 dark:border-gray-700">
          {imageUrl && (
            <div className="h-48 relative">
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              <Badge className="absolute top-3 left-3 bg-parrot-blue hover:bg-parrot-blue/90">
                {category}
              </Badge>
            </div>
          )}
          <div className="p-5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-500">{date}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock size={14} className="mr-1" />
                <span>{readingTime} min read</span>
              </div>
            </div>
            
            <h3 className="font-bold text-lg mb-2 line-clamp-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">{excerpt}</p>
            
            <div className="flex items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <User size={14} className="mr-1 text-gray-500" />
              <span className="text-sm text-gray-500">{author}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ArticleCard;
