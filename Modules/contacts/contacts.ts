import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../lib/api-client';
import { ContactInquiry, UpdateContactStatusRequest } from '../../lib/types';
import { withMock } from '@/lib/mocks/mock-config';
import { mockContactsList, mockContactsSuccess } from './mock';

const contactApi = {
  list: async () => {
    return withMock(async () => {
      const response = await api.get<ContactInquiry[]>('/contact/list');
      return { data: response.data.data ?? [], meta: response.data.meta };
    }, mockContactsList);
  },

  updateStatus: async (data: UpdateContactStatusRequest) => {
    return withMock(async () => {
      const response = await api.put('/contact/update', data);
      return response.data;
    }, mockContactsSuccess);
  },
};

export const useContacts = () =>
  useQuery({ queryKey: ['contacts'], queryFn: contactApi.list });

export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: contactApi.updateStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contacts'] }),
    onError: (error) => console.error('Update contact status error:', getErrorMessage(error)),
  });
};
