import { api, apiFormData } from '../../lib/api-client';
import { withMock } from '@/lib/mocks/mock-config';
import { mockListingItem, mockListingsList, mockListingSuccess, mockUploadImages } from './mock';
import type { Listing, ListingInsert, ListingUpdate, ListingsFilters } from './types';

export const listingApi = {
  list: async (filters: ListingsFilters = {}) => {
    return withMock(async () => {
      const response = await api.get<Listing[]>('/admin/listings', { params: filters });
      console.log('API response for listings list:', response.data);
      console.log('API response meta:', response.data.meta);
      console.log('API response data:', response.data.data);
      return { data: response.data.data ?? [], meta: response.data.meta };
    }, mockListingsList);
  },

  get: async (id: string) => {
    return withMock(async () => {
      const response = await api.get<Listing>(`/admin/listings/${id}`);
      return response.data;
    }, mockListingItem);
  },

  create: async ({ data, files }: { data: ListingInsert; files: File[] }) => {
    return withMock(async () => {
      const form = new FormData();
      const append = (key: string, value: string | number | boolean | undefined | null) => {
        if (value !== undefined && value !== null) form.append(key, String(value));
      };
      append('property_status', data.property_status);
      append('property_type', data.property_type);
      append('city', data.city);
      append('price', data.price);
      append('built_up_area', data.built_up_area);
      append('bedrooms', data.bedrooms);
      append('bathrooms', data.bathrooms);
      append('area_id', data.area_id);
      append('project_id', data.project_id);
      append('title', data.title);
      append('description', data.description);
      append('finishing', data.finishing);
      append('delivery_year', data.delivery_year);
      append('down_payment_percentage', data.down_payment_percentage);
      append('installment_years', data.installment_years);
      if (data.is_cash_only !== undefined) form.append('is_cash_only', String(data.is_cash_only));
      files.forEach((f) => form.append('images', f));
      const response = await apiFormData.postAuto('/admin/listings', form);
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

  approve: async ({ id, approved, comment }: { id: number; approved: boolean; comment?: string }) => {
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
