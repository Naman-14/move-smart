
import { ContentFilters } from '@/components/filters/types';

export const useFilterToggle = (
  filters: ContentFilters,
  onFilterChange: (filters: ContentFilters) => void
) => {
  const toggleFilter = (type: keyof Omit<ContentFilters, 'search'>, id: string) => {
    const newFilters = { ...filters };
    newFilters[type] = newFilters[type].filter(item => item !== id);
    onFilterChange(newFilters);
  };

  return { toggleFilter };
};
