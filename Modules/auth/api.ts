import { apiClient } from '../../lib/api-client';
import type { LoginCredentials, LoginResponse, ResetPasswordRequest } from './types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    countryCode?: string;
    dialCode?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female';
  }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },
};
