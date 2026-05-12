import { useMutation } from '@tanstack/react-query';
import { api, tokenManager, getErrorMessage } from '../../lib/api-client';
import type { ApiResponse } from '@/types';
import { STORAGE_KEYS } from '../../lib/constants';
import { 
  LoginCredentials, 
  LoginResponse, 
  ResetPasswordRequest 
} from '../../lib/types';

// Auth API Endpoints
export const authApi = {
    login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
        console.log('Logging in with credentials:', credentials);
        const response = await api.post<LoginResponse>('/auth/login', credentials);
        const payload = response.data?.data;
        if (payload?.token) {
          tokenManager.set(payload.token);
        }
        if (payload?.user?.role) {
          authStorage.setRole(payload.user.role);
        } else if (response.status === 403) {
          console.error('Login failed: Invalid credentials');
        }

        return response.data;
    },

    resetPassword: async (data: ResetPasswordRequest) => {
        const response = await api.post('/auth/reset-password', data);
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

// Auth Hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onError: (error) => {
        console.log('Login error encountered:',error);
      console.error('Login error:', getErrorMessage(error));
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onError: (error) => {
      console.error('Reset password error:', getErrorMessage(error));
    },
  });
};
