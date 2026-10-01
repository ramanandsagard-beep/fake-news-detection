import api from './client';

export const analysisApi = {
  // Summary
  getSummary: async () => {
    const res = await api.get('/api/analysis/summary');
    return res.data;
  },

  // House Price — Dataset Exploration
  getHpDatasetOverview: async () => {
    const res = await api.get('/api/analysis/house-price/dataset-overview');
    return res.data;
  },
  getHpSalePriceDistribution: async (bins = 20) => {
    const res = await api.get(`/api/analysis/house-price/sale-price-distribution?bins=${bins}`);
    return res.data;
  },
  getHpFeatureCorrelation: async (topN = 12) => {
    const res = await api.get(`/api/analysis/house-price/feature-correlation?top_n=${topN}`);
    return res.data;
  },
  getHpFeatureVsPrice: async (feature: string) => {
    const res = await api.get(`/api/analysis/house-price/feature-vs-price?feature=${feature}`);
    return res.data;
  },

  // House Price — Model Output
  getHpResiduals: async (model: string) => {
    const res = await api.get(`/api/analysis/house-price/residuals/${model}`);
    return res.data;
  },
  getHpErrorDistribution: async (model: string) => {
    const res = await api.get(`/api/analysis/house-price/error-distribution/${model}`);
    return res.data;
  },
  getHpAllActualVsPredicted: async () => {
    const res = await api.get('/api/analysis/house-price/all-models-actual-vs-predicted');
    return res.data;
  },
  getHpModelComparison: async () => {
    const res = await api.get('/api/analysis/house-price/model-comparison');
    return res.data;
  },

  // Fake News — Dataset Exploration
  getFnDatasetOverview: async () => {
    const res = await api.get('/api/analysis/fake-news/dataset-overview');
    return res.data;
  },
  getFnClassDistribution: async () => {
    const res = await api.get('/api/analysis/fake-news/class-distribution');
    return res.data;
  },
  getFnTextLengthDistribution: async () => {
    const res = await api.get('/api/analysis/fake-news/text-length-distribution');
    return res.data;
  },

  // Fake News — Model Output
  getFnAllConfusionMatrices: async () => {
    const res = await api.get('/api/analysis/fake-news/all-confusion-matrices');
    return res.data;
  },
  getFnModelComparison: async () => {
    const res = await api.get('/api/analysis/fake-news/model-comparison');
    return res.data;
  },
};
