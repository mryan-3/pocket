'use client';

import { useState } from 'react';
import { Star } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export default function StarRating({ rating, setRating }: any) {
  const [hover, setHover] = useState(0);
  const labels: any = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent!' };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)} className="p-1 transition-transform active:scale-90">
            <Star size={48} weight={(hover || rating) >= s ? 'fill' : 'bold'} className={cn("transition-colors", (hover || rating) >= s ? "text-primary" : "text-muted-foreground/30")} />
          </button>
        ))}
      </div>
      <span className="text-sm font-black uppercase tracking-[0.2em] text-primary/60">{labels[rating] || 'Select a rating'}</span>
    </div>
  );
}
