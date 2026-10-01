import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-slate-400 font-medium">{text}</p>
    </div>
  );
}
