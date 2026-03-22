'use client';

import Link from 'next/link';
import { ForkKnife, User, Bell, SignOut } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-xl transition-transform group-hover:rotate-12">
              <ForkKnife size={24} weight="bold" className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Pocket<span className="text-primary">Bite</span>
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/restaurants" className="hover:text-primary transition-colors">
            Explore
          </Link>
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-accent rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
          </button>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold leading-none">{user?.name}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Member</span>
              </div>
              <button 
                onClick={() => logout()}
                className="p-2.5 bg-accent hover:bg-red-50 hover:text-red-500 rounded-xl transition-all active:scale-95"
                title="Sign Out"
              >
                <SignOut size={20} weight="bold" />
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <User size={18} weight="bold" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
