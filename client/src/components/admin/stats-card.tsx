'use client';

import { IconProps } from '@phosphor-icons/react';
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType<IconProps>;
  trend?: string;
  trendType?: 'up' | 'down';
}

export default function StatsCard({ label, value, icon: Icon, trend, trendType }: StatsCardProps) {
  return (
    <div className="p-8 glass-card border border-border/40 rounded-[2.5rem] relative overflow-hidden group hover:border-primary/40 transition-all duration-500">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex items-center justify-between mb-10">
        <div className="p-4 bg-accent/50 rounded-2xl group-hover:bg-primary/10 transition-colors group-hover:scale-110 duration-500">
          <Icon size={32} weight="bold" className="text-primary" />
        </div>
        {trend && (
          <span className={`text-xs font-black uppercase tracking-widest ${trendType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </span>
        )}
      </div>

      <div>
        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</h4>
        <p className="text-5xl font-black tracking-tighter leading-tight">{value}</p>
      </div>
    </div>
  );
}
