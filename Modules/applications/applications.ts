import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../lib/api-client';
import { Application, ApplicationDetail, ApplicationStatus, PaginatedResponse } from '../../lib/eyoot-types';

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

export const useApplications = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['applications', params],
    queryFn: () => applicationApi.list(params),
  });

export const useApplication = (id?: number) =>
  useQuery({
    queryKey: ['applications', id],
    queryFn: () => applicationApi.getById(id!),
    enabled: id !== undefined,
  });

export const useUpdateApplicationStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: applicationApi.updateStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      qc.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useBulkUpdateStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: applicationApi.bulkUpdateStatus,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
