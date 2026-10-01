import api from './client';
import { TrainingRun } from '../types';

export const trainingApi = {
  startTraining: async (data: {
    project_type: 'HOUSE_PRICE' | 'FAKE_NEWS';
    dataset_id?: string;
    test_size?: number;
    random_state?: number;
  }): Promise<TrainingRun[]> => {
    const res = await api.post('/api/training/start', data);
    return res.data;
  },

  getRuns: async (projectType?: string): Promise<TrainingRun[]> => {
    const url = projectType ? `/api/training?project_type=${projectType}` : '/api/training';
    const res = await api.get(url);
    return res.data;
  },

  getModels: async (projectType?: string) => {
    const url = projectType ? `/api/training/models?project_type=${projectType}` : '/api/training/models';
    const res = await api.get(url);
    return res.data;
  },
};
