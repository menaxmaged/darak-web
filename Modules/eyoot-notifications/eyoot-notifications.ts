import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../lib/api-client';
import { Notification } from '../../lib/eyoot-types';
import { withMock } from '@/lib/mocks/mock-config';
import { mockNotificationsList, mockNotificationSuccess } from './mock';

export const notificationApi = {
  list: async (params?: Record<string, unknown>) => {
    return withMock(async () => {
      const response = await api.get<Notification[]>('/admin/notifications', { params });
      return { data: response.data.data ?? [], meta: response.data.meta };
    }, mockNotificationsList);
  },
  send: async (data: Partial<Notification>) => {
    return withMock(async () => {
      const response = await api.post('/admin/notifications/send', data);
      return response.data;
    }, mockNotificationSuccess);
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
