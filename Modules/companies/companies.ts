import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../lib/api-client';
import { Company, CompanyDetail } from '../../lib/eyoot-types';
import { withMock } from '@/lib/mocks/mock-config';
import {
  mockCompaniesList,
  mockCompanyDetail,
  mockCompanySuccess,
} from './mock';

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

export const useCompanies = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['companies', params],
    queryFn: () => companyApi.list(params),
  });

export const useCompany = (id?: number) =>
  useQuery({
    queryKey: ['companies', id],
    queryFn: () => companyApi.getById(id!),
    enabled: id !== undefined,
  });

export const useCreateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: companyApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useUpdateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: companyApi.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useDeleteCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: companyApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
