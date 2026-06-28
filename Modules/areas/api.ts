import { api } from '../../lib/api-client';
import { withMock } from '@/lib/mocks/mock-config';
import { mockAreaItem, mockAreasList, mockAreaSuccess, mockCities } from './mock';
import type { Area, AreaInsert, AreaUpdate, AreasFilters } from './types';

export const areaApi = {
  list: async (filters: AreasFilters = {}) => {
    return withMock(async () => {
      const response = await api.get<Area[]>('/admin/areas', { params: filters });
      return { data: response.data.data ?? [], meta: response.data.meta };
    }, mockAreasList);
  },

  get: async (id: string) => {
    return withMock(async () => {
      const response = await api.get<Area>(`/admin/areas/${id}`);
      return response.data;
    }, mockAreaItem);
  },

  cities: async () => {
      const response = await api.get<string[]>('/admin/areas/cities');
      return response.data;
  },

  create: async (data: AreaInsert) => {
    return withMock(async () => {
      const response = await api.post('/admin/areas', data);
      return response.data;
    }, mockAreaSuccess);
  },

  update: async ({ id, data }: { id: string; data: AreaUpdate }) => {
    return withMock(async () => {
      const response = await api.put(`/admin/areas/${id}`, data);
      return response.data;
    }, mockAreaSuccess);
  },

  delete: async (id: string) => {
    return withMock(async () => {
      const response = await api.delete(`/admin/areas/${id}`);
      return response.data;
    }, mockAreaSuccess);
  },
};
