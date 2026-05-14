import { api } from '../../lib/api-client';
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

export const userApi = {
  listUsers: async (params?: any) => {
    console.log('Fetching users with params:', params);
      const response = await api.get<UsersListResponse>('/admin/list-users', { params });
      return { data: response.data.data, meta: response.data.meta };
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
