'use client';

import Link from 'next/link';
import { Star, MapPin, Heart, ArrowRight } from '@phosphor-icons/react';

export default function RestaurantCard({ restaurant }: any) {
  const imageUrl = restaurant.images?.[0] || `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800`;
  return (
    <div className="group bg-card rounded-[2rem] border border-border/60 overflow-hidden transition-all duration-500 flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={imageUrl} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-700" />
        <div className="absolute top-4 right-4">
          <button className="bg-white/90 backdrop-blur p-2.5 rounded-2xl text-muted-foreground hover:text-red-500 transition-colors"><Heart size={20} weight="bold" /></button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm uppercase tracking-wider">{restaurant.category}</span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{restaurant.name}</h3>
          <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg">
            <Star size={14} weight="fill" /><span className="text-xs font-black">{restaurant.rating.average.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4"><MapPin size={16} /><span className="line-clamp-1">{restaurant.location.address || restaurant.location.city}</span></div>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1 italic">"{restaurant.description || 'No description available.'}"</p>
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/40">
          <div className="flex flex-col"><span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Price Range</span><span className="font-black text-sm">Ksh {restaurant.priceRange.min} - {restaurant.priceRange.max}</span></div>
          <Link href={`/restaurants/${restaurant._id}`} className="bg-accent hover:bg-primary hover:text-primary-foreground p-3 rounded-2xl transition-all"><ArrowRight size={20} weight="bold" /></Link>
        </div>
      </div>
    </div>
  );
}
