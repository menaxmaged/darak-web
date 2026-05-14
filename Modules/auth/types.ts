import type { ApiResponse, User } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse extends ApiResponse {
  token: string;
  user: User;
}

export interface ResetPasswordRequest {
  email: string;
}
