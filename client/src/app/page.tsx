'use client';

import Hero from '@/components/landing/hero';
import BentoFeatures from '@/components/landing/bento-features';
import CtaSection from '@/components/landing/cta-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      {/* Editorial Social Proof */}
      <section className="py-8 bg-card border-y border-border/40">
        <div className="container mx-auto px-4 flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
          <span className="text-2xl font-black tracking-tighter">FoodieFeed.</span>
          <span className="text-2xl font-black tracking-tighter">TasteHub.</span>
          <span className="text-2xl font-black tracking-tighter">ChefRank.</span>
          <span className="text-2xl font-black tracking-tighter">BiteGuide.</span>
        </div>
      </section>

      <BentoFeatures />
      <CtaSection />
    </div>
  );
}
