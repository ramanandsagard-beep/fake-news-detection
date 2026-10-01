import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Newspaper, 
  BarChart2, 
  Database, 
  Cpu, 
  History, 
  BookOpen, 
  ShieldCheck,
  Activity
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Fake News Detector', path: '/fake-news', icon: Newspaper },
  { name: 'Model Comparison', path: '/models', icon: BarChart2 },
  { name: 'Analysis & Graphs', path: '/analysis', icon: Activity },
  { name: 'Datasets', path: '/datasets', icon: Database },
  { name: 'Train Models', path: '/training', icon: Cpu },
  { name: 'Prediction History', path: '/history', icon: History },
  { name: 'Academic Viva / About', path: '/about', icon: BookOpen },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-screen">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Fake News NLP
          </h1>
          <p className="text-[11px] text-slate-400">Standalone Detection Hub</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Platform Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3 text-xs border border-slate-700/50">
          <div className="flex items-center gap-2 text-emerald-400 font-medium mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            System Online
          </div>
          <p className="text-slate-400 text-[11px]">Fake News Detection Ready</p>
        </div>
      </div>
    </aside>
  );
}
