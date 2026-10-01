import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Building2, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { housePriceApi } from '../../api/housePriceApi';
import { HousePricePrediction } from '../../types';

export default function HousePrice() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    LotArea: 8450,
    YearBuilt: 2003,
    YearRemodAdd: 2003,
    OverallCond: 5,
    OverallQual: 7,
    TotalBsmtSF: 856,
    GrLivArea: 1710,
    FullBath: 2,
    HalfBath: 1,
    BedroomAbvGr: 3,
    GarageCars: 2,
    GarageArea: 548,
    MSZoning: 'RL',
    LotConfig: 'Inside',
    BldgType: '1Fam',
    Exterior1st: 'VinylSd',
    MSSubClass: 60,
  });

  const [selectedModel, setSelectedModel] = useState('linear_regression');
  const [result, setResult] = useState<HousePricePrediction | null>(null);

  const predictMutation = useMutation<HousePricePrediction, Error, { model: string; features: Record<string, any> }>({
    mutationFn: (payload) => housePriceApi.predict(payload),
    onSuccess: (data) => {
      setResult(data);
      toast.success('House price estimation complete!');
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['housePricePredictions'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Prediction failed');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    predictMutation.mutate({
      model: selectedModel,
      features: formData,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
            Regression Pipeline
          </span>
          <span className="text-xs text-slate-500">Supervised Learning</span>
        </div>
        <h1 className="text-2xl font-bold text-white">House Price Prediction</h1>
        <p className="text-slate-400 text-sm">
          Estimate continuous property market valuation (<code className="text-pink-400">SalePrice</code>) based on physical attributes and location zoning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column (2/3 width) */}
        <form onSubmit={handlePredict} className="lg:col-span-2 space-y-6">
          {/* Section 1: Property Details */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building2 className="w-4 h-4 text-pink-400" />
              Property Dimensions & Condition
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Lot Area (sq ft)</label>
                <input
                  type="number"
                  name="LotArea"
                  value={formData.LotArea}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Living Area GrLivArea (sq ft)</label>
                <input
                  type="number"
                  name="GrLivArea"
                  value={formData.GrLivArea}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Basement Area TotalBsmtSF (sq ft)</label>
                <input
                  type="number"
                  name="TotalBsmtSF"
                  value={formData.TotalBsmtSF}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Year Built</label>
                <input
                  type="number"
                  name="YearBuilt"
                  value={formData.YearBuilt}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Overall Condition (1 - 10)</label>
                <input
                  type="number"
                  name="OverallCond"
                  min="1"
                  max="10"
                  value={formData.OverallCond}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Overall Quality (1 - 10)</label>
                <input
                  type="number"
                  name="OverallQual"
                  min="1"
                  max="10"
                  value={formData.OverallQual}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Classification & Zoning */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
              <MapPin className="w-4 h-4 text-purple-400" />
              Zoning, Configuration & Exterior
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">MS Zoning</label>
                <select
                  name="MSZoning"
                  value={formData.MSZoning}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="RL">RL - Residential Low Density</option>
                  <option value="RM">RM - Residential Medium Density</option>
                  <option value="C (all)">C - Commercial</option>
                  <option value="FV">FV - Floating Village</option>
                  <option value="RH">RH - Residential High Density</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Lot Configuration</label>
                <select
                  name="LotConfig"
                  value={formData.LotConfig}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="Inside">Inside Lot</option>
                  <option value="Corner">Corner Lot</option>
                  <option value="CulDSac">Cul-de-sac</option>
                  <option value="FR2">Frontage on 2 sides</option>
                  <option value="FR3">Frontage on 3 sides</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Building Type</label>
                <select
                  name="BldgType"
                  value={formData.BldgType}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="1Fam">Single-family Detached</option>
                  <option value="2fmCon">Two-family Conversion</option>
                  <option value="Duplex">Duplex</option>
                  <option value="TwnhsE">Townhouse End Unit</option>
                  <option value="Twnhs">Townhouse Inside Unit</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Exterior Material</label>
                <select
                  name="Exterior1st"
                  value={formData.Exterior1st}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="VinylSd">Vinyl Siding</option>
                  <option value="MetalSd">Metal Siding</option>
                  <option value="Wd Sdng">Wood Siding</option>
                  <option value="HdBoard">Hard Board</option>
                  <option value="BrkFace">Brick Face</option>
                </select>
              </div>
            </div>
          </div>

          {/* Model Selector & Action */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Select Regression Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
              >
                <option value="linear_regression">Linear Regression (Primary Baseline)</option>
                <option value="svr">Support Vector Regression (SVR)</option>
                <option value="random_forest">Random Forest Regression (Ensemble)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={predictMutation.isPending}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-pink-500/20 transition-all"
            >
              {predictMutation.isPending ? 'Calculating Estimation...' : 'PREDICT HOUSE PRICE'}
            </button>
          </div>
        </form>

        {/* Prediction Results Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Prediction Output
              </span>
              <Sparkles className="w-4 h-4 text-pink-400" />
            </div>

            {result ? (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <p className="text-xs text-slate-400">Estimated Property Value</p>
                  <p className="text-3xl font-black text-pink-400 mt-1">
                    ₹{result.prediction ? result.prediction.toLocaleString('en-IN') : result.predicted_price?.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Estimated value based on the trained machine-learning model.
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Model Used:</span>
                    <span className="text-slate-200 font-medium">{result.model || result.model_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model Version:</span>
                    <span className="text-slate-200 font-medium">{result.model_version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prediction ID:</span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {(result.prediction_id || result.id)?.slice(0, 13)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timestamp:</span>
                    <span className="text-slate-300">
                      {new Date(result.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-600">
                  <Building2 className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-400">
                  Submit the form to compute the estimated price using the trained regression model.
                </p>
              </div>
            )}
          </div>

          {/* Academic Notice */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400 space-y-2">
            <h4 className="font-semibold text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-pink-400" />
              Academic Model Insight
            </h4>
            <p className="text-[11px] leading-relaxed">
              Features are passed through a fitted <code className="text-slate-300">ColumnTransformer</code> pipeline that applies median imputation and standard scaling to numerical variables, and frequency imputation and one-hot encoding to categorical features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
