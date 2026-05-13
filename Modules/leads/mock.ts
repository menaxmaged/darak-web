import type { Lead } from './types';
import { buildListResult, mockSuccess } from '@/lib/mocks/mock-helpers';

const mockLeads: Lead[] = [
  {
    id: 'lead-001',
    listing_id: 'listing-001',
    advertiser_id: 'adv-001',
    contact_type: 'call',
    created_at: '2026-05-01T10:00:00Z',
  },
  {
    id: 'lead-002',
    listing_id: 'listing-001',
    advertiser_id: 'adv-001',
    contact_type: 'whatsapp',
    created_at: '2026-05-02T12:00:00Z',
  },
  {
    id: 'lead-003',
    listing_id: 'listing-002',
    advertiser_id: 'adv-002',
    contact_type: 'call',
    created_at: '2026-05-03T09:00:00Z',
  },
];

export const mockLeadsList = buildListResult(mockLeads, 1, 20);
export const mockLeadSuccess = mockSuccess('Lead tracked');
