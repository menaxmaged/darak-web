import type { VolunteeringOpportunity } from '@/lib/eyoot-types';
import { buildListResult, mockSuccess } from '@/lib/mocks/mock-helpers';

const mockVolunteering: VolunteeringOpportunity[] = [
  {
    id: 801,
    title: 'Community Tech Support',
    organization: 'Cairo Youth Hub',
    description: 'Help students with basic digital literacy.',
    location: 'Cairo',
    date: '2026-06-05',
    requiredHours: 12,
    capacity: 40,
    isUnlimited: false,
    skillsNeeded: ['Communication', 'Patience'],
    applicantsCount: 56,
    approvedCount: 30,
    completedCount: 12,
    status: 'active',
    createdAt: '2026-04-11T09:00:00Z',
  },
  {
    id: 802,
    title: 'Online Mentorship',
    organization: 'Eyoot Mentors',
    description: 'Guide junior students through portfolio reviews.',
    location: 'Online',
    date: '2026-06-12',
    requiredHours: 8,
    capacity: 0,
    isUnlimited: true,
    skillsNeeded: ['Mentoring'],
    applicantsCount: 32,
    approvedCount: 20,
    completedCount: 5,
    status: 'active',
    createdAt: '2026-04-20T09:00:00Z',
  },
];

export const mockVolunteeringList = buildListResult(mockVolunteering, 1, 20);
export const mockVolunteeringSuccess = mockSuccess('Opportunity updated');
