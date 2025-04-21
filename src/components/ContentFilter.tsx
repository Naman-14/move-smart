
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface FilterOption {
  id: string;
  label: string;
}

interface ContentFilterProps {
  categories: FilterOption[];
  regions: FilterOption[];
  fundingStages: FilterOption[];
  tags: FilterOption[];
  onFilterChange: (filters: ContentFilters) => void;
}

export interface ContentFilters {
  search: string;
  categories: string[];
  regions: string[];
  fundingStages: string[];
  tags: string[];
}

const ContentFilter = ({
  categories,
  regions,
  fundingStages,
  tags,
  onFilterChange
}: ContentFilterProps) => {
  const [filters, setFilters] = useState<ContentFilters>({
    search: '',
    categories: [],
    regions: [],
    fundingStages: [],
    tags: []
  });

  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const toggleFilter = (type: keyof Omit<ContentFilters, 'search'>, id: string) => {
    const newFilters = { ...filters };
    
    if (newFilters[type].includes(id)) {
      newFilters[type] = newFilters[type].filter(item => item !== id);
    } else {
      newFilters[type] = [...newFilters[type], id];
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const clearFilters = () => {
    const newFilters = {
      search: '',
      categories: [],
      regions: [],
      fundingStages: [],
      tags: []
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const totalActiveFilters = 
    filters.categories.length + 
    filters.regions.length + 
    filters.fundingStages.length + 
    filters.tags.length;
    
  const hasActiveFilters = totalActiveFilters > 0 || filters.search.length > 0;
  
  return (
    <div className="mb-8">
      <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 w-full">
            <Input 
              type="search"
              placeholder="Search articles and startups..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-10 w-full"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Filter size={16} />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="whitespace-nowrap"
            >
              <Filter className="mr-2 h-4 w-4" /> 
              Filters 
              {totalActiveFilters > 0 && (
                <Badge className="ml-2 bg-parrot-green hover:bg-parrot-green">
                  {totalActiveFilters}
                </Badge>
              )}
            </Button>
            
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearFilters} 
                className="text-gray-500"
              >
                <X className="mr-1 h-3 w-3" /> Clear
              </Button>
            )}
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <FilterDropdown 
              title="Categories" 
              options={categories}
              selected={filters.categories}
              onToggle={(id) => toggleFilter('categories', id)}
            />
            
            <FilterDropdown 
              title="Regions" 
              options={regions}
              selected={filters.regions}
              onToggle={(id) => toggleFilter('regions', id)}
            />
            
            <FilterDropdown 
              title="Funding Stages" 
              options={fundingStages}
              selected={filters.fundingStages}
              onToggle={(id) => toggleFilter('fundingStages', id)}
            />
            
            <FilterDropdown 
              title="Tags" 
              options={tags}
              selected={filters.tags}
              onToggle={(id) => toggleFilter('tags', id)}
            />
          </div>
        )}
      </div>
      
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="outline" className="bg-white">
              Search: {filters.search}
              <button 
                onClick={() => {
                  const newFilters = { ...filters, search: '' };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }} 
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <X size={12} />
              </button>
            </Badge>
          )}
          
          {filters.categories.map(id => {
            const category = categories.find(c => c.id === id);
            return (
              <ActiveFilter
                key={`category-${id}`}
                label={category?.label || id}
                onRemove={() => toggleFilter('categories', id)}
              />
            );
          })}
          
          {filters.regions.map(id => {
            const region = regions.find(r => r.id === id);
            return (
              <ActiveFilter
                key={`region-${id}`}
                label={region?.label || id}
                onRemove={() => toggleFilter('regions', id)}
              />
            );
          })}
          
          {filters.fundingStages.map(id => {
            const stage = fundingStages.find(s => s.id === id);
            return (
              <ActiveFilter
                key={`stage-${id}`}
                label={stage?.label || id}
                onRemove={() => toggleFilter('fundingStages', id)}
              />
            );
          })}
          
          {filters.tags.map(id => {
            const tag = tags.find(t => t.id === id);
            return (
              <ActiveFilter
                key={`tag-${id}`}
                label={tag?.label || id}
                onRemove={() => toggleFilter('tags', id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

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

export default ContentFilter;
