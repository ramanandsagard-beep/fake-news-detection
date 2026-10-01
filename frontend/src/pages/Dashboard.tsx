import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Newspaper, 
  TrendingUp, 
  ArrowRight,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { dashboardApi } from '../api/dashboardApi';

export default function Dashboard() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: dashboardApi.getSummary,
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            Standalone NLP System
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Fake News Detection Analytics Hub
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Automated news credibility verification using Natural Language Processing. Analyzes articles with TF-IDF vectorization, Logistic Regression, and Decision Tree Classifiers.
          </p>
        </div>
      </div>

      {/* Core Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative group bg-slate-900/90 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Newspaper className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              NLP Classification
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Article Credibility Classifier</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Input news text or headlines to determine authenticity and view real-time confidence scores (Real vs Fake).
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-500">Binary: Real (1) vs Fake (0)</span>
            <Link
              to="/fake-news"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-md transition-colors"
            >
              Open Classifier Tool
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="relative group bg-slate-900/90 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Confusion Matrix & Graphs
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">NLP Visual Analytics</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Examine interactive confusion matrices, word count histograms, class distributions, and evaluation radar metrics.
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-500">Metrics: Accuracy, F1-Score, Precision</span>
            <Link
              to="/analysis"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-colors"
            >
              View Analytics
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Live Statistics */}
      <div>
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          Live Model Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">News Classifications</p>
            <p className="text-2xl font-bold text-white mt-1">
              {isLoading ? '...' : summary?.total_predictions ?? 0}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Training Runs</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {isLoading ? '...' : summary?.total_training_runs ?? 0}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Active Models</p>
            <p className="text-2xl font-bold text-cyan-400 mt-1">
              {isLoading ? '...' : summary?.active_models ?? 0}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Datasets</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {isLoading ? '...' : summary?.total_datasets ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Latest Activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Recent Classification History
        </h3>
        {isLoading ? (
          <p className="text-xs text-slate-500">Loading activity feed...</p>
        ) : !summary?.recent_activity?.length ? (
          <p className="text-xs text-slate-500">No news analyses recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {summary.recent_activity.map((act) => (
              <div key={act.id} className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400">
                    {act.project}
                  </span>
                  <span className="text-slate-300">{act.summary}</span>
                </div>
                <span className="text-slate-500 text-[11px]">
                  {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
