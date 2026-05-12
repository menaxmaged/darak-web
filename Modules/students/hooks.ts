import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { studentApi } from './api';

export const useStudents = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['students', params],
    queryFn: () => studentApi.list(params),
  });

export const useStudent = (id?: number) =>
  useQuery({
    queryKey: ['students', id],
    queryFn: () => studentApi.getById(id!),
    enabled: id !== undefined,
  });

export const useBanStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studentApi.ban,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useUpdateStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studentApi.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
