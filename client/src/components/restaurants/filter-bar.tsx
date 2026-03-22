'use client';

import { Funnel, MagnifyingGlass, CaretDown, SortAscending } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  filters: {
    category: string;
    budgetMax: string;
    sortBy: string;
    search: string;
  };
  setFilters: (filters: any) => void;
}

const CATEGORIES = ['all', 'local', 'formal', 'high-end', 'cafe', 'fast-food', 'other'];
const SORT_OPTIONS = [
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Price: Low to High', value: 'priceAsc' },
  { label: 'Price: High to Low', value: 'priceDesc' },
  { label: 'Most Popular', value: 'popularity' },
];

export default function FilterBar({ filters, setFilters }: FilterBarProps) {
  return (
    <div className="space-y-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative group">
          <MagnifyingGlass 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" 
            size={22} 
          />
          <input 
            type="text"
            placeholder="Search by name or cuisine..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full bg-card border border-border/60 rounded-[1.5rem] py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-sm font-medium"
          />
        </div>

        {/* Budget Filter */}
        <div className="relative md:w-48 group">
          <input 
            type="number"
            placeholder="Max Budget"
            value={filters.budgetMax}
            onChange={(e) => setFilters({ ...filters, budgetMax: e.target.value })}
            className="w-full bg-card border border-border/60 rounded-[1.5rem] py-4 pl-6 pr-6 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-sm font-medium"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-muted-foreground">KSH</span>
        </div>

        {/* Sort Select */}
        <div className="relative md:w-64 group">
          <SortAscending className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <select 
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="w-full bg-card border border-border/60 rounded-[1.5rem] py-4 pl-12 pr-6 outline-none appearance-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-sm font-medium cursor-pointer"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <CaretDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pt-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilters({ ...filters, category: cat === 'all' ? '' : cat })}
            className={cn(
              "px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 border",
              (filters.category === cat || (cat === 'all' && !filters.category))
                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
