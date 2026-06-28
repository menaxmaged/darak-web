import { api, apiFormData } from '../../lib/api-client';
import { withMock } from '@/lib/mocks/mock-config';
import { mockListingItem, mockListingsList, mockListingSuccess, mockUploadImages } from './mock';
import type { Listing, ListingInsert, ListingUpdate, ListingsFilters } from './types';

export const listingApi = {
  list: async (filters: ListingsFilters = {}) => {
      console.log('Fetching listings with filters:', filters);
      const response = await api.get<Listing[]>('/listings', { params: filters });
      return { data: response.data.data ?? [], meta: response.data.meta };
  },

  listMy: async (filters: ListingsFilters = {}) => {
      console.log('Fetching my listings with filters:', filters);
      const response = await api.get<Listing[]>('/listings/my', { params: filters });
      return { data: response.data.data ?? [], meta: response.data.meta };
  },

  // publicList: async (filters: ListingsFilters = {}) => {
  //   return withMock(async () => {
  //     const response = await api.get<Listing[]>('/listings', { params: filters });
  //     return { data: response.data.data ?? [], meta: response.data.meta };
  //   }, mockListingsList);
  // },

  get: async (id: string) => {
    return withMock(async () => {
      const response = await api.get<Listing>(`/listings/${id}`);
      return response.data;
    }, mockListingItem);
  },

  create: async ({ data, files }: { data: ListingInsert; files: File[] }) => {
    const form = new FormData();
    const append = (key: string, value: string | number | boolean | undefined | null) => {
      if (value !== undefined && value !== null) form.append(key, String(value));
    };
    append('property_status', data.property_status);
    append('property_type', data.property_type);
    append('city_id', data.city_id);
    append('price', data.price);
    append('built_up_area', data.built_up_area);
    append('bedrooms', data.bedrooms);
    append('bathrooms', data.bathrooms);
    append('area_id', data.area_id);
    append('project_id', data.project_id);
    append('title', data.title);
    append('description', data.description);
    append('address', data.address);
    append('finishing', data.finishing);
    append('delivery_year', data.delivery_year);
    append('down_payment_amount', data.down_payment_amount);
    append('installment_years', data.installment_years);
    append('video_url', data.video_url);
    append('tour_url', data.tour_url);
    append('contact_name', data.contact_name);
    append('contact_phone', data.contact_phone);
    append('contact_whatsapp', data.contact_whatsapp);
    append('is_cash_only', data.is_cash_only);
    append('land_area', data.land_area);
    append('floor', data.floor);
    append('view', data.view);
    files.forEach((f) => form.append('images', f));
    const response = await apiFormData.post('/admin/listings', form);
    return response.data;
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
