
import { FilterOption } from './types';
import ActiveFilter from './ActiveFilter';

interface FilterGroupProps {
  type: string;
  items: string[];
  options: FilterOption[];
  onToggle: (id: string) => void;
}

const FilterGroup = ({ type, items, options, onToggle }: FilterGroupProps) => {
  if (items.length === 0) return null;
  
  return (
    <>
      {items.map(id => {
        const option = options.find(o => o.id === id);
        return (
          <ActiveFilter
            key={`${type}-${id}`}
            label={option?.label || id}
            onRemove={() => onToggle(id)}
          />
        );
      })}
    </>
  );
};

export default FilterGroup;
