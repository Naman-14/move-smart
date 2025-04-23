
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ActiveFilterProps {
  label: string;
  onRemove: () => void;
}

const ActiveFilter = ({ label, onRemove }: ActiveFilterProps) => {
  return (
    <Badge variant="outline" className="bg-white">
      {label}
      <button 
        onClick={onRemove} 
        className="ml-2 text-gray-500 hover:text-gray-700"
      >
        <X size={12} />
      </button>
    </Badge>
  );
};

export default ActiveFilter;
