/**
 * Global API Client - Base configuration
 * Used by all features
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types';
import { getMockResponse } from '@/lib/mocks/mock-registry';
import { isMockEnabled, shouldForceMock, isFallbackMock } from '@/lib/mocks/mock-config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

console.log('API Base URL:', API_BASE_URL);
console.log('API Key:', API_KEY); 
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
    }
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
// Check if we are already on the login page
        const isLoginPage = window.location.pathname === '/login';
      // Only redirect/refresh if we are NOT on the login page
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
  config: { ...(config ?? {}), url },
});

const handleMockRequest = async <T>(
  method: string,
  url: string,
  config: AxiosRequestConfig | undefined,
  data: unknown,
  request: () => Promise<AxiosResponse<ApiResponse<T>>>
): Promise<AxiosResponse<ApiResponse<T>>> => {
  const mock = isMockEnabled() ? getMockResponse({
    method,
    url,
    params: config?.params as Record<string, unknown> | undefined,
    data,
  }) : null;

  if (shouldForceMock() && mock) {
    return buildMockResponse(url, mock as ApiResponse<T>, config);
  }

  if (!shouldForceMock() && isFallbackMock()) {
    try {
      return await request();
    } catch (error) {
      if (mock) {
        return buildMockResponse(url, mock as ApiResponse<T>, config);
      }
      throw error;
    }
  }

  if (mock) {
    return buildMockResponse(url, mock as ApiResponse<T>, config);
  }

  return request();
};

export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    console.log('GET Request to:', url, 'with config:', config);
    return handleMockRequest('GET', url, config, undefined, () => apiClient.get(url, config));
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    console.log('POST Request to:', url, 'with data:', data);
    return handleMockRequest('POST', url, config, data, () => apiClient.post(url, data, config));
  },

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    console.log('PUT Request to:', url, 'with data:', data);
    return handleMockRequest('PUT', url, config, data, () => apiClient.put(url, data, config));
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    console.log('DELETE Request to:', url, 'with config:', config);
    return handleMockRequest('DELETE', url, config, undefined, () => apiClient.delete(url, config));
  },

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    console.log('PATCH Request to:', url, 'with data:', data);
    return handleMockRequest('PATCH', url, config, data, () => apiClient.patch(url, data, config));
  },
};

export const apiFormData = {
  post: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    handleMockRequest('POST', url, config, formData, () =>
      apiClient.post(url, formData, {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      })
    ),

  put: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    handleMockRequest('PUT', url, config, formData, () =>
      apiClient.put(url, formData, {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      })
    ),
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
