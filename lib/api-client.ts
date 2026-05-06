/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// API Base Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://via-api.codexeg.net';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'c9faa4c8-b9b8-49b6-a706-831ebf82fdcd';
// API Response Types
export interface ApiResponse<T = any> {
  [x: string]: any;
  status: boolean;
  data?: T;
  meta?: any;
  message_en?: string;
  message_ar?: string;
  token?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Token Management
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

// Create Axios Instance
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,

    headers: {
      'Content-Type': 'application/json',
      'api-key': API_KEY || '',
    }
  });

  // Request Interceptor - Add JWT Token
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

  // Response Interceptor - Handle Errors
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        tokenManager.remove();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

// Helper for JSON Requests
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    console.log('GET Request to:', url, 'with config:', config);    
    return apiClient.get(url, config);
  },
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    console.log('POST Request to:', url, 'with data:', data);
    return apiClient.post(url, data, config);
  },
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    console.log('PUT Request to:', url, 'with data:', data);
    return apiClient.put(url, data, config);
  },
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    console.log('DELETE Request to:', url, 'with config:', config);
    return apiClient.delete(url, config);
  },
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    console.log('PATCH Request to:', url, 'with data:', data);
    return apiClient.patch(url, data, config);
  }
};

// Helper for FormData Requests (for image uploads)
export const apiFormData = {
  post: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    apiClient.post(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  put: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    apiClient.put(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    }),
};

// Extract error message from API response
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message_en) {
    return error.response.data.message_en;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
