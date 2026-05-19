import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { cityApi } from './api';
import type { CitiesFilters } from './types';

export const useCitiesAdmin = (filters: CitiesFilters = {}) =>
  useQuery({ queryKey: ['citiesAdmin', filters], queryFn: () => cityApi.list(filters) });

export const useCity = (id: string | undefined) =>
  useQuery({
    queryKey: ['city', id],
    queryFn: () => cityApi.get(id!),
    enabled: !!id,
  });

export const useCreateCity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cityApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['citiesAdmin'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useUpdateCity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cityApi.update,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['citiesAdmin'] });
      qc.invalidateQueries({ queryKey: ['city', variables.id] });
    },
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useDeleteCity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cityApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['citiesAdmin'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
