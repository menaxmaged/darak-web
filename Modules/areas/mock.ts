import type { Area } from './types';
import { buildListResult, mockSuccess } from '@/lib/mocks/mock-helpers';

const mockAreas: Area[] = [
  { id: 'area-001', name: 'New Cairo', city: 'Cairo', created_at: '2026-01-01T00:00:00Z' },
  { id: 'area-002', name: 'Maadi', city: 'Cairo', created_at: '2026-01-01T00:00:00Z' },
  { id: 'area-003', name: 'Heliopolis', city: 'Cairo', created_at: '2026-01-01T00:00:00Z' },
  { id: 'area-004', name: '6th of October', city: 'Giza', created_at: '2026-01-01T00:00:00Z' },
  { id: 'area-005', name: 'Smouha', city: 'Alexandria', created_at: '2026-01-01T00:00:00Z' },
  { id: 'area-006', name: 'Sidi Bishr', city: 'Alexandria', created_at: '2026-01-01T00:00:00Z' },
];

export const mockAreasList = buildListResult(mockAreas, 1, 20);
export const mockAreaItem = { success: true, data: mockAreas[0] };
export const mockAreaSuccess = mockSuccess('Area updated');
export const mockCities = { success: true, data: [...new Set(mockAreas.map((a) => a.city))] };
