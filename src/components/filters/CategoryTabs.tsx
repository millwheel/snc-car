'use client';

import type { CategoryFilter } from '@/hooks/useCarFilter';

interface CategoryTabsProps {
  currentCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
}

const categories: { value: CategoryFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'DOMESTIC', label: '국산차' },
  { value: 'IMPORT', label: '수입차' },
];

export default function CategoryTabs({
  currentCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            currentCategory === category.value
              ? 'bg-primary text-white'
              : 'bg-bg-secondary text-text-secondary hover:bg-border'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
