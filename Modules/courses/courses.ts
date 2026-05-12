import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../lib/api-client';
import { Course } from '../../lib/eyoot-types';
import { withMock } from '@/lib/mocks/mock-config';
import { mockCoursesList, mockCourseSuccess } from './mock';

export const courseApi = {
  list: async (params?: Record<string, unknown>) => {
    return withMock(async () => {
      const response = await api.get<Course[]>('/admin/courses', { params });
      return { data: response.data.data ?? [], meta: response.data.meta };
    }, mockCoursesList);
  },
  create: async (data: Partial<Course>) => {
    return withMock(async () => {
      const response = await api.post('/admin/courses', data);
      return response.data;
    }, mockCourseSuccess);
  },
  update: async ({ id, data }: { id: number; data: Partial<Course> }) => {
    return withMock(async () => {
      const response = await api.put(`/admin/courses/${id}`, data);
      return response.data;
    }, mockCourseSuccess);
  },
  delete: async (id: number) => {
    return withMock(async () => {
      const response = await api.delete(`/admin/courses/${id}`);
      return response.data;
    }, mockCourseSuccess);
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
