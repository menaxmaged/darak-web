import { api } from '../../lib/api-client';
import { ContactInquiry, UpdateContactStatusRequest } from '../../lib/types';
import { withMock } from '@/lib/mocks/mock-config';
import { mockContactsList, mockContactsSuccess } from './mock';

export const contactApi = {
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
