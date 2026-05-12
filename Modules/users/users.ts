import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../lib/api-client';
import { 
  User,
  UsersListResponse,
  BanUserRequest,
  EditRoleRequest,
  EditStatusRequest,
  CreateUserRequest,
} from '../../lib/types';
import { withMock } from '@/lib/mocks/mock-config';
import { mockUsersList, mockUserDetail, mockUserSuccess } from '@/Modules/users/mock';

// User Management API
export const userApi = {
  listUsers: async (params?: any) => {
    console.log('Fetching users with params:', params);
    return withMock(async () => {
      const response = await api.get<UsersListResponse>('/admin/list-users', { params });
      return { data: response.data.data, meta: response.data.meta };
    }, mockUsersList);
  },

  getUser: async (params: { username?: string; email?: string; id?: string }) => {
    return withMock(async () => {
      const response = await api.post<User>('/admin/get-user', params);
      return response.data.data ?? (response.data as { userData?: User }).userData;
    }, mockUserDetail);
  },

  banUser: async (data: BanUserRequest) => {
    return withMock(async () => {
      const response = await api.put('/admin/ban-user', data);
      return response.data;
    }, mockUserSuccess);
  },

  editRole: async (data: EditRoleRequest) => {
    return withMock(async () => {
      const response = await api.put('/admin/edit-role', data);
      return response.data;
    }, mockUserSuccess);
  },

  editStatus: async (data: EditStatusRequest) => {
    return withMock(async () => {
      const response = await api.put('/admin/edit-status', data);
      console.log('dd', response);
      return response.data;
    }, mockUserSuccess);
  },

  createUser: async (data: CreateUserRequest) => {
    return withMock(async () => {
      const response = await api.post('/auth/register', data);
      return response.data;
    }, mockUserSuccess);
  },
};

// User Management Hooks
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
