import type { Workshop } from '@/lib/eyoot-types';
import { buildListResult, mockSuccess } from '@/lib/mocks/mock-helpers';

const mockWorkshops: Workshop[] = [
  {
    id: 601,
    title: 'Interview Prep Lab',
    image: '',
    speaker: 'Maya Hassan',
    date: '2026-05-25',
    time: '16:00',
    capacity: 120,
    isUnlimited: false,
    location: 'Cairo Hub',
    type: 'physical',
    registrationLink: 'https://example.com/interview-prep',
    videoLink: '',
    category: 'Career',
    views: 2100,
    clicks: 620,
    registrations: 95,
    status: 'published',
    createdAt: '2026-04-10T09:00:00Z',
  },
  {
    id: 602,
    title: 'Remote Collaboration Basics',
    image: '',
    speaker: 'Omar Nasser',
    date: '2026-06-02',
    time: '18:30',
    capacity: 0,
    isUnlimited: true,
    location: 'Online',
    type: 'online',
    registrationLink: 'https://example.com/remote-collab',
    videoLink: '',
    category: 'Soft Skills',
    views: 1800,
    clicks: 420,
    registrations: 240,
    status: 'draft',
    createdAt: '2026-04-18T09:00:00Z',
  },
];

export const mockWorkshopsList = buildListResult(mockWorkshops, 1, 20);
export const mockWorkshopSuccess = mockSuccess('Workshop updated');
