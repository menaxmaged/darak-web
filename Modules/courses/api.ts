import { api } from '../../lib/api-client';
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
