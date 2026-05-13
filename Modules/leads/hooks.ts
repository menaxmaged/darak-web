import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { leadApi } from './api';
import type { LeadsFilters } from './types';

export const useLeads = (filters: LeadsFilters = {}) =>
  useQuery({ queryKey: ['leads', filters], queryFn: () => leadApi.list(filters) });

export const useTrackLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: leadApi.track,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
    onError: (e) => console.error(getErrorMessage(e)),
  });
};
