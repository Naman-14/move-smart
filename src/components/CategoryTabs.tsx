
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryTabsProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
}

const CategoryTabs = ({ categories, onSelectCategory }: CategoryTabsProps) => {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || '');

  const handleSelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    onSelectCategory(categoryId);
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 overflow-x-auto scrollbar-none">
      <div className="flex space-x-1 py-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleSelect(category.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md transition-colors",
              activeCategory === category.id
                ? "bg-parrot-green/10 text-parrot-green dark:bg-parrot-green/20"
                : "text-gray-600 hover:text-parrot-green hover:bg-gray-100/50 dark:text-gray-300 dark:hover:bg-gray-800/50"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
