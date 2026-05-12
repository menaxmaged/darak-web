import type { User } from '@/lib/types';
import { buildListResult, mockSuccess } from '@/lib/mocks/mock-helpers';

const mockUsers: User[] = [
  {
    id: 1,
    username: 'sara_m',
    firstName: 'Sara',
    lastName: 'Mahmoud',
    email: 'sara.mahmoud@example.com',
    countryCode: 'EG',
    dialCode: '+20',
    phone: '1001234567',
    dateOfBirth: '2002-09-12',
    gender: 'female',
    role: 'admin',
    image: null,
    status: 'active',
    isBanned: false,
    registrationFeePaid: true,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-05-06T09:00:00Z',
  },
  {
    id: 2,
    username: 'omar_ali',
    firstName: 'Omar',
    lastName: 'Ali',
    email: 'omar.ali@example.com',
    countryCode: 'EG',
    dialCode: '+20',
    phone: '1115550000',
    dateOfBirth: '2001-01-05',
    gender: 'male',
    role: 'user',
    image: null,
    status: 'inactive',
    isBanned: false,
    registrationFeePaid: false,
    createdAt: '2026-01-15T11:00:00Z',
    updatedAt: '2026-05-02T11:00:00Z',
  },
];

export const mockUsersList = buildListResult(mockUsers, 1, 20);
export const mockUserDetail = mockUsers[0];
export const mockUserSuccess = mockSuccess('User updated');
