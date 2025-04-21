
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface StartupCardProps {
  name: string;
  description: string;
  logoUrl?: string;
  founded: string;
  category: string;
  businessModel: string;
  fundingStage: string;
  fundingAmount?: string;
  location?: string;
  slug: string;
  compact?: boolean;
}

const StartupCard = ({
  name,
  description,
  logoUrl,
  founded,
  category,
  businessModel,
  fundingStage,
  fundingAmount,
  location,
  slug,
  compact = false
}: StartupCardProps) => {
  if (compact) {
    return (
      <Link to={`/startup/${slug}`} className="block">
        <div className="flex gap-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="h-12 w-12 rounded-md overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-gray-400">{name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-medium hover:text-parrot-green transition-colors">{name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-parrot-green">{fundingStage}</span>
              {fundingAmount && (
                <span className="text-sm text-gray-500 dark:text-gray-400">• {fundingAmount}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/startup/${slug}`} className="block group">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-all h-full border border-gray-100 dark:border-gray-800 hover:border-parrot-green dark:hover:border-parrot-green">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full overflow-hidden mr-4 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-gray-400">{name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg group-hover:text-parrot-green transition-colors">{name}</h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Founded: {founded}</span>
              {location && (
                <>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <MapPin size={12} className="mr-1" />
                    <span>{location}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="bg-parrot-soft-yellow dark:bg-yellow-900/20 border-parrot-yellow dark:border-yellow-700 text-gray-700 dark:text-yellow-500">
            {category}
          </Badge>
          <Badge variant="outline" className="bg-parrot-soft-green dark:bg-green-900/20 border-parrot-green dark:border-green-700 text-gray-700 dark:text-green-500">
            {businessModel}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <Badge variant="outline" className="bg-parrot-soft-orange dark:bg-orange-900/20 border-parrot-orange dark:border-orange-700 text-gray-700 dark:text-orange-500">
            {fundingStage}
          </Badge>
          {fundingAmount && (
            <span className="text-sm font-medium text-parrot-green">{fundingAmount}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default StartupCard;
