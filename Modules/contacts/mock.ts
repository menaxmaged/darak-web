import type { ContactInquiry } from '@/lib/types';
import { buildListResult, mockSuccess } from '@/lib/mocks/mock-helpers';

const mockContacts: ContactInquiry[] = [
  {
    id: 1001,
    firstName: 'Layla',
    lastName: 'Hassan',
    email: 'layla.hassan@example.com',
    phone: '+20 109 999 0000',
    message: 'I need help updating my application status.',
    status: 'pending',
    created_at: '2026-05-06T09:00:00Z',
    updated_at: '2026-05-06T09:00:00Z',
  },
  {
    id: 1002,
    firstName: 'Karim',
    lastName: 'Nagy',
    email: 'karim.nagy@example.com',
    phone: '+20 106 888 1111',
    message: 'Can I reschedule my interview?',
    status: 'reviewed',
    created_at: '2026-05-05T08:30:00Z',
    updated_at: '2026-05-07T11:00:00Z',
  },
];

export const mockContactsList = buildListResult(mockContacts, 1, 20);
export const mockContactsSuccess = mockSuccess('Inquiry updated');
