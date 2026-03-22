'use client';

import { Sparkle, CalendarPlus, ChatCircle } from '@phosphor-icons/react';

export default function BentoFeatures() {
  return (
    <section className="py-24 bg-accent/30 relative">
      <div className="container mx-auto px-4">
        <div className="mb-16 md:mb-24">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-6">Precision over<br/>abundance.</h2>
          <p className="text-muted-foreground text-xl font-medium max-w-lg">Our engine strips away the noise, delivering only high-signal dining recommendations tailored to your taste.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="md:col-span-2 bg-card p-10 lg:p-14 rounded-[3rem] border border-border/40 transition-all duration-500">
             <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-10"><Sparkle size={32} weight="fill" /></div>
             <h3 className="text-3xl lg:text-4xl font-black mb-4 tracking-tight">Algorithmic Curation</h3>
             <p className="text-muted-foreground text-lg max-w-md leading-relaxed">We analyze aggregated ratings, precise affordability metrics, and your historical palate to score restaurants from 0 to 100.</p>
          </div>
          <div className="flex flex-col gap-6 lg:gap-8">
            <div className="flex-1 bg-card p-8 lg:p-10 rounded-[3rem] border border-border/40 transition-all duration-500">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-xl flex items-center justify-center mb-6"><CalendarPlus size={24} weight="bold" /></div>
              <h3 className="text-xl font-black mb-2 tracking-tight">Frictionless Booking</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Lock in your visit and let our dashboard handle the itinerary.</p>
            </div>
            <div className="flex-1 bg-card p-8 lg:p-10 rounded-[3rem] border border-border/40 transition-all duration-500">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-xl flex items-center justify-center mb-6"><ChatCircle size={24} weight="bold" /></div>
              <h3 className="text-xl font-black mb-2 tracking-tight">Authentic Feedback</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Your post-meal reviews instantly recalibrate the global scoring engine.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
