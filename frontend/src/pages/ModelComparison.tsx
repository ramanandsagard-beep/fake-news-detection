import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart3, 
  Layers, 
  Table as TableIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { fakeNewsApi } from '../api/fakeNewsApi';

export default function ModelComparison() {
  const { data: fnData, isLoading: fnLoading } = useQuery({
    queryKey: ['fakeNewsEvaluations'],
    queryFn: fakeNewsApi.getEvaluations,
  });

  const { data: fnCm } = useQuery({
    queryKey: ['fnConfusionMatrix'],
    queryFn: () => fakeNewsApi.getConfusionMatrix('logistic_regression'),
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Fake News Model Comparison</h1>
        <p className="text-slate-400 text-sm">
          Empirical NLP classification evaluation metrics calculated on held-out test data.
        </p>
      </div>

      <div className="space-y-8 animate-fadeIn">
        {fnLoading ? (
          <div className="p-8 text-center text-slate-400">Loading evaluation metrics...</div>
        ) : !fnData?.models?.length ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            Models not trained yet. Visit the Training page to fit NLP classifiers.
          </div>
        ) : (
          <>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <TableIcon className="w-4 h-4 text-cyan-400" />
                  Classification Performance Metrics (Test Set Evaluation)
                </h3>
                <span className="text-xs text-slate-500">25% Held-Out Stratified Test Split</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Model Name</th>
                      <th className="px-6 py-3 font-semibold">Accuracy</th>
                      <th className="px-6 py-3 font-semibold">Precision</th>
                      <th className="px-6 py-3 font-semibold">Recall</th>
                      <th className="px-6 py-3 font-semibold">F1 Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {fnData.models.map((m: any) => (
                      <tr key={m.name} className="hover:bg-slate-800/30">
                        <td className="px-6 py-4 font-medium text-white">{m.name}</td>
                        <td className="px-6 py-4 text-cyan-400 font-mono font-bold">{(m.accuracy * 100).toFixed(2)}%</td>
                        <td className="px-6 py-4 font-mono">{(m.precision * 100).toFixed(2)}%</td>
                        <td className="px-6 py-4 font-mono">{(m.recall * 100).toFixed(2)}%</td>
                        <td className="px-6 py-4 font-mono font-bold text-emerald-400">{(m.f1_score * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Classifier Accuracy Comparison
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fnData.models}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 1]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }}
                      />
                      <Bar dataKey="accuracy" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Logistic Regression Confusion Matrix (Actual Test Data)
                </h3>
                {fnCm?.matrix ? (
                  <div className="flex flex-col items-center justify-center p-4">
                    <div className="grid grid-cols-2 gap-2 w-64 text-center">
                      <div className="bg-cyan-900/40 border border-cyan-500/30 p-4 rounded-lg">
                        <p className="text-[10px] text-slate-400">True Fake (TN)</p>
                        <p className="text-xl font-bold text-white mt-1">{fnCm.matrix[0][0]}</p>
                      </div>
                      <div className="bg-rose-900/30 border border-rose-500/20 p-4 rounded-lg">
                        <p className="text-[10px] text-slate-400">False Real (FP)</p>
                        <p className="text-xl font-bold text-rose-300 mt-1">{fnCm.matrix[0][1]}</p>
                      </div>
                      <div className="bg-rose-900/30 border border-rose-500/20 p-4 rounded-lg">
                        <p className="text-[10px] text-slate-400">False Fake (FN)</p>
                        <p className="text-xl font-bold text-rose-300 mt-1">{fnCm.matrix[1][0]}</p>
                      </div>
                      <div className="bg-cyan-900/40 border border-cyan-500/30 p-4 rounded-lg">
                        <p className="text-[10px] text-slate-400">True Real (TP)</p>
                        <p className="text-xl font-bold text-white mt-1">{fnCm.matrix[1][1]}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-4">
                      Test Set Accuracy: <strong className="text-emerald-400">{(fnCm.accuracy * 100).toFixed(1)}%</strong>
                    </p>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-xs text-slate-500">
                    Confusion matrix available after evaluation.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
