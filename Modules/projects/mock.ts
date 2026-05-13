import type { Project } from './types';
import { buildListResult, mockSuccess } from '@/lib/mocks/mock-helpers';

const mockProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'Midtown',
    city: 'Cairo',
    developer: 'Dara Development',
    description: 'Mixed-use development in New Cairo.',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'proj-002',
    name: 'Palm Hills',
    city: 'Giza',
    developer: 'Palm Hills Developments',
    description: 'Gated residential community in 6th of October.',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'proj-003',
    name: 'Marassi',
    city: 'Alexandria',
    developer: 'Emaar Misr',
    description: 'Beachfront resort-style community.',
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const mockProjectsList = buildListResult(mockProjects, 1, 20);
export const mockProjectItem = { success: true, data: mockProjects[0] };
export const mockProjectSuccess = mockSuccess('Project updated');
