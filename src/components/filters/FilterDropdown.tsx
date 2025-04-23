
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilterOption } from './types';

interface FilterDropdownProps {
  title: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (id: string) => void;
}

const FilterDropdown = ({ title, options, selected, onToggle }: FilterDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {title}
          <Badge className={`ml-2 ${selected.length ? 'bg-parrot-green hover:bg-parrot-green' : 'bg-gray-200 hover:bg-gray-200 text-gray-500'}`}>
            {selected.length || 'All'}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map(option => (
          <DropdownMenuCheckboxItem
            key={option.id}
            checked={selected.includes(option.id)}
            onCheckedChange={() => onToggle(option.id)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
