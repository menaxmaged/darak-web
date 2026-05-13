import { api, apiFormData } from '../../lib/api-client';
import { withMock } from '@/lib/mocks/mock-config';
import { mockListingItem, mockListingsList, mockListingSuccess, mockUploadImages } from './mock';
import type { Listing, ListingInsert, ListingUpdate, ListingsFilters } from './types';

export const listingApi = {
  list: async (filters: ListingsFilters = {}) => {
    return withMock(async () => {
      const response = await api.get<Listing[]>('/admin/listings', { params: filters });
      return { data: response.data.data ?? [], meta: response.data.meta };
    }, mockListingsList);
  },

  get: async (id: string) => {
    return withMock(async () => {
      const response = await api.get<Listing>(`/admin/listings/${id}`);
      return response.data;
    }, mockListingItem);
  },

  create: async (data: ListingInsert) => {
    return withMock(async () => {
      const response = await api.post('/admin/listings', data);
      return response.data;
    }, mockListingSuccess);
  },

  update: async ({ id, data }: { id: string; data: ListingUpdate }) => {
    return withMock(async () => {
      const response = await api.put(`/admin/listings/${id}`, data);
      return response.data;
    }, mockListingSuccess);
  },

  delete: async (id: string) => {
    return withMock(async () => {
      const response = await api.delete(`/admin/listings/${id}`);
      return response.data;
    }, mockListingSuccess);
  },

  approve: async ({ id, approved, comment }: { id: string; approved: boolean; comment?: string }) => {
    return withMock(async () => {
      const response = await api.put(`/admin/listings/${id}/approve`, { approved, comment });
      return response.data;
    }, mockListingSuccess);
  },

  uploadImages: async (files: File[]) => {
    return withMock(async () => {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      const response = await apiFormData.post<string[]>('/listings/images/upload', formData);
      return response.data.data ?? [];
    }, mockUploadImages.data);
  },
};
