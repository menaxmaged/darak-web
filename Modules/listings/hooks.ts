import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { listingApi } from './api';
import type { ListingsFilters } from './types';

export const useListings = (filters: ListingsFilters = {}) =>
  useQuery({ queryKey: ['listings', filters], queryFn: () => listingApi.list(filters) });


export const useMyListings = (filters: ListingsFilters = {}) =>
  useQuery({ queryKey: ['myListings', filters], queryFn: () => listingApi.listMy(filters) }); 

export const usePublicListings = (filters: ListingsFilters = {}) =>
  useQuery({ queryKey: ['publicListings', filters], queryFn: () => listingApi.publicList(filters) });

export const useListing = (id: string | undefined) =>
  useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingApi.get(id!),
    enabled: !!id,
  });

export const useCreateListing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, files }: { data: Parameters<typeof listingApi.create>[0]['data']; files: File[] }) =>
      listingApi.create({ data, files }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['listings'] }),
    onError: (e) => console.error("Create listing error:", getErrorMessage(e)),
  });
};

export const useUpdateListing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: listingApi.update,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['listings'] });
      qc.invalidateQueries({ queryKey: ['listing', variables.id] });
    },
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useDeleteListing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: listingApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['listings'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useApproveListing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: listingApi.approve,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['listings'] });
      qc.invalidateQueries({ queryKey: ['listing', variables.id] });
    },
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useUploadListingImages = () =>
  useMutation({
    mutationFn: listingApi.uploadImages,
    onError: (e) => console.error(getErrorMessage(e)),
  });
