import type { ApiResponse } from '@/types';
import { mockUsersList, mockUserDetail, mockUserSuccess } from '@/Modules/users/mock';

export type MockRequest = {
  method: string;
  url: string;
  params?: Record<string, unknown>;
  data?: unknown;
};

type MockHandler = (req: MockRequest) => ApiResponse<unknown>;

type MockRoute = {
  method: string;
  match: string | RegExp | ((url: string) => boolean);
  handler: MockHandler;
};

const wrapData = (data: unknown): ApiResponse<unknown> => ({
  success: true,
  data,
});

const wrapList = (list: { data: unknown[]; meta?: unknown; pagination?: unknown }): ApiResponse<unknown> => ({
  success: true,
  data: list.data,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: list.meta as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pagination: list.pagination as any,
});

const routes: MockRoute[] = [
  { method: 'GET', match: '/admin/list-users', handler: () => wrapList(mockUsersList) },
  { method: 'POST', match: '/admin/get-user', handler: () => wrapData(mockUserDetail) },
  { method: 'PUT', match: '/admin/ban-user', handler: () => mockUserSuccess },
  { method: 'PUT', match: '/admin/edit-role', handler: () => mockUserSuccess },
  { method: 'PUT', match: '/admin/edit-status', handler: () => mockUserSuccess },
  { method: 'POST', match: '/auth/register', handler: () => mockUserSuccess },
];

const isMatch = (matcher: MockRoute['match'], url: string) => {
  if (typeof matcher === 'string') {
    return matcher === url;
  }
  if (matcher instanceof RegExp) {
    return matcher.test(url);
  }
  return matcher(url);
};

export const getMockResponse = (req: MockRequest): ApiResponse<unknown> | null => {
  const method = req.method.toUpperCase();
  const route = routes.find((r) => r.method === method && isMatch(r.match, req.url));
  if (!route) {
    return null;
  }
  return route.handler(req);
};
