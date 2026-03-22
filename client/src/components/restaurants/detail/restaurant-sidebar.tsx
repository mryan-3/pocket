'use client';

import { Phone, Globe } from '@phosphor-icons/react';

export default function RestaurantSidebar({ restaurant }: { restaurant: any }) {
  return (
    <div className="space-y-8">
      <div className="p-8 glass-card rounded-[2.5rem] border border-border/40 space-y-8 sticky top-24">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Contact Info</h3>
          <div className="space-y-4">
            {restaurant.contactInfo?.phone && (
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors"><Phone size={20} weight="bold" /></div>
                <span className="font-medium">{restaurant.contactInfo.phone}</span>
              </div>
            )}
            {restaurant.contactInfo?.website && (
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors"><Globe size={20} weight="bold" /></div>
                <a href={restaurant.contactInfo.website} target="_blank" className="font-medium hover:text-primary underline decoration-primary/20 underline-offset-4">Visit Website</a>
              </div>
            )}
          </div>
        </div>
        <div className="pt-8 border-t border-border/40">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Opening Hours</h3>
          <div className="space-y-3">
            {Object.entries(restaurant.openingHours || {}).map(([day, hours]: [string, any]) => (
              <div key={day} className="flex justify-between items-center text-sm">
                <span className="capitalize font-bold">{day}</span>
                <span className="text-muted-foreground font-medium">{hours.open} - {hours.close}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
