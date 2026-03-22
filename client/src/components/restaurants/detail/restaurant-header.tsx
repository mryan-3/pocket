'use client';

import { Star, MapPin, CalendarPlus, ArrowRight, CaretLeft } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';

export default function RestaurantHeader({ restaurant, isAuthenticated, onSchedule }: any) {
  const router = useRouter();
  return (
    <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
      <img src={restaurant.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1600'} alt={restaurant.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className="absolute top-8 left-8">
        <button onClick={() => router.back()} className="bg-white/90 backdrop-blur p-3 rounded-2xl shadow-lg hover:scale-105 transition-transform"><CaretLeft size={24} weight="bold" /></button>
      </div>
      <div className="absolute bottom-12 left-0 w-full"><div className="container mx-auto px-4"><div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">{restaurant.category}</span>
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-sm font-black shadow-sm">
              <Star size={16} weight="fill" className="text-primary" /><span>{restaurant.rating.average.toFixed(1)}</span>
              <span className="text-muted-foreground font-medium">({restaurant.rating.count})</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">{restaurant.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground font-medium"><MapPin size={20} weight="bold" /><span>{restaurant.location.address}, {restaurant.location.city}</span></div>
        </div>
        <button onClick={onSchedule} className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 group">
          <CalendarPlus size={24} weight="bold" /><span>Schedule a Visit</span><ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div></div></div>
    </div>
  );
}
