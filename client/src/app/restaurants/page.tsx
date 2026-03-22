'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import FilterBar from '@/components/restaurants/filter-bar';
import DiscoveryHeader from '@/components/restaurants/discovery-header';
import RestaurantList from '@/components/restaurants/restaurant-list';

export default function RestaurantsPage() {
  const [filters, setFilters] = useState({ category: '', budgetMax: '', sortBy: 'rating', search: '' });
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  useEffect(() => { const t = setTimeout(() => setDebouncedSearch(filters.search), 500); return () => clearTimeout(t); }, [filters.search]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurants', { ...filters, search: debouncedSearch }],
    queryFn: async () => {
      const p = new URLSearchParams();
      Object.entries({ ...filters, search: debouncedSearch }).forEach(([k, v]) => v && p.append(k, v));
      return (await apiClient.get(`/restaurants?${p.toString()}`)).data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <DiscoveryHeader />
      <FilterBar filters={filters} setFilters={setFilters} />
      <RestaurantList restaurants={data?.data || []} isLoading={isLoading} error={error} onClear={() => setFilters({ category: '', budgetMax: '', sortBy: 'rating', search: '' })} />
      {!isLoading && (data?.data?.length || 0) > 0 && <div className="mt-20 flex justify-center"><div className="flex items-center gap-2 p-2 glass-card rounded-2xl"><button className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent">Next</button></div></div>}
    </div>
  );
}
