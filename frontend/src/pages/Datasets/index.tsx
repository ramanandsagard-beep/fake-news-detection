import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Database, 
  Upload, 
  FileText, 
  Eye, 
  Newspaper
} from 'lucide-react';
import toast from 'react-hot-toast';
import { datasetApi } from '../../api/datasetApi';
import { Dataset } from '../../types';

export default function DatasetPage() {
  const queryClient = useQueryClient();
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);

  // Upload Form state
  const [uploadName, setUploadName] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const { data: datasets, isLoading } = useQuery({
    queryKey: ['datasets', 'FAKE_NEWS'],
    queryFn: () => datasetApi.getAll('FAKE_NEWS'),
  });

  const { data: inspectedDataset, isLoading: inspectLoading } = useQuery({
    queryKey: ['datasetDetail', selectedDatasetId],
    queryFn: () => (selectedDatasetId ? datasetApi.getById(selectedDatasetId) : null),
    enabled: !!selectedDatasetId,
  });

  const uploadMutation = useMutation<Dataset, Error, FormData>({
    mutationFn: (data: FormData) => datasetApi.upload(data),
    onSuccess: () => {
      toast.success('News Dataset uploaded and validated successfully!');
      setUploadName('');
      setUploadFile(null);
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Dataset upload failed.');
    },
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error('Please select a CSV file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('name', uploadName || uploadFile.name);
    formData.append('project_type', 'FAKE_NEWS');
    formData.append('target_column', 'class');
    formData.append('text_column', 'text');
    uploadMutation.mutate(formData);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-cyan-400" />
          Fake News Dataset Management
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Upload and dynamically inspect news article datasets. Text columns and class distributions are extracted automatically.
        </p>
      </div>

      {/* Upload Box */}
      <form onSubmit={handleUploadSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
          <Upload className="w-4 h-4 text-cyan-400" />
          Upload News CSV Dataset
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Dataset Label</label>
            <input
              type="text"
              placeholder="e.g. Kaggle Fake & Real News Dataset"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">CSV File (Requires 'text' & 'class' columns)</label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-300 text-xs"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={uploadMutation.isPending}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-colors"
          >
            {uploadMutation.isPending ? 'Validating CSV...' : 'Upload & Inspect Dataset'}
          </button>
        </div>
      </form>

      {/* Dataset List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Registered News Datasets
          </h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading datasets...</div>
        ) : !datasets?.length ? (
          <div className="p-8 text-center text-xs text-slate-500">No news datasets found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Rows</th>
                  <th className="px-6 py-3 font-semibold">Columns</th>
                  <th className="px-6 py-3 font-semibold">Target Column</th>
                  <th className="px-6 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {datasets.map((ds) => (
                  <tr key={ds.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-3 font-medium text-white">{ds.name}</td>
                    <td className="px-6 py-3 font-mono">{ds.row_count}</td>
                    <td className="px-6 py-3 font-mono">{ds.column_count}</td>
                    <td className="px-6 py-3 font-mono text-cyan-400">{ds.target_column}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => setSelectedDatasetId(ds.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dataset Inspection Details Modal / Card */}
      {selectedDatasetId && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Dynamic Inspection: {inspectedDataset?.name}
              </h3>
              <p className="text-xs text-slate-400">File: {inspectedDataset?.file_name}</p>
            </div>
            <button
              onClick={() => setSelectedDatasetId(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close Inspector
            </button>
          </div>

          {inspectLoading ? (
            <p className="text-xs text-slate-400">Inspecting dataset metadata and sample rows...</p>
          ) : inspectedDataset ? (
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/40 p-3 rounded-lg">
                  <p className="text-slate-400">Total Rows</p>
                  <p className="text-lg font-bold text-white mt-1">{inspectedDataset.row_count}</p>
                </div>
                <div className="bg-slate-800/40 p-3 rounded-lg">
                  <p className="text-slate-400">Total Columns</p>
                  <p className="text-lg font-bold text-white mt-1">{inspectedDataset.column_count}</p>
                </div>
                <div className="bg-slate-800/40 p-3 rounded-lg">
                  <p className="text-slate-400">Text Column</p>
                  <p className="text-lg font-bold text-cyan-400 mt-1">{inspectedDataset.text_column || 'text'}</p>
                </div>
                <div className="bg-slate-800/40 p-3 rounded-lg">
                  <p className="text-slate-400">Target Column</p>
                  <p className="text-lg font-bold text-blue-400 mt-1">{inspectedDataset.target_column || 'class'}</p>
                </div>
              </div>

              {/* Sample Rows Preview */}
              <div>
                <h4 className="font-semibold text-slate-200 mb-2">First 5 Sample Records</h4>
                <div className="overflow-x-auto bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
                  <pre className="text-slate-300">
                    {JSON.stringify(inspectedDataset.sample_rows.slice(0, 3), null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
