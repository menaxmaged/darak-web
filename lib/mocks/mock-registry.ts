import type { ApiResponse } from '@/types';
// import { mockDashboardStats, mockApplicationAnalytics, mockStudentAnalytics, mockContentAnalytics } from '@/Modules/Analytics/mock';
// import { mockApplicationsList, mockApplicationDetail, mockApplicationSuccess } from '@/Modules/applications/mock';
// import { mockCompaniesList, mockCompanyDetail, mockCompanySuccess } from '@/Modules/companies/mock';
// import { mockCoursesList, mockCourseSuccess } from '@/Modules/courses/mock';
import { mockWorkshopsList, mockWorkshopSuccess } from '@/Modules/workshops/mock';
// import { mockCertificatesList, mockCertificateSuccess } from '@/Modules/certificates/mock';
// import { mockIBMProofsList, mockIBMProofSuccess } from '@/Modules/ibm-proofs/mock';
// import { mockNotificationsList, mockNotificationSuccess } from '@/Modules/eyoot-notifications/mock';
// import { mockStudentsList, mockStudentDetail, mockStudentSuccess } from '@/Modules/students/mock';
// import { mockPositionsList, mockPositionDetail, mockPositionSuccess } from '@/Modules/positions/mock';
import { mockVolunteeringList, mockVolunteeringSuccess } from '@/Modules/volunteering/mock';
// import { mockNewsletterList } from '@/Modules/newsletter/mock';
// import { mockContactsList, mockContactsSuccess } from '@/Modules/contacts/mock';
import { mockUsersList, mockUserDetail, mockUserSuccess } from '@/Modules/users/mock';
// import { mockReelsList, mockReelSuccess } from '@/Modules/reels/mocks';

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
  // { method: 'GET', match: '/admin/analytics/dashboard', handler: () => wrapData(mockDashboardStats) },
  // { method: 'GET', match: '/admin/analytics/applications', handler: () => wrapData(mockApplicationAnalytics) },
  // { method: 'GET', match: '/admin/analytics/students', handler: () => wrapData(mockStudentAnalytics) },
  // { method: 'GET', match: '/admin/analytics/content', handler: () => wrapData(mockContentAnalytics) },

  // { method: 'GET', match: '/admin/applications', handler: () => wrapList(mockApplicationsList) },
  // { method: 'GET', match: /^\/admin\/applications\/\d+$/, handler: () => wrapData(mockApplicationDetail) },
  // { method: 'PUT', match: /^\/admin\/applications\/\d+\/status$/, handler: () => mockApplicationSuccess },
  // { method: 'POST', match: '/admin/applications/bulk-status', handler: () => mockApplicationSuccess },
  // { method: 'POST', match: /^\/admin\/applications\/\d+\/interview$/, handler: () => mockApplicationSuccess },
  // { method: 'POST', match: /^\/admin\/applications\/\d+\/certificate$/, handler: () => mockApplicationSuccess },

  // { method: 'GET', match: '/admin/companies', handler: () => wrapList(mockCompaniesList) },
  // { method: 'GET', match: /^\/admin\/companies\/\d+$/, handler: () => wrapData(mockCompanyDetail) },
  // { method: 'POST', match: '/admin/companies', handler: () => mockCompanySuccess },
  // { method: 'PUT', match: /^\/admin\/companies\/\d+$/, handler: () => mockCompanySuccess },
  // { method: 'DELETE', match: /^\/admin\/companies\/\d+$/, handler: () => mockCompanySuccess },

  // { method: 'GET', match: '/admin/courses', handler: () => wrapList(mockCoursesList) },
  // { method: 'POST', match: '/admin/courses', handler: () => mockCourseSuccess },
  // { method: 'PUT', match: /^\/admin\/courses\/\d+$/, handler: () => mockCourseSuccess },
  // { method: 'DELETE', match: /^\/admin\/courses\/\d+$/, handler: () => mockCourseSuccess },

  { method: 'GET', match: '/admin/workshops', handler: () => wrapList(mockWorkshopsList) },
  { method: 'POST', match: '/admin/workshops', handler: () => mockWorkshopSuccess },
  { method: 'PUT', match: /^\/admin\/workshops\/\d+$/, handler: () => mockWorkshopSuccess },
  { method: 'DELETE', match: /^\/admin\/workshops\/\d+$/, handler: () => mockWorkshopSuccess },

  // { method: 'GET', match: '/admin/certificates', handler: () => wrapList(mockCertificatesList) },
  // { method: 'POST', match: /^\/admin\/certificates\/\d+\/notify$/, handler: () => mockCertificateSuccess },
  // { method: 'DELETE', match: /^\/admin\/certificates\/\d+$/, handler: () => mockCertificateSuccess },

  // { method: 'GET', match: '/admin/ibm-proofs', handler: () => wrapList(mockIBMProofsList) },
  // { method: 'PUT', match: /^\/admin\/ibm-proofs\/\d+\/review$/, handler: () => mockIBMProofSuccess },

  // { method: 'GET', match: '/admin/notifications', handler: () => wrapList(mockNotificationsList) },
  // { method: 'POST', match: '/admin/notifications/send', handler: () => mockNotificationSuccess },

  // { method: 'GET', match: '/admin/students', handler: () => wrapList(mockStudentsList) },
  // { method: 'GET', match: /^\/admin\/students\/\d+$/, handler: () => wrapData(mockStudentDetail) },
  // { method: 'PUT', match: /^\/admin\/students\/\d+$/, handler: () => mockStudentSuccess },
  // { method: 'PUT', match: /^\/admin\/students\/\d+\/ban$/, handler: () => mockStudentSuccess },

  // { method: 'GET', match: '/admin/positions', handler: () => wrapList(mockPositionsList) },
  // { method: 'GET', match: /^\/admin\/positions\/\d+$/, handler: () => wrapData(mockPositionDetail) },
  // { method: 'POST', match: '/admin/positions', handler: () => mockPositionSuccess },
  // { method: 'PUT', match: /^\/admin\/positions\/\d+$/, handler: () => mockPositionSuccess },
  // { method: 'DELETE', match: /^\/admin\/positions\/\d+$/, handler: () => mockPositionSuccess },

  { method: 'GET', match: '/admin/volunteering', handler: () => wrapList(mockVolunteeringList) },
  { method: 'POST', match: '/admin/volunteering', handler: () => mockVolunteeringSuccess },
  { method: 'PUT', match: /^\/admin\/volunteering\/\d+$/, handler: () => mockVolunteeringSuccess },
  { method: 'DELETE', match: /^\/admin\/volunteering\/\d+$/, handler: () => mockVolunteeringSuccess },

  // { method: 'GET', match: '/newsletter/list', handler: () => wrapList(mockNewsletterList) },

  // { method: 'GET', match: '/contact/list', handler: () => wrapList(mockContactsList) },
  // { method: 'PUT', match: '/contact/update', handler: () => mockContactsSuccess },

  { method: 'GET', match: '/admin/list-users', handler: () => wrapList(mockUsersList) },
  { method: 'POST', match: '/admin/get-user', handler: () => wrapData(mockUserDetail) },
  { method: 'PUT', match: '/admin/ban-user', handler: () => mockUserSuccess },
  { method: 'PUT', match: '/admin/edit-role', handler: () => mockUserSuccess },
  { method: 'PUT', match: '/admin/edit-status', handler: () => mockUserSuccess },
  { method: 'POST', match: '/auth/register', handler: () => mockUserSuccess },

  // { method: 'GET', match: '/admin/reels', handler: () => wrapList(mockReelsList) },
  // { method: 'POST', match: '/admin/reels', handler: () => mockReelSuccess },
  // { method: 'PUT', match: /^\/admin\/reels\/\d+$/, handler: () => mockReelSuccess },
  // { method: 'DELETE', match: /^\/admin\/reels\/\d+$/, handler: () => mockReelSuccess },
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
