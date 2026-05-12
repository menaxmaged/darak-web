import type { NewsletterSubscriber } from '@/lib/types';
import { buildListResult } from '@/lib/mocks/mock-helpers';

const mockSubscribers: NewsletterSubscriber[] = [
  {
    id: 901,
    email: 'student1@example.com',
    status: 'active',
    subscribed_at: '2026-04-10T09:00:00Z',
  },
  {
    id: 902,
    email: 'student2@example.com',
    status: 'inactive',
    subscribed_at: '2026-03-22T12:00:00Z',
  },
];

export const mockNewsletterList = buildListResult(mockSubscribers, 1, 20);
