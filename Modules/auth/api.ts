import { apiClient, tokenManager } from '../../lib/api-client';
import { STORAGE_KEYS } from '../../lib/constants';
import type { LoginCredentials, LoginResponse, ResetPasswordRequest } from './types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    const payload = response.data;
    if (payload?.token) {
      tokenManager.set(payload.token);
    }
    if (payload?.user?.role) {
      authStorage.setRole(payload.user.role);
    }
    return payload;
  },

  register: async (data: { email: string; password: string; name: string }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  logout: () => {
    tokenManager.remove();
    authStorage.clearRole();
  },
};

export const authStorage = {
  getRole: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    }
    return null;
  },
  setRole: (role: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
    }
  },
  clearRole: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    }
  },
};

export const getStoredUserRole = () => authStorage.getRole();
