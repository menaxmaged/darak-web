import { api } from '../../lib/api-client';
import { Reel } from '../../lib/eyoot-types';
import { withMock } from '@/lib/mocks/mock-config';
import { mockReelsList, mockReelSuccess } from '@/Modules/reels/mocks';

export const reelApi = {
  list: async (params?: Record<string, unknown>) => {
    return withMock(async () => {
      const response = await api.get<Reel[]>('/admin/reels', { params });
      return { data: response.data.data ?? [], meta: response.data.meta };
    }, mockReelsList);
  },
  create: async (data: Partial<Reel>) => {
    return withMock(async () => {
      const response = await api.post('/admin/reels', data);
      return response.data;
    }, mockReelSuccess);
  },
  update: async ({ id, data }: { id: number; data: Partial<Reel> }) => {
    return withMock(async () => {
      const response = await api.put(`/admin/reels/${id}`, data);
      return response.data;
    }, mockReelSuccess);
  },
  delete: async (id: number) => {
    return withMock(async () => {
      const response = await api.delete(`/admin/reels/${id}`);
      return response.data;
    }, mockReelSuccess);
  },
};
