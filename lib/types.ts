import type { User } from '@/types';

export type { User };
export type UsersListResponse = User[];

export interface BanUserRequest {
  username: string;
  is_banned: boolean;
}

export interface EditRoleRequest {
  username: string;
  role: 'admin' | 'user';
}

export interface EditStatusRequest {
  username: string;
  status: 'active' | 'inactive';
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  dialCode: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  password: string;
}
