import api from './client';
import { FakeNewsMetrics, FakeNewsPrediction } from '../types';

export const fakeNewsApi = {
  getModels: async () => {
    const res = await api.get('/api/fake-news/models');
    return res.data;
  },

  getEvaluations: async (): Promise<{ models: FakeNewsMetrics[] }> => {
    const res = await api.get('/api/fake-news/models/evaluation');
    return res.data;
  },

  getConfusionMatrix: async (modelName: string) => {
    const res = await api.get(`/api/fake-news/models/${modelName}/confusion-matrix`);
    return res.data;
  },

  predict: async (data: { text: string; model: string }): Promise<FakeNewsPrediction> => {
    const res = await api.post('/api/fake-news/predict', data);
    return res.data;
  },

  getPredictions: async (limit: number = 50): Promise<FakeNewsPrediction[]> => {
    const res = await api.get(`/api/fake-news/predictions?limit=${limit}`);
    return res.data;
  },
};
