/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types';
import { getMockResponse } from '@/lib/mocks/mock-registry';

const buildMockResponse = <T>(
  url: string,
  data: ApiResponse<T>,
  config?: AxiosRequestConfig,
): AxiosResponse<ApiResponse<T>> => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: { ...(config ?? {}), url } as any,
});

const resolveMock = <T>(method: string, url: string, params?: unknown, data?: unknown): ApiResponse<T> => {
  const mock = getMockResponse({ method, url, params: params as Record<string, unknown>, data });
  return (mock ?? { success: true, data: null }) as ApiResponse<T>;
};

/** Always returns registry mock responses — use for tests or forced mock mode. */
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

  formData: {
    post: <T = any>(url: string, _formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
      Promise.resolve(buildMockResponse<T>(url, resolveMock<T>('POST', url), config)),

    put: <T = any>(url: string, _formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
      Promise.resolve(buildMockResponse<T>(url, resolveMock<T>('PUT', url), config)),
  },
};
