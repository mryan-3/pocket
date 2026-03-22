'use client';

import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)] opacity-50" />
          <h2 className="text-4xl md:text-6xl font-black text-primary-foreground tracking-tighter mb-6 relative z-10">Ready for your<br/>next favorite bite?</h2>
          <p className="text-primary-foreground/80 text-xl font-medium max-w-lg mb-10 relative z-10">Join the waitlist or start exploring immediately. Your personalized menu is waiting.</p>
          <Link href="/register" className="bg-background text-foreground px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm transition-all relative z-10">
            Create Your Profile
          </Link>
        </div>
      </div>
    </section>
  );
}
