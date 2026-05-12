import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../lib/api-client';
import { Certificate } from '../../lib/eyoot-types';
import { withMock } from '@/lib/mocks/mock-config';
import { mockCertificatesList, mockCertificateSuccess } from './mock';

export const certificateApi = {
  list: async (params?: Record<string, unknown>) => {
    return withMock(async () => {
      const response = await api.get<Certificate[]>('/admin/certificates', { params });
      return { data: response.data.data ?? [], meta: response.data.meta };
    }, mockCertificatesList);
  },
  upload: async ({ applicationId, formData }: { applicationId: number; formData: FormData }) => {
    return withMock(async () => {
      const response = await api.post(`/admin/applications/${applicationId}/certificate`, formData);
      return response.data;
    }, mockCertificateSuccess);
  },
  resendNotification: async (id: number) => {
    return withMock(async () => {
      const response = await api.post(`/admin/certificates/${id}/notify`);
      return response.data;
    }, mockCertificateSuccess);
  },
  delete: async (id: number) => {
    return withMock(async () => {
      const response = await api.delete(`/admin/certificates/${id}`);
      return response.data;
    }, mockCertificateSuccess);
  },
};

export const useCertificates = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['certificates', params], queryFn: () => certificateApi.list(params) });

export const useUploadCertificate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: certificateApi.upload,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['certificates'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useResendCertificateNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: certificateApi.resendNotification,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['certificates'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
