import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { areaApi } from './api';
import type { AreasFilters } from './types';

export const useAreas = (filters: AreasFilters = {}) =>
  useQuery({ queryKey: ['areas', filters], queryFn: () => areaApi.list(filters) });

export const useArea = (id: string | undefined) =>
  useQuery({
    queryKey: ['area', id],
    queryFn: () => areaApi.get(id!),
    enabled: !!id,
  });

export const useCities = () =>
  useQuery({ queryKey: ['cities'], queryFn: () => areaApi.cities() });

export const useCreateArea = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: areaApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['areas'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useUpdateArea = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: areaApi.update,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['areas'] });
      qc.invalidateQueries({ queryKey: ['area', variables.id] });
    },
    onError: (e) => console.error(getErrorMessage(e)),
  });
};

export const useDeleteArea = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: areaApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['areas'] });
      qc.invalidateQueries({ queryKey: ['cities'] });
    },
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
