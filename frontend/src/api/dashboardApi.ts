import api from './client';
import { DashboardSummary } from '../types';

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get('/api/dashboard/summary');
    return response.data;
  },
};
