import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Cpu, 
  Play, 
  RefreshCw,
  Newspaper
} from 'lucide-react';
import toast from 'react-hot-toast';
import { trainingApi } from '../api/trainingApi';
import { datasetApi } from '../api/datasetApi';

export default function Training() {
  const queryClient = useQueryClient();
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [testSplit, setTestSplit] = useState<number>(0.25);

  // Load datasets for Fake News
  const { data: datasets, isLoading: datasetsLoading } = useQuery({
    queryKey: ['datasets', 'FAKE_NEWS'],
    queryFn: () => datasetApi.getAll('FAKE_NEWS'),
  });

  // Load previous training runs
  const { data: runs, isLoading: runsLoading } = useQuery({
    queryKey: ['trainingRuns', 'FAKE_NEWS'],
    queryFn: () => trainingApi.getRuns('FAKE_NEWS'),
  });

  const trainMutation = useMutation({
    mutationFn: trainingApi.startTraining,
    onSuccess: (data) => {
      toast.success(`Fake News NLP training completed! Trained ${data.length} models.`);
      queryClient.invalidateQueries({ queryKey: ['trainingRuns'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['fakeNewsEvaluations'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Model training failed.');
    },
  });

  const handleStartTraining = () => {
    trainMutation.mutate({
      project_type: 'FAKE_NEWS',
      dataset_id: selectedDatasetId || undefined,
      test_size: testSplit,
      random_state: 42,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-cyan-400" />
          Fake News NLP Model Training Engine
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Execute full NLP pipeline: TF-IDF text vectorization, train/test split, classifier fitting (Logistic Regression, Passive Aggressive), and evaluation metrics persistence.
        </p>
      </div>

      {/* Training Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <h2 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">
          Training Configuration & Dataset Source
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Target Training Dataset</label>
            <select
              value={selectedDatasetId}
              onChange={(e) => setSelectedDatasetId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white"
            >
              <option value="">Default News Dataset (news_dataset.csv)</option>
              {datasets?.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.name} ({ds.row_count} rows, {ds.column_count} cols)
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Upload custom CSV datasets on the Datasets page to train on new news data.
            </p>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">
              Held-Out Test Set Proportion (Currently: {(testSplit * 100).toFixed(0)}% Testing / {((1 - testSplit) * 100).toFixed(0)}% Training)
            </label>
            <input
              type="range"
              min="0.10"
              max="0.40"
              step="0.05"
              value={testSplit}
              onChange={(e) => setTestSplit(parseFloat(e.target.value))}
              className="w-full mt-2 accent-cyan-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>10% Test</span>
              <span>Default (25%)</span>
              <span>40% Test</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            <span className="font-semibold text-cyan-400">Data Leakage Protection:</span> TF-IDF Vectorizer is fitted strictly on the training partition.
          </div>

          <button
            type="button"
            onClick={handleStartTraining}
            disabled={trainMutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-cyan-600/20 transition-all"
          >
            {trainMutation.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Training NLP Pipelines...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Execute Training Pipeline
              </>
            )}
          </button>
        </div>
      </div>

      {/* Historical Training Runs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Historical Training Runs (Fake News)
          </h3>
          <span className="text-xs text-slate-500">{runs?.length || 0} Runs Stored</span>
        </div>

        {runsLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading training logs...</div>
        ) : !runs?.length ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No fake news training runs recorded. Click "Execute Training Pipeline" above to train models.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">Model</th>
                  <th className="px-6 py-3 font-semibold">Version</th>
                  <th className="px-6 py-3 font-semibold">Training / Testing Rows</th>
                  <th className="px-6 py-3 font-semibold">Accuracy Metric</th>
                  <th className="px-6 py-3 font-semibold">Trained At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {runs.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-3 font-medium text-white capitalize">{r.model_name.replace(/_/g, ' ')}</td>
                    <td className="px-6 py-3 text-slate-400 font-mono">{r.model_version}</td>
                    <td className="px-6 py-3 text-slate-400">
                      {r.training_rows} train / {r.testing_rows} test
                    </td>
                    <td className="px-6 py-3 font-mono font-bold text-cyan-400">
                      Accuracy: {((r.metrics?.accuracy || 0) * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-3 text-slate-400">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
