import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from './api';

export const useDashboardStats = () =>
  useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: analyticsApi.getDashboardStats,
    staleTime: 2 * 60 * 1000,
  });

export const useApplicationAnalytics = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['analytics', 'applications', params],
    queryFn: () => analyticsApi.getApplicationAnalytics(params),
  });

export const useStudentAnalytics = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['analytics', 'students', params],
    queryFn: () => analyticsApi.getStudentAnalytics(params),
  });

export const useContentAnalytics = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['analytics', 'content', params],
    queryFn: () => analyticsApi.getContentAnalytics(params),
  });
