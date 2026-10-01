import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export default function Button({
  className,
  variant = 'primary',
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-glow-primary border-0 focus:ring-primary",
    secondary: "bg-slate-700 text-white hover:bg-slate-600 focus:ring-slate-500",
    outline: "border border-slate-600 text-slate-300 hover:bg-slate-800 focus:ring-slate-500",
    ghost: "text-slate-300 hover:bg-slate-800 hover:text-white focus:ring-slate-500",
  };

  return (
    <button
      className={clsx(baseStyle, variants[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
