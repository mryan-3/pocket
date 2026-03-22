'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Calendar, Note, Spinner } from '@phosphor-icons/react';

export default function ScheduleForm({ restaurantId, restaurantName, onSuccess }: any) {
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => apiClient.post('/visits', { restaurantId, visitDate: date, notes }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['visits'] }); onSuccess(); },
  });

  return (
    <div className="space-y-6">
      <div className="p-4 bg-accent/50 rounded-2xl border border-accent"><p className="text-sm font-medium">Visiting</p><p className="text-lg font-black text-primary">{restaurantName}</p></div>
      <div className="space-y-2"><label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">When?</label><div className="relative group"><Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} /><input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold" /></div></div>
      <div className="space-y-2"><label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Notes</label><div className="relative group"><Note className="absolute left-4 top-4 text-muted-foreground" size={20} /><textarea placeholder="Any special requests?" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium resize-none" /></div></div>
      <button onClick={() => mutation.mutate()} disabled={!date || mutation.isPending} className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50">
        {mutation.isPending ? <Spinner size={24} className="animate-spin" /> : <><span>Confirm Schedule</span><Calendar size={24} weight="bold" /></>}
      </button>
    </div>
  );
}
