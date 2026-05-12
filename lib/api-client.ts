/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types';
import { getMockResponse } from '@/lib/mocks/mock-registry';
import { shouldForceMock, isFallbackMock } from '@/lib/mocks/mock-config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const TOKEN_KEY = 'token';

export const tokenManager = {
  get: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  set: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  remove: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },
};

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'api-key': API_KEY || '',
    },
  });

  client.interceptors.request.use(
    (config) => {
      const token = tokenManager.get();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        tokenManager.remove();
        if (typeof window !== 'undefined') {
          const isLoginPage = window.location.pathname === '/login';
          if (!isLoginPage) {
            window.location.href = '/login';
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

const buildMockResponse = <T>(
  url: string,
  data: ApiResponse<T>,
  config?: AxiosRequestConfig
): AxiosResponse<ApiResponse<T>> => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: { ...(config ?? {}), url } as any,
});

const resolveMock = <T>(method: string, url: string, params?: unknown, data?: unknown) => {
  const mock = getMockResponse({ method, url, params: params as Record<string, unknown>, data });
  return (mock ?? { success: true, data: null }) as ApiResponse<T>;
};

/**
 * Unified API client.
 * - NEXT_PUBLIC_USE_MOCKS=true   → always returns mock data from the registry
 * - NEXT_PUBLIC_USE_MOCKS=fallback → tries real API, falls back to mock on error
 * - unset                        → always hits the real API
 */
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    if (shouldForceMock()) return Promise.resolve(buildMockResponse<T>(url, resolveMock<T>('GET', url, config?.params), config));
    if (isFallbackMock()) return apiClient.get<ApiResponse<T>>(url, config).catch(() => buildMockResponse<T>(url, resolveMock<T>('GET', url, config?.params), config));
    return apiClient.get<ApiResponse<T>>(url, config);
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    if (shouldForceMock()) return Promise.resolve(buildMockResponse<T>(url, resolveMock<T>('POST', url, undefined, data), config));
    if (isFallbackMock()) return apiClient.post<ApiResponse<T>>(url, data, config).catch(() => buildMockResponse<T>(url, resolveMock<T>('POST', url, undefined, data), config));
    return apiClient.post<ApiResponse<T>>(url, data, config);
  },

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    if (shouldForceMock()) return Promise.resolve(buildMockResponse<T>(url, resolveMock<T>('PUT', url, undefined, data), config));
    if (isFallbackMock()) return apiClient.put<ApiResponse<T>>(url, data, config).catch(() => buildMockResponse<T>(url, resolveMock<T>('PUT', url, undefined, data), config));
    return apiClient.put<ApiResponse<T>>(url, data, config);
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    if (shouldForceMock()) return Promise.resolve(buildMockResponse<T>(url, resolveMock<T>('DELETE', url), config));
    if (isFallbackMock()) return apiClient.delete<ApiResponse<T>>(url, config).catch(() => buildMockResponse<T>(url, resolveMock<T>('DELETE', url), config));
    return apiClient.delete<ApiResponse<T>>(url, config);
  },

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    if (shouldForceMock()) return Promise.resolve(buildMockResponse<T>(url, resolveMock<T>('PATCH', url, undefined, data), config));
    if (isFallbackMock()) return apiClient.patch<ApiResponse<T>>(url, data, config).catch(() => buildMockResponse<T>(url, resolveMock<T>('PATCH', url, undefined, data), config));
    return apiClient.patch<ApiResponse<T>>(url, data, config);
  },
};

/** Mock-only client — always returns registry responses regardless of env. */
export const mockApi = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    Promise.resolve(buildMockResponse<T>(url, resolveMock<T>('GET', url, config?.params), config)),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    Promise.resolve(buildMockResponse<T>(url, resolveMock<T>('POST', url, undefined, data), config)),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    Promise.resolve(buildMockResponse<T>(url, resolveMock<T>('PUT', url, undefined, data), config)),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    Promise.resolve(buildMockResponse<T>(url, resolveMock<T>('DELETE', url), config)),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    Promise.resolve(buildMockResponse<T>(url, resolveMock<T>('PATCH', url, undefined, data), config)),
};

export const apiFormData = {
  post: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    if (shouldForceMock()) return Promise.resolve(buildMockResponse<T>(url, resolveMock<T>('POST', url), config));
    return apiClient.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: { ...config?.headers, 'Content-Type': 'multipart/form-data' },
    });
  },

  put: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    if (shouldForceMock()) return Promise.resolve(buildMockResponse<T>(url, resolveMock<T>('PUT', url), config));
    return apiClient.put<ApiResponse<T>>(url, formData, {
      ...config,
      headers: { ...config?.headers, 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message_en) {
    return error.response.data.message_en;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
