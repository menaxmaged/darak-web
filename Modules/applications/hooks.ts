import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { applicationApi } from './api';

export const useApplications = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['applications', params],
    queryFn: () => applicationApi.list(params),
  });

export const useApplication = (id?: number) =>
  useQuery({
    queryKey: ['applications', id],
    queryFn: () => applicationApi.getById(id!),
    enabled: id !== undefined,
  });

export const useUpdateApplicationStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: applicationApi.updateStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      qc.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useBulkUpdateStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: applicationApi.bulkUpdateStatus,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
