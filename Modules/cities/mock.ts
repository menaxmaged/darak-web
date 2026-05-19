import type { City } from './types';
import { buildListResult, mockSuccess } from '@/lib/mocks/mock-helpers';

const mockCities: City[] = [
  { id: 'city-001', name: 'Cairo', created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-002', name: 'Giza', created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-003', name: 'New Capital', created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-004', name: 'Alexandria', created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-005', name: 'North Coast', created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-006', name: 'Ain Sokhna', created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-007', name: 'Suez', created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-008', name: 'Red Sea', created_at: '2026-01-01T00:00:00Z' },
];

export const mockCitiesList = buildListResult(mockCities, 1, 20);
export const mockCityItem = { success: true, data: mockCities[0] };
export const mockCitySuccess = mockSuccess('City updated');
