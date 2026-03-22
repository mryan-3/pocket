'use client';

import { ForkKnife } from '@phosphor-icons/react';

export default function RestaurantTabs({ menu }: { menu: any[] }) {
  return (
    <div className="lg:col-span-2 space-y-12">
      <section>
        <h2 className="text-2xl font-black mb-6 flex items-center gap-3 uppercase tracking-tighter">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center"><ForkKnife size={20} weight="bold" className="text-primary" /></div>
          The Menu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menu?.map((item: any) => (
            <div key={item._id} className="p-6 glass-card rounded-3xl border border-border/40 hover:border-primary/30 transition-colors group">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{item.name}</h3>
                <span className="font-black text-primary">Ksh {item.price}</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.description || 'A delicious dish prepared with the finest ingredients.'}</p>
              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground bg-accent px-2 py-1 rounded-md">{item.category || 'Main Course'}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
