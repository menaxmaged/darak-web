import { getErrorMessage } from '../../lib/api-client';
import { ContactInquiry, UpdateContactStatusRequest } from '../../lib/types';
import { useResource } from '../../lib/hooks/useResource';
import { isMockEnabled } from '@/lib/mocks/mock-config';
import { mockContactsList, mockContactsSuccess } from './mock';
import { useMutation } from '@tanstack/react-query';

const useContactsResource = () =>
  useResource<ContactInquiry>('contacts', {
    endpoints: {
      list: '/contact/list',
      update: '/contact/update',
    },
    mockListResult: mockContactsList,
    updateUsesIdPath: false,
  });

// Contact Hooks
export const useContacts = () => {
  const resource = useContactsResource();
  return resource.useList();
};

export const useUpdateContactStatus = () => {
  const resource = useContactsResource();
  const mockEnabled = isMockEnabled();
  const mutation = resource.useUpdate({
    onError: (error) => {
      console.error('Update contact status error:', getErrorMessage(error));
    },
  });
  const mockMutation = useMutation({
    mutationFn: async ({ data }: { data: UpdateContactStatusRequest }) => {
      void data;
      return mockContactsSuccess;
    },
  });
  const activeMutation = mockEnabled ? mockMutation : mutation;
  return {
    ...activeMutation,
    mutate: (data: UpdateContactStatusRequest, options?: Parameters<typeof mutation.mutate>[1]) =>
      activeMutation.mutate({ data }, options),
    mutateAsync: (data: UpdateContactStatusRequest, options?: Parameters<typeof mutation.mutateAsync>[1]) =>
      activeMutation.mutateAsync({ data }, options),
  };
};
