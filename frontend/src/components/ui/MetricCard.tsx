import React from 'react';
import Card from './Card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export default function MetricCard({ title, value, icon: Icon, trend, trendUp }: MetricCardProps) {
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold text-slate-100 mt-2">{value}</h3>
        {trend && (
          <p className={`text-sm mt-2 ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
      <div className="p-3 bg-slate-800 rounded-lg">
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </Card>
  );
}
