
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  imageUrl?: string;
  date: string;
  category: string;
  slug: string;
  compact?: boolean;
}

const ArticleCard = ({
  title,
  excerpt,
  imageUrl,
  date,
  category,
  slug,
  compact = false
}: ArticleCardProps) => {
  if (compact) {
    return (
      <Link to={`/article/${slug}`} className="block group">
        <div className="flex gap-4 py-4 border-b border-gray-100">
          {imageUrl && (
            <div className="h-16 w-16 rounded-md overflow-hidden shrink-0">
              <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
            </div>
          )}
          <div>
            <h3 className="font-medium group-hover:text-parrot-green transition-colors line-clamp-2">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{date}</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${slug}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full border border-gray-100">
        {imageUrl && (
          <div className="h-48 relative">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            <Badge className="absolute top-3 left-3 bg-parrot-blue hover:bg-parrot-blue/90">
              {category}
            </Badge>
          </div>
        )}
        <div className="p-5">
          <p className="text-sm text-gray-500 mb-2">{date}</p>
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{title}</h3>
          <p className="text-gray-600 line-clamp-3">{excerpt}</p>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
