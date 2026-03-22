'use client';

export default function DiscoveryHeader() {
  return (
    <div className="max-w-4xl mb-16">
      <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
        Discover your<br />
        <span className="text-primary underline decoration-primary/20 underline-offset-8 italic">next favorite</span> bite
      </h1>
      <p className="text-muted-foreground text-lg">Personalized recommendations based on your preferences, budget, and favorites.</p>
    </div>
  );
}
