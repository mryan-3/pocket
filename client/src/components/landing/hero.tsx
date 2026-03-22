'use client';

import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react';

export default function Hero() {
  return (
    <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-block border-b-2 border-primary pb-1"><span className="text-sm font-black uppercase tracking-[0.3em] text-primary">PocketBite Engine</span></div>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">Stop Searching.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Start Tasting.</span></h1>
          <p className="text-xl text-muted-foreground max-w-lg font-medium leading-relaxed">An editorial approach to dining. We curate, rank, and schedule your culinary adventures based on your exact palate and budget.</p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/restaurants" className="group bg-foreground text-background px-8 py-5 rounded-full font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-primary hover:text-primary-foreground transition-all">
              <span>Explore Menu</span><ArrowUpRight size={20} weight="bold" />
            </Link>
          </div>
        </div>
        <div className="flex-1 relative w-full aspect-square lg:aspect-auto lg:h-[600px] animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-both">
          <div className="absolute top-0 right-0 w-[75%] h-[80%] rounded-[3rem] overflow-hidden z-10 border border-border"><img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Gourmet food" /></div>
          <div className="absolute bottom-0 left-0 w-[65%] h-[65%] rounded-[3rem] border-8 border-background overflow-hidden z-20 border border-border"><img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Restaurant interior" /></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px] -z-10" />
        </div>
      </div>
    </section>
  );
}
