import { api } from '../../lib/api-client';
import { Position } from '../../lib/eyoot-types';
import { withMock } from '@/lib/mocks/mock-config';
import { mockPositionsList, mockPositionDetail, mockPositionSuccess } from './mock';

export const positionApi = {
  list: async (params?: Record<string, unknown>) => {
    return withMock(async () => {
      const response = await api.get<Position[]>('/admin/positions', { params });
      return { data: response.data.data ?? [], meta: response.data.meta };
    }, mockPositionsList);
  },

  getById: async (id: number) => {
    return withMock(async () => {
      const response = await api.get<Position>(`/admin/positions/${id}`);
      return (response.data.data ?? response.data) as Position;
    }, mockPositionDetail);
  },

  create: async (data: Partial<Position>) => {
    return withMock(async () => {
      const response = await api.post('/admin/positions', data);
      return response.data;
    }, mockPositionSuccess);
  },

  update: async ({ id, data }: { id: number; data: Partial<Position> }) => {
    return withMock(async () => {
      const response = await api.put(`/admin/positions/${id}`, data);
      return response.data;
    }, mockPositionSuccess);
  },

  delete: async (id: number) => {
    return withMock(async () => {
      const response = await api.delete(`/admin/positions/${id}`);
      return response.data;
    }, mockPositionSuccess);
  },
};
