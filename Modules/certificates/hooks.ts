import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { certificateApi } from './api';

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
