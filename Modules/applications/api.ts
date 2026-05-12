import { api } from '../../lib/api-client';
import { Application, ApplicationDetail, ApplicationStatus } from '../../lib/eyoot-types';

export const applicationApi = {
  list: async (params?: Record<string, unknown>) => {
    const response = await api.get<Application[]>('/admin/applications', { params });
    return { data: response.data.data ?? [], meta: response.data.meta, pagination: response.data.pagination };
  },

  getById: async (id: number) => {
    const response = await api.get<ApplicationDetail>(`/admin/applications/${id}`);
    return (response.data.data ?? response.data) as ApplicationDetail;
  },

  updateStatus: async ({ id, status, note }: { id: number; status: ApplicationStatus; note?: string }) => {
    const response = await api.put(`/admin/applications/${id}/status`, { status, note });
    return response.data;
  },

  bulkUpdateStatus: async ({ ids, status }: { ids: number[]; status: ApplicationStatus }) => {
    const response = await api.post('/admin/applications/bulk-status', { ids, status });
    return response.data;
  },

  createInterviewSlot: async (applicationId: number, data: Record<string, unknown>) => {
    const response = await api.post(`/admin/applications/${applicationId}/interview`, data);
    return response.data;
  },

  uploadCertificate: async (applicationId: number, formData: FormData) => {
    const response = await api.post(`/admin/applications/${applicationId}/certificate`, formData);
    return response.data;
  },
};
