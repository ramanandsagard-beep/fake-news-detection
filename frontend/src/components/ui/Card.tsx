import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export default function Card({ className, children, glow, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-background-card border border-slate-700/50 rounded-xl p-6",
        glow && "hover:shadow-glow-accent transition-shadow duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
