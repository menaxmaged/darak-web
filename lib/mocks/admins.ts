import type { AdminUser } from '@/lib/eyoot-types';

export const mockAdmins: AdminUser[] = [
  {
    id: 1,
    name: 'Rana Abdel',
    email: 'rana.abdel@example.com',
    role: 'super-admin',
    status: 'active',
    lastActive: '2026-05-10T08:30:00Z',
    createdAt: '2025-11-01T10:00:00Z',
  },
  {
    id: 2,
    name: 'Hassan Youssef',
    email: 'hassan.youssef@example.com',
    role: 'applications-manager',
    status: 'active',
    lastActive: '2026-05-09T14:15:00Z',
    createdAt: '2025-12-12T09:00:00Z',
  },
];
