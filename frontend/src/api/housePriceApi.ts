import api from './client';
import { HousePriceMetrics, HousePricePrediction } from '../types';

export const housePriceApi = {
  getModels: async () => {
    const res = await api.get('/api/house-price/models');
    return res.data;
  },

  getEvaluations: async (): Promise<{ models: HousePriceMetrics[] }> => {
    const res = await api.get('/api/house-price/models/evaluation');
    return res.data;
  },

  getActualVsPredicted: async (modelName: string) => {
    const res = await api.get(`/api/house-price/models/${modelName}/actual-vs-predicted`);
    return res.data;
  },

  predict: async (data: { model: string; features: Record<string, any> }): Promise<HousePricePrediction> => {
    const res = await api.post('/api/house-price/predict', data);
    return res.data;
  },

  getPredictions: async (limit: number = 50): Promise<HousePricePrediction[]> => {
    const res = await api.get(`/api/house-price/predictions?limit=${limit}`);
    return res.data;
  },
};
