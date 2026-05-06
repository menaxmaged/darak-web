import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { crudProvider, CrudListResult } from '@/lib/core/crud-provider';

export type ResourceId = string | number;

export type ResourceEndpoints = {
  list: string;
  detail?: string;
  create?: string;
  update?: string;
  delete?: string;
};

export type ResourceMethods = {
  list?: 'get' | 'post';
  detail?: 'get' | 'post';
  create?: 'post' | 'put' | 'patch';
  update?: 'put' | 'patch' | 'post';
  delete?: 'delete' | 'post';
};

type ListTransform<T> = (response: any) => CrudListResult<T>;

type DetailTransform<T> = (response: any) => T;

export type UseResourceOptions<TList, TDetail = TList> = {
  endpoints: ResourceEndpoints;
  methods?: ResourceMethods;
  listTransform?: ListTransform<TList>;
  detailTransform?: DetailTransform<TDetail>;
  detailUsesIdPath?: boolean;
  updateUsesIdPath?: boolean;
};

export type UpdateVariables<TData> = {
  id?: ResourceId;
  data: TData;
  params?: Record<string, unknown>;
};

export type DeleteVariables = {
  id: ResourceId;
  params?: Record<string, unknown>;
};

export type CreateVariables<TData> = {
  data: TData;
  params?: Record<string, unknown>;
};

type MutationOptions<TResult, TVariables> = {
  onSuccess?: (data: TResult, variables: TVariables) => void;
  onError?: (error: unknown, variables: TVariables) => void;
};

export function useResource<TList, TDetail = TList>(
  resourceName: string,
  options: UseResourceOptions<TList, TDetail>
) {
  const queryClient = useQueryClient();
  const { endpoints, methods, listTransform, detailTransform, detailUsesIdPath, updateUsesIdPath } = options;

  const invalidateResource = () =>
    queryClient.invalidateQueries({ queryKey: [resourceName] });

  const useList = (params?: Record<string, unknown>) => {
    return useQuery({
      queryKey: [resourceName, 'list', params],
      queryFn: () =>
        crudProvider.getAll<TList>(endpoints.list, {
          params,
          method: methods?.list,
          transform: listTransform,
        }),
    });
  };

  const useDetail = (
    id?: ResourceId,
    params?: Record<string, unknown>,
    data?: Record<string, unknown>
  ) => {
    if (!endpoints.detail) {
      throw new Error(`Missing detail endpoint for resource ${resourceName}`);
    }
    const usesPath = detailUsesIdPath ?? true;
    const requestData = usesPath ? data : { ...(data ?? {}), id };
    const requestId = usesPath ? id : undefined;
    return useQuery({
      queryKey: [resourceName, 'detail', id],
      queryFn: () =>
        crudProvider.getById<TDetail>(endpoints.detail as string, requestId as ResourceId, {
          method: methods?.detail,
          params,
          data: requestData,
          transform: detailTransform,
        }),
      enabled: id !== undefined && id !== null,
    });
  };

  const useCreate = (mutationOptions?: MutationOptions<unknown, CreateVariables<unknown>>) =>
    useMutation({
      mutationFn: ({ data, params }: CreateVariables<unknown>) => {
        if (!endpoints.create) {
          throw new Error(`Missing create endpoint for resource ${resourceName}`);
        }
        return crudProvider.create(endpoints.create, data, {
          method: methods?.create,
          params,
        });
      },
      onSuccess: (data, variables) => {
        invalidateResource();
        mutationOptions?.onSuccess?.(data, variables);
      },
      onError: (error, variables) => {
        mutationOptions?.onError?.(error, variables);
      },
    });

  const useUpdate = (mutationOptions?: MutationOptions<unknown, UpdateVariables<unknown>>) =>
    useMutation({
      mutationFn: ({ id, data, params }: UpdateVariables<unknown>) => {
        if (!endpoints.update) {
          throw new Error(`Missing update endpoint for resource ${resourceName}`);
        }
        const usesPath = updateUsesIdPath ?? true;
        const requestId = usesPath ? (id as ResourceId) : undefined;
        const requestData = usesPath
          ? data
          : typeof data === 'object' && data !== null
            ? { ...(data as Record<string, unknown>), ...(id ? { id } : {}) }
            : data;
        return crudProvider.update(endpoints.update, requestId, requestData, {
          method: methods?.update,
          params,
        });
      },
      onSuccess: (data, variables) => {
        invalidateResource();
        mutationOptions?.onSuccess?.(data, variables);
      },
      onError: (error, variables) => {
        mutationOptions?.onError?.(error, variables);
      },
    });

  const useDelete = (mutationOptions?: MutationOptions<unknown, DeleteVariables>) =>
    useMutation({
      mutationFn: ({ id, params }: DeleteVariables) => {
        if (!endpoints.delete) {
          throw new Error(`Missing delete endpoint for resource ${resourceName}`);
        }
        return crudProvider.remove(endpoints.delete, id, {
          method: methods?.delete,
          params,
        });
      },
      onSuccess: (data, variables) => {
        invalidateResource();
        mutationOptions?.onSuccess?.(data, variables);
      },
      onError: (error, variables) => {
        mutationOptions?.onError?.(error, variables);
      },
    });

  return {
    useList,
    useDetail,
    useCreate,
    useUpdate,
    useDelete,
  };
}
