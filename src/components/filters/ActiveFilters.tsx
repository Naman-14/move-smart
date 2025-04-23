
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ActiveFilter from './ActiveFilter';
import { FilterOption } from './types';
import { ContentFilters } from './types';

interface ActiveFiltersProps {
  filters: ContentFilters;
  categories: FilterOption[];
  regions: FilterOption[];
  fundingStages: FilterOption[];
  tags: FilterOption[];
  onFilterChange: (filters: ContentFilters) => void;
  onClearSearch: () => void;
}

const ActiveFilters = ({
  filters,
  categories,
  regions,
  fundingStages,
  tags,
  onFilterChange,
  onClearSearch
}: ActiveFiltersProps) => {
  const toggleFilter = (type: keyof Omit<ContentFilters, 'search'>, id: string) => {
    const newFilters = { ...filters };
    newFilters[type] = newFilters[type].filter(item => item !== id);
    onFilterChange(newFilters);
  };

  if (!filters.search && !filters.categories.length && !filters.regions.length && 
      !filters.fundingStages.length && !filters.tags.length) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {filters.search && (
        <Badge variant="outline" className="bg-white">
          Search: {filters.search}
          <button onClick={onClearSearch} className="ml-2 text-gray-500 hover:text-gray-700">
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
  );
};

export default ActiveFilters;
