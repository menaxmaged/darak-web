import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { contactApi } from './api';

export const useContacts = () =>
  useQuery({ queryKey: ['contacts'], queryFn: contactApi.list });

export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: contactApi.updateStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contacts'] }),
    onError: (error) => console.error('Update contact status error:', getErrorMessage(error)),
  });
};
