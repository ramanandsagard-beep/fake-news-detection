import React from 'react';
import { Sparkles, Database, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function TopBar() {
  const location = useLocation();

  const getModuleTitle = () => {
    if (location.pathname.startsWith('/house-price')) return 'House Price Prediction Module';
    if (location.pathname.startsWith('/fake-news')) return 'Fake News Detection Module';
    if (location.pathname.startsWith('/models')) return 'Model Evaluation & Comparison';
    if (location.pathname.startsWith('/datasets')) return 'Dataset Management & Inspection';
    if (location.pathname.startsWith('/training')) return 'Model Training Engine';
    if (location.pathname.startsWith('/history')) return 'Unified Prediction History';
    if (location.pathname.startsWith('/about')) return 'Academic Viva & Architecture Guide';
    return 'Main Analytics Dashboard';
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-pink-400" />
        <h2 className="text-sm font-semibold text-slate-200">
          {getModuleTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60">
          <Database className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-300">Connected: SQLite / Supabase DB</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <User className="w-3.5 h-3.5 text-pink-400" />
          <span>ML Researcher</span>
        </div>
      </div>
    </header>
  );
}
