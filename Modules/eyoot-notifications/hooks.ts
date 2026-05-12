import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { notificationApi } from './api';

export const useNotifications = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['notifications', params], queryFn: () => notificationApi.list(params) });

export const useSendNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.send,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
