'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortOption } from '@/types';

interface ReviewsFilterProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function ReviewsFilter({ currentSort, onSortChange }: ReviewsFilterProps) {
  const sortOptions = [
    { value: 'recent' as SortOption, label: 'Most Recent' },
    { value: 'oldest' as SortOption, label: 'Oldest First' },
    { value: 'highest' as SortOption, label: 'Highest Rating' },
    { value: 'lowest' as SortOption, label: 'Lowest Rating' },
    { value: 'helpful' as SortOption, label: 'Most Helpful' },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium hidden sm:inline-block">Sort by:</span>
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}