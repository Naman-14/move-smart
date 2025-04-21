
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, Bookmark } from 'lucide-react';
import { useState } from 'react';

interface FeaturedArticleProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  slug: string;
  category: string;
  readTime?: string;
}

const FeaturedArticle = ({
  title,
  excerpt,
  imageUrl,
  date,
  slug,
  category,
  readTime = "5 min read"
}: FeaturedArticleProps) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md card-hover">
      <div className="relative h-80">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-4 left-4 bg-parrot-blue hover:bg-parrot-blue/90">
          {category}
        </Badge>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-500 text-sm">{date}</p>
          <p className="text-gray-500 text-sm">{readTime}</p>
        </div>
        <h2 className="text-2xl font-bold mb-2 line-clamp-2">{title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        
        <div className="flex justify-between items-center">
          <Link to={`/article/${slug}`}>
            <Button variant="outline" className="btn-outline">Read More</Button>
          </Link>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setLiked(!liked)} 
              className={`p-2 rounded-full ${liked ? 'bg-parrot-soft-green text-parrot-green' : 'hover:bg-gray-100 text-gray-500'}`}
              aria-label="Like"
            >
              <ThumbsUp size={18} />
            </button>
            <button 
              onClick={() => setBookmarked(!bookmarked)} 
              className={`p-2 rounded-full ${bookmarked ? 'bg-parrot-soft-blue text-parrot-blue' : 'hover:bg-gray-100 text-gray-500'}`}
              aria-label="Bookmark"
            >
              <Bookmark size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;
