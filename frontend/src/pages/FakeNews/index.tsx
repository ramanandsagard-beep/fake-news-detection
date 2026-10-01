import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Newspaper, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  Sparkles,
  ShieldAlert,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fakeNewsApi } from '../../api/fakeNewsApi';
import { FakeNewsPrediction } from '../../types';

export default function FakeNews() {
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const [selectedModel, setSelectedModel] = useState('logistic_regression');
  const [result, setResult] = useState<FakeNewsPrediction | null>(null);

  const predictMutation = useMutation<FakeNewsPrediction, Error, { text: string; model: string }>({
    mutationFn: (payload) => fakeNewsApi.predict(payload),
    onSuccess: (data) => {
      setResult(data);
      toast.success('News text analysis completed!');
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['fakeNewsPredictions'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Analysis failed');
    },
  });

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || text.length < 5) {
      toast.error('Please enter a longer news article snippet (at least 5 characters).');
      return;
    }
    predictMutation.mutate({
      text,
      model: selectedModel,
    });
  };

  const sampleRealNews = () => {
    setText("WASHINGTON (Reuters) - The U.S. Senate approved major legislative measures on Wednesday to reinforce infrastructure resilience and supply chain transparency across national networks.");
  };

  const sampleFakeNews = () => {
    setText("BOMBSHELL: Secret whistleblowers leak classified documents proving globalist cabal operated hidden subterranean laboratories beneath major capitals! Mainstream media caught concealing the truth!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Natural Language Processing
          </span>
          <span className="text-xs text-slate-500">Binary Classification</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Fake News Detection</h1>
        <p className="text-slate-400 text-sm">
          Classify news text using NLP text cleaning, sublinear TF-IDF vectorization, and trained machine learning classifiers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <form onSubmit={handleAnalyze} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-purple-400" />
                Analyze News Article
              </label>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={sampleRealNews}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Load Real Sample
                </button>
                <button
                  type="button"
                  onClick={sampleFakeNews}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Load Fake Sample
                </button>
              </div>
            </div>

            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste a news article here (headline + body text)..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
              required
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="w-full sm:w-1/2">
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Classifier Algorithm
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="logistic_regression">Logistic Regression (Primary NLP Model)</option>
                  <option value="decision_tree">Decision Tree Classifier</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={predictMutation.isPending}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-purple-600/20 transition-all"
              >
                <Send className="w-4 h-4" />
                {predictMutation.isPending ? 'Processing Text...' : 'Analyze Article'}
              </button>
            </div>
          </form>

          {/* Academic Verification Disclaimer */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/90 leading-relaxed">
              <strong className="font-semibold block mb-0.5 text-amber-300">Important Academic Disclaimer</strong>
              AI prediction only. This system identifies patterns learned from its training data and does not independently verify facts. Do not treat the result as definitive factual verification.
            </div>
          </div>
        </div>

        {/* Prediction Output (1/3 width) */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Classification Result
              </span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>

            {result ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center py-2">
                  <p className="text-xs text-slate-400 mb-1">Model Prediction</p>
                  <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-lg font-black tracking-wider ${
                    (result.prediction || result.prediction_label) === 'REAL'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {(result.prediction || result.prediction_label) === 'REAL' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <ShieldAlert className="w-5 h-5" />
                    )}
                    Model prediction: {result.prediction || result.prediction_label}
                  </div>
                </div>

                {/* Probability meters */}
                <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Model Confidence:</span>
                      <span className="text-white font-bold">
                        {((result.confidence || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${(result.confidence || 0) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                      <p className="text-slate-400 text-[10px]">P(Fake News)</p>
                      <p className="text-rose-400 font-bold text-sm mt-0.5">
                        {((result.probability_fake || 0) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                      <p className="text-slate-400 text-[10px]">P(Real News)</p>
                      <p className="text-emerald-400 font-bold text-sm mt-0.5">
                        {((result.probability_real || 0) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="text-slate-200 font-medium">{result.model || result.model_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <span className="text-slate-200 font-medium">{result.model_version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prediction ID:</span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {(result.prediction_id || result.id)?.slice(0, 13)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Analyzed At:</span>
                    <span className="text-slate-300">
                      {new Date(result.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-600">
                  <Newspaper className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-400">
                  Enter news text and click "Analyze Article" to classify credibility.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
