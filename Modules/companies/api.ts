import { api } from '../../lib/api-client';
import { Company, CompanyDetail } from '../../lib/eyoot-types';
import { withMock } from '@/lib/mocks/mock-config';
import { mockCompaniesList, mockCompanyDetail, mockCompanySuccess } from './mock';

export const companyApi = {
  list: async (params?: Record<string, unknown>) => {
    return withMock(async () => {
      const response = await api.get<Company[]>('/admin/companies', { params });
      return { data: response.data.data ?? [], meta: response.data.meta };
    }, mockCompaniesList);
  },

  getById: async (id: number) => {
    return withMock(async () => {
      const response = await api.get<CompanyDetail>(`/admin/companies/${id}`);
      return (response.data.data ?? response.data) as CompanyDetail;
    }, mockCompanyDetail);
  },

  create: async (data: Partial<Company>) => {
    return withMock(async () => {
      const response = await api.post('/admin/companies', data);
      return response.data;
    }, mockCompanySuccess);
  },

  update: async ({ id, data }: { id: number; data: Partial<Company> }) => {
    return withMock(async () => {
      const response = await api.put(`/admin/companies/${id}`, data);
      return response.data;
    }, mockCompanySuccess);
  },

  delete: async (id: number) => {
    return withMock(async () => {
      const response = await api.delete(`/admin/companies/${id}`);
      return response.data;
    }, mockCompanySuccess);
  },
};
