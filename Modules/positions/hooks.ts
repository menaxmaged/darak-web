import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { positionApi } from './api';

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
