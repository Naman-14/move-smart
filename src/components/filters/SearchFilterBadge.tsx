
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchFilterBadgeProps {
  search: string;
  onClear: () => void;
}

const SearchFilterBadge = ({ search, onClear }: SearchFilterBadgeProps) => {
  if (!search) return null;

  return (
    <Badge variant="outline" className="bg-white">
      Search: {search}
      <button onClick={onClear} className="ml-2 text-gray-500 hover:text-gray-700">
        <X size={12} />
      </button>
    </Badge>
  );
};

export default SearchFilterBadge;
