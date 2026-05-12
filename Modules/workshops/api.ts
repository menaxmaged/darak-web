import { api } from '../../lib/api-client';
import { Workshop } from '../../lib/eyoot-types';
import { withMock } from '@/lib/mocks/mock-config';
import { mockWorkshopsList, mockWorkshopSuccess } from './mock';

export const workshopApi = {
  list: async (params?: Record<string, unknown>) => {
    return withMock(async () => {
      const response = await api.get<Workshop[]>('/admin/workshops', { params });
      return { data: response.data.data ?? [], meta: response.data.meta };
    }, mockWorkshopsList);
  },
  create: async (data: Partial<Workshop>) => {
    return withMock(async () => {
      const response = await api.post('/admin/workshops', data);
      return response.data;
    }, mockWorkshopSuccess);
  },
  update: async ({ id, data }: { id: number; data: Partial<Workshop> }) => {
    return withMock(async () => {
      const response = await api.put(`/admin/workshops/${id}`, data);
      return response.data;
    }, mockWorkshopSuccess);
  },
  delete: async (id: number) => {
    return withMock(async () => {
      const response = await api.delete(`/admin/workshops/${id}`);
      return response.data;
    }, mockWorkshopSuccess);
  },
};
