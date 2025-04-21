
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FeaturedArticleProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  slug: string;
  category: string;
}

const FeaturedArticle = ({
  title,
  excerpt,
  imageUrl,
  date,
  slug,
  category
}: FeaturedArticleProps) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md card-hover">
      <div className="relative h-64">
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
        <p className="text-gray-500 text-sm mb-2">{date}</p>
        <h2 className="text-2xl font-bold mb-2 line-clamp-2">{title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        <Link to={`/article/${slug}`}>
          <Button variant="outline" className="btn-outline">Read More</Button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedArticle;
