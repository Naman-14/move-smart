
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Add missing import
import FilterDropdown from './filters/FilterDropdown';
import SearchInput from './filters/SearchInput';
import ActiveFilters from './filters/ActiveFilters';
import { FilterOption, ContentFilters } from './filters/types';

interface ContentFilterProps {
  categories: FilterOption[];
  regions: FilterOption[];
  fundingStages: FilterOption[];
  tags: FilterOption[];
  onFilterChange: (filters: ContentFilters) => void;
}

// Export the ContentFilters type here to fix import errors in other files
export type { ContentFilters } from './filters/types';

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
          <SearchInput value={filters.search} onChange={handleSearchChange} />
          
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
      
      <ActiveFilters 
        filters={filters}
        categories={categories}
        regions={regions}
        fundingStages={fundingStages}
        tags={tags}
        onFilterChange={setFilters}
        onClearSearch={() => {
          const newFilters = { ...filters, search: '' };
          setFilters(newFilters);
          onFilterChange(newFilters);
        }}
      />
    </div>
  );
};

export default ContentFilter;
