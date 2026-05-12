import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../lib/api-client';
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

export const useWorkshops = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['workshops', params], queryFn: () => workshopApi.list(params) });

export const useCreateWorkshop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: workshopApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workshops'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useUpdateWorkshop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: workshopApi.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workshops'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useDeleteWorkshop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: workshopApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workshops'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
