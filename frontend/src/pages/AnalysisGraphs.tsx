import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Database,
  GitCompare,
  Sparkles,
  Target,
  Layers,
  LayoutGrid
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { analysisApi } from '../api/analysisApi';

const COLORS = {
  purple: '#a855f7',
  emerald: '#10b981',
  amber: '#f59e0b',
  cyan: '#06b6d4',
  rose: '#f43f5e',
};
const PIE_COLORS = [COLORS.rose, COLORS.emerald];
const FN_MODEL_COLORS = [COLORS.purple, COLORS.amber];

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-700 transition-all duration-300 shadow-lg">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} shadow-lg`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-lg font-bold text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, subtitle, icon: Icon, iconColor, children }: any) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-800/80">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2.5">
          {Icon && <Icon className={`w-4 h-4 ${iconColor || 'text-cyan-400'}`} />}
          {title}
        </h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800/95 backdrop-blur-lg border border-slate-700 rounded-lg p-3 shadow-xl">
      {label && <p className="text-xs text-slate-400 mb-1 font-medium">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs font-mono" style={{ color: p.color || '#fff' }}>
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function AnalysisGraphs() {
  const { data: summary } = useQuery({ queryKey: ['analysisSummary'], queryFn: analysisApi.getSummary });
  const { data: fnOverview } = useQuery({ queryKey: ['fnOverview'], queryFn: analysisApi.getFnDatasetOverview });
  const { data: fnClassDist } = useQuery({ queryKey: ['fnClassDist'], queryFn: analysisApi.getFnClassDistribution });
  const { data: fnTextLen } = useQuery({ queryKey: ['fnTextLen'], queryFn: analysisApi.getFnTextLengthDistribution });
  const { data: fnCMs } = useQuery({ queryKey: ['fnCMs'], queryFn: analysisApi.getFnAllConfusionMatrices });
  const { data: fnComparison } = useQuery({ queryKey: ['fnComparison'], queryFn: analysisApi.getFnModelComparison });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Fake News NLP Analytics & Visualizations</h1>
            <p className="text-slate-400 text-xs">Dataset distribution, text length histograms, confusion matrices & model comparisons</p>
          </div>
        </div>
      </div>

      {summary?.fake_news && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Database} label="Articles" value={summary.fake_news.dataset_rows?.toLocaleString() || '—'} color="from-purple-500 to-indigo-600" />
          <StatCard icon={Target} label="Best Accuracy" value={summary.fake_news.best_accuracy ? `${(summary.fake_news.best_accuracy * 100).toFixed(1)}%` : '—'} color="from-amber-500 to-orange-600" />
          <StatCard icon={Activity} label="Best Model" value={summary.fake_news.best_model || '—'} color="from-cyan-500 to-blue-600" />
          <StatCard icon={Layers} label="Vectorization" value="TF-IDF (5000 features)" color="from-emerald-500 to-teal-600" />
        </div>
      )}

      <div className="space-y-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-bold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Phase 1 — Dataset Exploration
        </div>

        {fnOverview && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={LayoutGrid} label="Total Articles" value={fnOverview.rows?.toLocaleString()} color="from-purple-500 to-violet-600" />
            <StatCard icon={Layers} label="Columns" value={fnOverview.columns} color="from-cyan-500 to-blue-600" />
            <StatCard icon={Activity} label="Avg Text Length" value={fnOverview.text_length_stats?.mean?.toLocaleString() || '—'} color="from-amber-500 to-orange-600" />
            <StatCard icon={Database} label="Missing Values" value={Object.keys(fnOverview.missing_values || {}).length} color="from-rose-500 to-red-600" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section title="Class Distribution (Fake vs Real)" subtitle="Target variable balance" icon={PieChartIcon} iconColor="text-purple-400">
            <div className="h-72 flex items-center justify-center">
              {fnClassDist?.distribution?.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fnClassDist.distribution}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={55}
                      strokeWidth={2}
                      stroke="#0f172a"
                    >
                      {fnClassDist.distribution.map((_: any, i: number) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs text-slate-500">Loading...</div>
              )}
            </div>
            {fnClassDist?.distribution?.length > 0 && (
              <div className="flex justify-center gap-6 mt-2">
                {fnClassDist.distribution.map((d: any, i: number) => (
                  <div key={d.label} className="text-center">
                    <p className="text-lg font-bold" style={{ color: PIE_COLORS[i] }}>{d.value?.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">{d.label}</p>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="Article Text Length Distribution" subtitle="Character count distribution across articles" icon={BarChart3} iconColor="text-cyan-400">
            <div className="h-72">
              {fnTextLen?.histogram?.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fnTextLen.histogram}>
                    <defs>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="range" stroke="#94a3b8" fontSize={8} angle={-30} textAnchor="end" height={55} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="count" stroke={COLORS.purple} fill="url(#purpleGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">Loading...</div>
              )}
            </div>
          </Section>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-bold pt-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Phase 2 — Model Confusion Matrices
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {fnCMs?.matrices && Object.entries(fnCMs.matrices).map(([name, matrix]: [string, any], idx) => (
            <Section key={name} title={`Confusion Matrix — ${name}`} subtitle="Rows: Actual, Columns: Predicted" icon={Target} iconColor={idx === 0 ? 'text-cyan-400' : 'text-amber-400'}>
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-[10px] text-slate-500 mb-3 tracking-wider uppercase">Predicted →</p>
                <div className="flex items-start gap-3">
                  <div className="flex items-center -rotate-90 translate-y-16">
                    <p className="text-[10px] text-slate-500 tracking-wider uppercase whitespace-nowrap">Actual →</p>
                  </div>
                  <div className="grid grid-cols-3 gap-0 text-center">
                    <div />
                    <div className="p-2 text-[10px] text-slate-500 font-bold">Fake (0)</div>
                    <div className="p-2 text-[10px] text-slate-500 font-bold">Real (1)</div>
                    <div className="p-2 text-[10px] text-slate-500 font-bold flex items-center justify-end pr-3">Fake (0)</div>
                    <div className="bg-cyan-900/40 border border-cyan-500/30 p-4 rounded-lg m-0.5 hover:scale-105 transition-transform">
                      <p className="text-[9px] text-slate-400">TN</p>
                      <p className="text-xl font-bold text-white">{matrix[0][0]}</p>
                    </div>
                    <div className="bg-rose-900/30 border border-rose-500/20 p-4 rounded-lg m-0.5 hover:scale-105 transition-transform">
                      <p className="text-[9px] text-slate-400">FP</p>
                      <p className="text-xl font-bold text-rose-300">{matrix[0][1]}</p>
                    </div>
                    <div className="p-2 text-[10px] text-slate-500 font-bold flex items-center justify-end pr-3">Real (1)</div>
                    <div className="bg-rose-900/30 border border-rose-500/20 p-4 rounded-lg m-0.5 hover:scale-105 transition-transform">
                      <p className="text-[9px] text-slate-400">FN</p>
                      <p className="text-xl font-bold text-rose-300">{matrix[1][0]}</p>
                    </div>
                    <div className="bg-cyan-900/40 border border-cyan-500/30 p-4 rounded-lg m-0.5 hover:scale-105 transition-transform">
                      <p className="text-[9px] text-slate-400">TP</p>
                      <p className="text-xl font-bold text-white">{matrix[1][1]}</p>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-4">
                  Accuracy: <strong className="text-emerald-400">{(((matrix[0][0] + matrix[1][1]) / (matrix[0][0] + matrix[0][1] + matrix[1][0] + matrix[1][1])) * 100).toFixed(1)}%</strong>
                </p>
              </div>
            </Section>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-bold pt-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Phase 3 — Model Performance Radar
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section title="Classifier Metrics Comparison" subtitle="Accuracy, Precision, Recall, F1 side-by-side" icon={BarChart3} iconColor="text-cyan-400">
            <div className="h-72">
              {fnComparison?.models?.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fnComparison.models}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 1]} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="accuracy" name="Accuracy" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="precision" name="Precision" fill={COLORS.cyan} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="recall" name="Recall" fill={COLORS.emerald} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="f1_score" name="F1 Score" fill={COLORS.amber} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">No data</div>
              )}
            </div>
          </Section>

          <Section title="Multi-Metric Radar Comparison" subtitle="Larger area = better overall classifier performance" icon={GitCompare} iconColor="text-amber-400">
            <div className="h-72">
              {fnComparison?.radar?.length ? (
                (() => {
                  const metricsKeys = ['Accuracy', 'Precision', 'Recall', 'F1 Score'];
                  const radarData = metricsKeys.map(metric => {
                    const point: any = { metric };
                    fnComparison.radar.forEach((model: any) => {
                      point[model.name] = model[metric] ?? 0;
                    });
                    return point;
                  });
                  const modelNames = fnComparison.radar.map((r: any) => r.name);
                  return (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={10} />
                        <PolarRadiusAxis stroke="#475569" fontSize={9} domain={[0, 1]} />
                        {modelNames.map((name: string, i: number) => (
                          <Radar
                            key={name}
                            name={name}
                            dataKey={name}
                            stroke={FN_MODEL_COLORS[i % FN_MODEL_COLORS.length]}
                            fill={FN_MODEL_COLORS[i % FN_MODEL_COLORS.length]}
                            fillOpacity={0.15}
                            strokeWidth={2}
                          />
                        ))}
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Tooltip content={<ChartTooltip />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  );
                })()
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">No data</div>
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
