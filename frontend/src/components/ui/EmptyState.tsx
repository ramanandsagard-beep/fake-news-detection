import React from 'react';
import { LucideIcon } from 'lucide-react';

export default function EmptyState({ icon: Icon, message }: { icon: LucideIcon, message: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-500" />
      </div>
      <p className="text-lg font-medium text-slate-400">{message}</p>
    </div>
  );
}
