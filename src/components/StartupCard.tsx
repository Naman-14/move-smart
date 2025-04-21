
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface StartupCardProps {
  name: string;
  description: string;
  logoUrl: string;
  founded: string;
  category: string;
  businessModel: string;
  fundingStage: string;
  slug: string;
}

const StartupCard = ({
  name,
  description,
  logoUrl,
  founded,
  category,
  businessModel,
  fundingStage,
  slug
}: StartupCardProps) => {
  return (
    <Link to={`/startup/${slug}`} className="block">
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full overflow-hidden mr-4 bg-gray-100 flex items-center justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-gray-400">{name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-sm text-gray-500">Founded: {founded}</p>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-parrot-soft-yellow border-parrot-yellow text-gray-700">
            {category}
          </Badge>
          <Badge variant="outline" className="bg-parrot-soft-green border-parrot-green text-gray-700">
            {businessModel}
          </Badge>
          <Badge variant="outline" className="bg-parrot-soft-orange border-parrot-orange text-gray-700">
            {fundingStage}
          </Badge>
        </div>
      </div>
    </Link>
  );
};

export default StartupCard;
