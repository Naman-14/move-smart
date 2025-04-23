
import { Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <div className="relative flex-1 w-full">
      <Input 
        type="search"
        placeholder="Search articles and startups..."
        value={value}
        onChange={onChange}
        className="pl-10 w-full"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Filter size={16} />
      </div>
    </div>
  );
};

export default SearchInput;
