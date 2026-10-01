import React from 'react';
import { clsx } from 'clsx';

export default function Badge({ children, variant = 'primary', className }: { children: React.ReactNode, variant?: 'primary'|'success'|'warning'|'error'|'neutral', className?: string }) {
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    neutral: 'bg-slate-700/50 text-slate-300 border-slate-600',
  };

  return (
    <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium border", variants[variant], className)}>
      {children}
    </span>
  );
}
