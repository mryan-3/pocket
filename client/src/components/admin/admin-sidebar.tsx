'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Layout,
  Users,
  Storefront,
  ListChecks,
  ArrowLeft
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'Dashboard', icon: Layout},
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/restaurants', label: 'Restaurants', icon: Storefront },
  { href: '/admin/monitoring', label: 'Monitoring', icon: ListChecks },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border/40 bg-card/50 backdrop-blur-xl h-screen sticky top-0 flex flex-col p-6">
      <div className="mb-10">
        <Link href="/" className="flex items-center gap-2 group mb-8 opacity-60 hover:opacity-100 transition-opacity">
          <ArrowLeft size={16} weight="bold" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Site</span>
        </Link>
        <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
          Admin <span className="text-primary italic">Panel</span>
        </h2>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              )}
            >
              <link.icon size={20} weight={isActive ? "fill" : "bold"} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-border/40">
        <div className="p-4 bg-accent/50 rounded-2xl border border-border/40">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold">System Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
