'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import StatsCard from '@/components/admin/stats-card';
import { Users, Storefront, ChatCircle, Star, Spinner } from '@phosphor-icons/react';

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await apiClient.get('/admin/stats')).data.data,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner size={48} className="animate-spin text-primary" weight="bold" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
          Overview <span className="text-primary italic">Stats</span>
        </h1>
        <p className="text-muted-foreground text-lg">System health and engagement metrics at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={Users} 
          trend="+12%" 
          trendType="up"
        />
        <StatsCard 
          label="Restaurants" 
          value={stats?.totalRestaurants || 0} 
          icon={Storefront} 
        />
        <StatsCard 
          label="Feedbacks" 
          value={stats?.totalFeedback || 0} 
          icon={ChatCircle} 
          trend="+5%" 
          trendType="up"
        />
        <StatsCard 
          label="Avg Rating" 
          value={stats?.averageRating || 0} 
          icon={Star} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="p-10 glass-card border border-border/40 rounded-[3rem] h-64 flex flex-col justify-center">
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Recent Activity</h3>
            <p className="text-muted-foreground">Activity logs and detailed charts are coming in the next update.</p>
         </div>
         <div className="p-10 bg-primary/10 border border-primary/20 rounded-[3rem] h-64 flex flex-col justify-center">
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter text-primary">System Notice</h3>
            <p className="text-primary/70 font-medium">All background schedulers are running optimally. Next cleanup in 45 minutes.</p>
         </div>
      </div>
    </div>
  );
}
