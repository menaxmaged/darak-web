import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { courseApi } from './api';

export const useCourses = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['courses', params], queryFn: () => courseApi.list(params) });

export const useCreateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: courseApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useUpdateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: courseApi.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
