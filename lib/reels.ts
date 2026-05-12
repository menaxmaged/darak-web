import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from './api-client';
import { Reel } from './eyoot-types';

export const reelApi = {
  list: async (params?: Record<string, unknown>) => {
    const response = await api.get<Reel[]>('/admin/reels', { params });
    return { data: response.data.data ?? [], meta: response.data.meta };
  },
  create: async (data: Partial<Reel>) => {
    const response = await api.post('/admin/reels', data);
    return response.data;
  },
  update: async ({ id, data }: { id: number; data: Partial<Reel> }) => {
    const response = await api.put(`/admin/reels/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/admin/reels/${id}`);
    return response.data;
  },
};

export const useReels = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['reels', params], queryFn: () => reelApi.list(params) });

export const useCreateReel = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reelApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reels'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useUpdateReel = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reelApi.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reels'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useDeleteReel = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reelApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reels'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
