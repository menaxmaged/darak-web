import { api } from '../../lib/api-client';
import { withMock } from '@/lib/mocks/mock-config';
import { mockCitiesList, mockCityItem, mockCitySuccess } from './mock';
import type { City, CityInsert, CityUpdate, CitiesFilters } from './types';

export const cityApi = {
  list: async (filters: CitiesFilters = {}) => {
    console.log('Fetching cities with filters:', filters);
      const response = await api.get<City[]>('/admin/cities', { params: filters });
      console.log('Received cities response:', response.data);
      return { data: response.data.data ?? [], meta: response.data.meta };
  },

  get: async (id: string) => {
    return withMock(async () => {
      const response = await api.get<City>(`/admin/cities/${id}`);
      return response.data;
    }, mockCityItem);
  },

  create: async (data: CityInsert) => {
    return withMock(async () => {
      const response = await api.post('/admin/cities', data);
      return response.data;
    }, mockCitySuccess);
  },

  update: async ({ id, data }: { id: string; data: CityUpdate }) => {
    return withMock(async () => {
      const response = await api.put(`/admin/cities/${id}`, data);
      return response.data;
    }, mockCitySuccess);
  },

  delete: async (id: string) => {
    return withMock(async () => {
      const response = await api.delete(`/admin/cities/${id}`);
      return response.data;
    }, mockCitySuccess);
  },
};
