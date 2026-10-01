import api from './client';
import { Dataset, DatasetDetail } from '../types';

export const datasetApi = {
  getAll: async (projectType?: string): Promise<Dataset[]> => {
    const url = projectType ? `/api/datasets?project_type=${projectType}` : '/api/datasets';
    const res = await api.get(url);
    return res.data;
  },

  getById: async (id: string): Promise<DatasetDetail> => {
    const res = await api.get(`/api/datasets/${id}`);
    return res.data;
  },

  upload: async (formData: FormData): Promise<Dataset> => {
    const res = await api.post('/api/datasets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
