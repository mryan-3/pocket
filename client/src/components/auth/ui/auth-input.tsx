'use client';

import { cn } from '@/lib/utils';

export default function AuthInput({ label, icon: Icon, register, name, type, error, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"><Icon size={20} /></div>
        <input {...register(name)} type={type} placeholder={placeholder} className={cn("w-full bg-background border border-border rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary", error && "border-red-500")} />
      </div>
      {error && <p className="text-xs text-red-500 ml-1">{error.message}</p>}
    </div>
  );
}
