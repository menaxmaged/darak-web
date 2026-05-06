import { getErrorMessage } from './api-client';
import { ContactInquiry, UpdateContactStatusRequest } from './types';
import { useResource } from './hooks/useResource';

const useContactsResource = () =>
  useResource<ContactInquiry>('contacts', {
    endpoints: {
      list: '/contact/list',
      update: '/contact/update',
    },
    updateUsesIdPath: false,
  });

// Contact Hooks
export const useContacts = () => {
  const resource = useContactsResource();
  return resource.useList();
};

export const useUpdateContactStatus = () => {
  const resource = useContactsResource();
  const mutation = resource.useUpdate({
    onError: (error) => {
      console.error('Update contact status error:', getErrorMessage(error));
    },
  });
  return {
    ...mutation,
    mutate: (data: UpdateContactStatusRequest, options?: Parameters<typeof mutation.mutate>[1]) =>
      mutation.mutate({ data }, options),
    mutateAsync: (data: UpdateContactStatusRequest, options?: Parameters<typeof mutation.mutateAsync>[1]) =>
      mutation.mutateAsync({ data }, options),
  };
};
