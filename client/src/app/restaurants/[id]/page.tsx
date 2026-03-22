'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Spinner } from '@phosphor-icons/react';
import { useState } from 'react';
import ScheduleDialog from '@/components/visits/schedule-dialog';
import { useAuth } from '@/hooks/use-auth';
import RestaurantHeader from '@/components/restaurants/detail/restaurant-header';
import RestaurantTabs from '@/components/restaurants/detail/restaurant-tabs';
import RestaurantSidebar from '@/components/restaurants/detail/restaurant-sidebar';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const { data: restaurant, isLoading, error } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => (await apiClient.get(`/restaurants/${id}`)).data.data,
  });

  if (isLoading) return <div className="flex items-center justify-center min-h-[calc(100vh-64px)]"><Spinner size={48} className="animate-spin text-primary" weight="bold" /></div>;
  if (error || !restaurant) return <div className="container mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold mb-4">Restaurant not found</h1><button onClick={() => router.back()} className="text-primary font-bold">Go Back</button></div>;

  return (
    <div className="min-h-screen pb-20">
      <RestaurantHeader restaurant={restaurant} isAuthenticated={isAuthenticated} onSchedule={() => isAuthenticated ? setIsScheduleOpen(true) : router.push('/login')} />
      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <RestaurantTabs menu={restaurant.menu} />
          <RestaurantSidebar restaurant={restaurant} />
        </div>
      </div>
      <ScheduleDialog isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} restaurantId={id as string} restaurantName={restaurant.name} />
    </div>
  );
}
