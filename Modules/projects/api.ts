import { api } from '../../lib/api-client';
import { withMock } from '@/lib/mocks/mock-config';
import { mockProjectItem, mockProjectsList, mockProjectSuccess } from './mock';
import type { Project, ProjectInsert, ProjectUpdate, ProjectsFilters } from './types';

export const projectApi = {
  list: async (filters: ProjectsFilters = {}) => {
    return withMock(async () => {
      const response = await api.get<Project[]>('/admin/projects', { params: filters });
      return { data: response.data.data ?? [], meta: response.data.meta };
    }, mockProjectsList);
  },

  get: async (id: string) => {
    return withMock(async () => {
      const response = await api.get<Project>(`/admin/projects/${id}`);
      return response.data;
    }, mockProjectItem);
  },

  create: async (data: ProjectInsert) => {
    return withMock(async () => {
      const response = await api.post('/admin/projects', data);
      return response.data;
    }, mockProjectSuccess);
  },

  update: async ({ id, data }: { id: string; data: ProjectUpdate }) => {
    return withMock(async () => {
      const response = await api.put(`/admin/projects/${id}`, data);
      return response.data;
    }, mockProjectSuccess);
  },

  delete: async (id: string) => {
    return withMock(async () => {
      const response = await api.delete(`/admin/projects/${id}`);
      return response.data;
    }, mockProjectSuccess);
  },
};
