'use client';

import { X, CheckCircle } from '@phosphor-icons/react';
import ScheduleForm from './ui/schedule-form';
import { useState } from 'react';

export default function ScheduleDialog({ isOpen, onClose, restaurantId, restaurantName }: any) {
  const [isSuccess, setIsSuccess] = useState(false);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black tracking-tight">Schedule Visit</h2><button onClick={onClose} className="p-2 hover:bg-accent rounded-full"><X size={24} weight="bold" /></button></div>
        {isSuccess ? <div className="py-12 flex flex-col items-center text-center"><div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"><CheckCircle size={48} weight="fill" /></div><h3 className="text-2xl font-bold mb-2">Visit Scheduled!</h3><p className="text-muted-foreground">Enjoy your meal at {restaurantName}!</p></div> : (
          <ScheduleForm restaurantId={restaurantId} restaurantName={restaurantName} onSuccess={() => { setIsSuccess(true); setTimeout(() => { setIsSuccess(false); onClose(); }, 2000); }} />
        )}
      </div>
    </div>
  );
}
