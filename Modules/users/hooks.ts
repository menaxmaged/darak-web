import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/api-client';
import { userApi } from './api';

export const useUsers = (params?: any) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: ({ queryKey }) => userApi.listUsers(params),
  });
};

export const useUser = (params: { username?: string; email?: string; id?: string }) => {
  return useQuery({
    queryKey: ['user', params],
    queryFn: ({ queryKey }) =>
      userApi.getUser(queryKey[1] as { username?: string; email?: string; id?: string }),
    enabled: Boolean(params && (params.username || params.email || params.id)),
  });
};

export const useBanUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.banUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Ban user error:', getErrorMessage(error));
    },
  });
};

export const useEditRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.editRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Edit role error:', getErrorMessage(error));
    },
  });
};

export const useEditStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.editStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Edit status error:', getErrorMessage(error));
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Create user error:', getErrorMessage(error));
    },
  });
};
