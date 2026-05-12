import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../lib/api-client';
import { Workshop } from '../../lib/eyoot-types';

export const workshopApi = {
  list: async (params?: Record<string, unknown>) => {
    const response = await api.get<Workshop[]>('/admin/workshops', { params });
    return { data: response.data.data ?? [], meta: response.data.meta };
  },
  create: async (data: Partial<Workshop>) => {
    const response = await api.post('/admin/workshops', data);
    return response.data;
  },
  update: async ({ id, data }: { id: number; data: Partial<Workshop> }) => {
    const response = await api.put(`/admin/workshops/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/admin/workshops/${id}`);
    return response.data;
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
