import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { reelApi } from './api';

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
