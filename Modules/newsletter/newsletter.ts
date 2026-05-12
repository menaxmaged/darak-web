import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api-client';
import { NewsletterListResponse } from '../../lib/types';

// Newsletter API
export const newsletterApi = {
  listSubscribers: async () => {
    const response = await api.get<NewsletterListResponse>('/newsletter/list');
    return { data: response.data.data, meta: response.data.meta };
  },
};

// Newsletter Hooks
export const useNewsletterSubscribers = () => {
  return useQuery({
    queryKey: ['newsletter'],
    queryFn: newsletterApi.listSubscribers,
  });
};
