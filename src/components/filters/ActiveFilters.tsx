
import { FilterOption, ContentFilters } from './types';
import SearchFilterBadge from './SearchFilterBadge';
import FilterGroup from './FilterGroup';
import { useFilterToggle } from '@/hooks/useFilterToggle';

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
  const { toggleFilter } = useFilterToggle(filters, onFilterChange);

  const hasActiveFilters = !!(
    filters.search || 
    filters.categories.length || 
    filters.regions.length || 
    filters.fundingStages.length || 
    filters.tags.length
  );

  if (!hasActiveFilters) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <SearchFilterBadge 
        search={filters.search} 
        onClear={onClearSearch} 
      />
      
      <FilterGroup
        type="category"
        items={filters.categories}
        options={categories}
        onToggle={(id) => toggleFilter('categories', id)}
      />
      
      <FilterGroup
        type="region"
        items={filters.regions}
        options={regions}
        onToggle={(id) => toggleFilter('regions', id)}
      />
      
      <FilterGroup
        type="fundingStage"
        items={filters.fundingStages}
        options={fundingStages}
        onToggle={(id) => toggleFilter('fundingStages', id)}
      />
      
      <FilterGroup
        type="tag"
        items={filters.tags}
        options={tags}
        onToggle={(id) => toggleFilter('tags', id)}
      />
    </div>
  );
};

export default ActiveFilters;
