'use client';

import { cn } from '@/lib/utils';

export type LevelFilter = '全部' | '初級' | '中級' | '進階';

const FILTERS: LevelFilter[] = ['全部', '初級', '中級', '進階'];

interface FilterBarProps {
  value: LevelFilter;
  onChange: (filter: LevelFilter) => void;
}

export default function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={cn(
            'shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all',
            value === f
              ? 'border-lime-300 bg-lime-300 text-gray-900'
              : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-gray-200'
          )}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
