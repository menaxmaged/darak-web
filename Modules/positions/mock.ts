import type { Position } from '@/lib/eyoot-types';
import { buildListResult, mockSuccess } from '@/lib/mocks/mock-helpers';

const mockPositions: Position[] = [
  {
    id: 14,
    companyId: 3,
    companyName: 'Orbit Labs',
    companyLogo: '',
    title: 'Frontend Intern',
    description: 'Work on UI components and design systems.',
    requirements: ['React basics', 'CSS fundamentals'],
    capacity: 12,
    usedCapacity: 9,
    remainingCapacity: 3,
    deadline: '2026-06-15',
    applicantsCount: 45,
    approvedCount: 9,
    pendingCount: 8,
    status: 'active',
    createdAt: '2026-03-20T09:00:00Z',
  },
  {
    id: 22,
    companyId: 7,
    companyName: 'Nimbus Tech',
    companyLogo: '',
    title: 'Data Intern',
    description: 'Assist with data analysis and reporting.',
    requirements: ['SQL basics', 'Excel'],
    capacity: 10,
    usedCapacity: 10,
    remainingCapacity: 0,
    deadline: '2026-06-10',
    applicantsCount: 38,
    approvedCount: 10,
    pendingCount: 3,
    status: 'full',
    createdAt: '2026-03-18T09:00:00Z',
  },
];

export const mockPositionsList = buildListResult(mockPositions, 1, 20);
export const mockPositionDetail = mockPositions[0];
export const mockPositionSuccess = mockSuccess('Position updated');
