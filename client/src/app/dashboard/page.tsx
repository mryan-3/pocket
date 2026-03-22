'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner, Calendar, Star, Gear } from '@phosphor-icons/react';
import VisitList from '@/components/dashboard/visit-list';
import ProfileSummary from '@/components/dashboard/profile-summary';

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => { if (!isAuthLoading && !isAuthenticated) router.push('/login'); }, [isAuthLoading, isAuthenticated, router]);

  const { data: profile, isLoading: isP } = useQuery({ queryKey: ['profile'], queryFn: async () => (await apiClient.get('/users/profile')).data.data, enabled: isAuthenticated });
  const { data: visits, isLoading: isV } = useQuery({ queryKey: ['visits'], queryFn: async () => (await apiClient.get('/users/visits')).data.data, enabled: isAuthenticated });

  if (isAuthLoading || isP || isV) return <div className="flex items-center justify-center min-h-screen"><Spinner size={48} className="animate-spin text-primary" weight="bold" /></div>;
  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
        <div><h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Hello, <span className="text-primary italic">{user?.name?.split(' ')[0]}!</span></h1><p className="text-muted-foreground text-lg">Manage your foodie adventures in one place.</p></div>
        <button className="flex items-center gap-2 bg-accent hover:bg-border px-6 py-3 rounded-2xl font-bold transition-all border border-border/40"><Gear size={20} weight="bold" /><span>Edit Profile</span></button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <ProfileSummary profileData={profile} />
        <div className="lg:col-span-3 space-y-12">
          <section>
             <div className="flex items-center justify-between mb-8"><h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter"><div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center"><Calendar size={20} weight="bold" className="text-primary" /></div>Upcoming Visits</h2></div>
             <VisitList visits={visits?.filter((v: any) => v.status === 'upcoming') || []} emptyMessage="No upcoming visits. Time to discover something new!" />
          </section>
          <section>
             <div className="flex items-center justify-between mb-8"><h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter text-amber-600"><div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center"><Star size={20} weight="bold" className="text-amber-600" /></div>Pending Feedback</h2></div>
             <VisitList visits={visits?.filter((v: any) => v.status === 'pending_feedback') || []} type="feedback" emptyMessage="All caught up! No pending feedback." />
          </section>
        </div>
      </div>
    </div>
  );
}
