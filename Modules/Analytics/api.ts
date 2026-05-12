import { api } from '../../lib/api-client';
import { DashboardStats } from '../../lib/eyoot-types';

export const analyticsApi = {
  getDashboardStats: async () => {
    const response = await api.get<DashboardStats>('/admin/analytics/dashboard');
    return (response.data.data ?? response.data) as DashboardStats;
  },
  getApplicationAnalytics: async (params?: Record<string, unknown>) => {
    const response = await api.get('/admin/analytics/applications', { params });
    return response.data.data ?? response.data;
  },
  getStudentAnalytics: async (params?: Record<string, unknown>) => {
    const response = await api.get('/admin/analytics/students', { params });
    return response.data.data ?? response.data;
  },
  getContentAnalytics: async (params?: Record<string, unknown>) => {
    const response = await api.get('/admin/analytics/content', { params });
    return response.data.data ?? response.data;
  },
};
