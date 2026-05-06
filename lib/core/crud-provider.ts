import { api } from '@/lib/api-client';

export type CrudListResult<T> = {
  data: T[];
  meta?: unknown;
  pagination?: unknown;
};

type CrudTransform<T> = (response: any) => T;

export type CrudRequestOptions<T> = {
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  data?: unknown;
  params?: Record<string, unknown>;
  transform?: CrudTransform<T>;
};

const normalizeEndpoint = (endpoint: string) =>
  endpoint.length > 1 && endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

const resolveEndpoint = (endpoint: string, id?: string | number) => {
  const normalized = normalizeEndpoint(endpoint);
  if (id === undefined || id === null) {
    return normalized;
  }
  if (normalized.includes(':id')) {
    return normalized.replace(':id', encodeURIComponent(String(id)));
  }
  return `${normalized}/${encodeURIComponent(String(id))}`;
};

const defaultListTransform = <T>(response: any): CrudListResult<T> => {
  const payload = response?.data ?? {};
  const data = (payload.data ?? payload.items ?? payload) as T[];
  return {
    data: Array.isArray(data) ? data : [],
    meta: payload.meta,
    pagination: payload.pagination,
  };
};

const defaultDetailTransform = <T>(response: any): T => {
  const payload = response?.data ?? {};
  return (payload.data ?? payload.item ?? payload) as T;
};

const request = async <T>(endpoint: string, options: CrudRequestOptions<T> = {}) => {
  const method = options.method ?? 'get';
  if (method === 'get') {
    const response = await api.get(endpoint, options.params ? { params: options.params } : undefined);
    return (options.transform ?? (defaultDetailTransform as CrudTransform<T>))(response);
  }
  if (method === 'delete') {
    const response = await api.delete(endpoint, options.params ? { params: options.params } : undefined);
    return (options.transform ?? (defaultDetailTransform as CrudTransform<T>))(response);
  }
  const response = await api[method](endpoint, options.data, options.params ? { params: options.params } : undefined);
  return (options.transform ?? (defaultDetailTransform as CrudTransform<T>))(response);
};

export const crudProvider = {
  getAll: async <T>(endpoint: string, options: CrudRequestOptions<CrudListResult<T>> = {}) => {
    if (options.method && options.method !== 'get') {
      return request<CrudListResult<T>>(resolveEndpoint(endpoint), {
        ...options,
        method: options.method,
        transform: options.transform ?? (defaultListTransform as CrudTransform<CrudListResult<T>>),
      });
    }
    const response = await api.get(endpoint, options.params ? { params: options.params } : undefined);
    return (options.transform ?? (defaultListTransform as CrudTransform<CrudListResult<T>>))(response);
  },
  getById: async <T>(endpoint: string, id?: string | number, options: CrudRequestOptions<T> = {}) => {
    const resolved = resolveEndpoint(endpoint, id);
    return request<T>(resolved, options);
  },
  create: async <T>(endpoint: string, data: unknown, options: CrudRequestOptions<T> = {}) => {
    return request<T>(resolveEndpoint(endpoint), { ...options, method: options.method ?? 'post', data });
  },
  update: async <T>(endpoint: string, id: string | number | undefined, data: unknown, options: CrudRequestOptions<T> = {}) => {
    const resolved = resolveEndpoint(endpoint, id);
    return request<T>(resolved, { ...options, method: options.method ?? 'put', data });
  },
  remove: async <T>(endpoint: string, id: string | number, options: CrudRequestOptions<T> = {}) => {
    const resolved = resolveEndpoint(endpoint, id);
    return request<T>(resolved, { ...options, method: options.method ?? 'delete' });
  },
};
