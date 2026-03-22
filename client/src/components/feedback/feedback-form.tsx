'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { X, Spinner, CheckCircle, ChatTeardropText } from '@phosphor-icons/react';
import StarRating from './ui/star-rating';

export default function FeedbackDialog({ isOpen, onClose, visitId, restaurantId, restaurantName }: any) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const queryClient = useQueryClient();

  const feedbackMutation = useMutation({
    mutationFn: async () => apiClient.post('/feedback', { restaurantId, scheduledVisitId: visitId, rating, comment }),
    onSuccess: () => {
      setIsSuccess(true); queryClient.invalidateQueries({ queryKey: ['visits'] });
      setTimeout(() => { setIsSuccess(false); onClose(); }, 2000);
    },
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black tracking-tight">How was it?</h2><button onClick={onClose} className="p-2 hover:bg-accent rounded-full"><X size={24} weight="bold" /></button></div>
        {isSuccess ? <div className="py-12 flex flex-col items-center text-center"><div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"><CheckCircle size={48} weight="fill" /></div><h3 className="text-2xl font-bold mb-2">Feedback Received!</h3><p className="text-muted-foreground">Thanks for sharing your experience at {restaurantName}!</p></div> : (
          <div className="space-y-8">
            <div className="p-6 bg-accent/50 rounded-3xl border border-accent text-center"><p className="text-sm opacity-60 uppercase tracking-widest mb-1">Rate your experience at</p><p className="text-2xl font-black text-primary">{restaurantName}</p></div>
            <StarRating rating={rating} setRating={setRating} />
            <div className="space-y-2"><label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Write a review</label><div className="relative group"><ChatTeardropText className="absolute left-4 top-4 text-muted-foreground group-focus-within:text-primary" size={20} /><textarea placeholder="Tell us about the food..." value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium resize-none" /></div></div>
            <button onClick={() => feedbackMutation.mutate()} disabled={!rating || feedbackMutation.isPending} className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50">
              {feedbackMutation.isPending ? <Spinner size={24} className="animate-spin" /> : <><span className="uppercase tracking-widest text-xs font-black">Submit Feedback</span><ChatTeardropText size={24} weight="bold" /></>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
