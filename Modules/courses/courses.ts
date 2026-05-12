import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../lib/api-client';
import { Course } from '../../lib/eyoot-types';

export const courseApi = {
  list: async (params?: Record<string, unknown>) => {
    const response = await api.get<Course[]>('/admin/courses', { params });
    return { data: response.data.data ?? [], meta: response.data.meta };
  },
  create: async (data: Partial<Course>) => {
    const response = await api.post('/admin/courses', data);
    return response.data;
  },
  update: async ({ id, data }: { id: number; data: Partial<Course> }) => {
    const response = await api.put(`/admin/courses/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/admin/courses/${id}`);
    return response.data;
  },
};

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
