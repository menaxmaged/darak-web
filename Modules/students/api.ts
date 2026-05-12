import { api } from '../../lib/api-client';
import { Student, StudentDetail } from '../../lib/eyoot-types';
import { withMock } from '@/lib/mocks/mock-config';
import { mockStudentsList, mockStudentDetail, mockStudentSuccess } from './mock';

export const studentApi = {
  list: async (params?: Record<string, unknown>) => {
    return withMock(async () => {
      const response = await api.get<Student[]>('/admin/students', { params });
      return { data: response.data.data ?? [], meta: response.data.meta, pagination: response.data.pagination };
    }, mockStudentsList);
  },

  getById: async (id: number) => {
    return withMock(async () => {
      const response = await api.get<StudentDetail>(`/admin/students/${id}`);
      return (response.data.data ?? response.data) as StudentDetail;
    }, mockStudentDetail);
  },

  update: async ({ id, data }: { id: number; data: Partial<Student> }) => {
    return withMock(async () => {
      const response = await api.put(`/admin/students/${id}`, data);
      return response.data;
    }, mockStudentSuccess);
  },

  ban: async ({ id, isBanned }: { id: number; isBanned: boolean }) => {
    return withMock(async () => {
      const response = await api.put(`/admin/students/${id}/ban`, { isBanned });
      return response.data;
    }, mockStudentSuccess);
  },
};
