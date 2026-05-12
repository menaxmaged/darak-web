import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../lib/api-client';
import { Position } from '../../lib/eyoot-types';

export const positionApi = {
  list: async (params?: Record<string, unknown>) => {
    const response = await api.get<Position[]>('/admin/positions', { params });
    return { data: response.data.data ?? [], meta: response.data.meta };
  },

  getById: async (id: number) => {
    const response = await api.get<Position>(`/admin/positions/${id}`);
    return (response.data.data ?? response.data) as Position;
  },

  create: async (data: Partial<Position>) => {
    const response = await api.post('/admin/positions', data);
    return response.data;
  },

  update: async ({ id, data }: { id: number; data: Partial<Position> }) => {
    const response = await api.put(`/admin/positions/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/admin/positions/${id}`);
    return response.data;
  },
};

export const usePositions = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['positions', params],
    queryFn: () => positionApi.list(params),
  });

export const usePosition = (id?: number) =>
  useQuery({
    queryKey: ['positions', id],
    queryFn: () => positionApi.getById(id!),
    enabled: id !== undefined,
  });

export const useCreatePosition = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: positionApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['positions'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useUpdatePosition = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: positionApi.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['positions'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
