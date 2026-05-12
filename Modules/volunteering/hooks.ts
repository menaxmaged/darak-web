import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { volunteeringApi } from './api';

export const useVolunteering = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['volunteering', params], queryFn: () => volunteeringApi.list(params) });

export const useCreateVolunteering = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: volunteeringApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['volunteering'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useUpdateVolunteering = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: volunteeringApi.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['volunteering'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
