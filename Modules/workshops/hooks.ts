import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { workshopApi } from './api';

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
