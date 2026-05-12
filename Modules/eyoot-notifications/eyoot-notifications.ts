import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../lib/api-client';
import { Notification } from '../../lib/eyoot-types';

export const notificationApi = {
  list: async (params?: Record<string, unknown>) => {
    const response = await api.get<Notification[]>('/admin/notifications', { params });
    return { data: response.data.data ?? [], meta: response.data.meta };
  },
  send: async (data: Partial<Notification>) => {
    const response = await api.post('/admin/notifications/send', data);
    return response.data;
  },
};

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
