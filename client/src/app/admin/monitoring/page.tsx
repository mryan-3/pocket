'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Spinner, Calendar, ChatTeardropText, ShieldCheck } from '@phosphor-icons/react';
import { format } from 'date-fns';

export default function AdminMonitoringPage() {
  const { data: visits, isLoading: isV } = useQuery({
    queryKey: ['admin-visits'],
    queryFn: async () => (await apiClient.get('/admin/visits')).data.data,
  });

  const { data: feedbacks, isLoading: isF } = useQuery({
    queryKey: ['admin-feedback'],
    queryFn: async () => (await apiClient.get('/admin/feedback')).data.data,
  });

  return (
    <div className="space-y-16">
      <div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
          System <span className="text-primary italic">Logs</span>
        </h1>
        <p className="text-muted-foreground text-lg">Real-time stream of visits and feedback activity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="space-y-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Calendar size={20} weight="bold" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Scheduled Visits</h2>
          </div>

          {isV ? <Spinner className="animate-spin text-primary" size={32} /> : (
            <div className="space-y-4">
              {visits?.map((visit: any) => (
                <div key={visit._id} className="p-6 glass-card border border-border/40 rounded-[2rem] hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-bold text-lg">{visit.restaurant?.name}</p>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                      visit.status === 'upcoming' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {visit.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium mb-4">
                     <span className="text-foreground font-bold">{visit.user?.name}</span>
                     <span>•</span>
                     <span>{format(new Date(visit.visitDate), 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                  {visit.notes && <p className="text-sm italic text-muted-foreground border-l-2 border-primary/20 pl-4">"{visit.notes}"</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <ChatTeardropText size={20} weight="bold" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Feedback Stream</h2>
          </div>

          {isF ? <Spinner className="animate-spin text-primary" size={32} /> : (
            <div className="space-y-4">
              {feedbacks?.map((fb: any) => (
                <div key={fb._id} className="p-6 glass-card border border-border/40 rounded-[2rem] hover:border-primary/30 transition-all">
                   <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                       <p className="font-bold text-lg">{fb.restaurant?.name}</p>
                       {fb.isVerifiedVisit && <ShieldCheck size={18} weight="fill" className="text-primary" />}
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < fb.rating ? "text-primary" : "text-muted-foreground opacity-20"}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm font-medium mb-4">{fb.comment}</p>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                     <span className="text-foreground">{fb.user?.name}</span>
                     <span>•</span>
                     <span>{format(new Date(fb.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
