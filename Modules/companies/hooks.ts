import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { companyApi } from './api';

export const useCompanies = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['companies', params],
    queryFn: () => companyApi.list(params),
  });

export const useCompany = (id?: number) =>
  useQuery({
    queryKey: ['companies', id],
    queryFn: () => companyApi.getById(id!),
    enabled: id !== undefined,
  });

export const useCreateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: companyApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useUpdateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: companyApi.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useDeleteCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: companyApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
