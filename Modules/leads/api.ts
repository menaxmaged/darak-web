import { api } from '../../lib/api-client';
import { withMock } from '@/lib/mocks/mock-config';
import { mockLeadsList, mockLeadSuccess } from './mock';
import type { Lead, LeadInsert, LeadsFilters } from './types';

export const leadApi = {
  list: async (filters: LeadsFilters = {}) => {
    return withMock(async () => {
      const response = await api.get<Lead[]>('/admin/leads', { params: filters });
      return { data: response.data.data ?? [], meta: response.data.meta };
    }, mockLeadsList);
  },

  track: async (data: LeadInsert) => {
    return withMock(async () => {
      const response = await api.post('/leads', data);
      return response.data;
    }, mockLeadSuccess);
  },
};
