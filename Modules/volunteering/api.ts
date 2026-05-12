import { api } from '../../lib/api-client';
import { VolunteeringOpportunity } from '../../lib/eyoot-types';
import { withMock } from '@/lib/mocks/mock-config';
import { mockVolunteeringList, mockVolunteeringSuccess } from './mock';

export const volunteeringApi = {
  list: async (params?: Record<string, unknown>) => {
    return withMock(async () => {
      const response = await api.get<VolunteeringOpportunity[]>('/admin/volunteering', { params });
      return { data: response.data.data ?? [], meta: response.data.meta };
    }, mockVolunteeringList);
  },
  create: async (data: Partial<VolunteeringOpportunity>) => {
    return withMock(async () => {
      const response = await api.post('/admin/volunteering', data);
      return response.data;
    }, mockVolunteeringSuccess);
  },
  update: async ({ id, data }: { id: number; data: Partial<VolunteeringOpportunity> }) => {
    return withMock(async () => {
      const response = await api.put(`/admin/volunteering/${id}`, data);
      return response.data;
    }, mockVolunteeringSuccess);
  },
  delete: async (id: number) => {
    return withMock(async () => {
      const response = await api.delete(`/admin/volunteering/${id}`);
      return response.data;
    }, mockVolunteeringSuccess);
  },
};
