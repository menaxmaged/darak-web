import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../lib/api-client';
import { Student, StudentDetail, PaginatedResponse } from '../../lib/eyoot-types';

export const studentApi = {
  list: async (params?: Record<string, unknown>) => {
    const response = await api.get<PaginatedResponse<Student>>('/admin/students', { params });
    return { data: response.data.data ?? [], meta: response.data.meta, pagination: response.data.pagination };
  },

  getById: async (id: number) => {
    const response = await api.get<StudentDetail>(`/admin/students/${id}`);
    return (response.data.data ?? response.data) as StudentDetail;
  },

  update: async ({ id, data }: { id: number; data: Partial<Student> }) => {
    const response = await api.put(`/admin/students/${id}`, data);
    return response.data;
  },

  ban: async ({ id, isBanned }: { id: number; isBanned: boolean }) => {
    const response = await api.put(`/admin/students/${id}/ban`, { isBanned });
    return response.data;
  },
};

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
