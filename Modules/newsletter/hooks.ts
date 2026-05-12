import { useQuery } from '@tanstack/react-query';
import { newsletterApi } from './api';

export const useNewsletterSubscribers = () => {
  return useQuery({
    queryKey: ['newsletter'],
    queryFn: newsletterApi.listSubscribers,
  });
};
