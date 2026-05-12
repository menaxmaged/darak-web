import type { DashboardStats } from '@/lib/eyoot-types';

export const mockDashboardStats: DashboardStats = {
  totalStudents: 1240,
  signedUpStudents: 620,
  appliedStudents: 420,
  totalApplications: 980,
  pendingApplications: 140,
  approvedApplications: 520,
  declinedApplications: 120,
  ibmProofsPending: 28,
  activeCompanies: 42,
  activePositions: 135,
  capacityFilledPercent: 76,
  volunteeringApplications: 210,
  certificatesUploaded: 340,
  workshopRegistrations: 880,
  courseViews: 12450,
  reelEngagement: 3150,
};

export const mockApplicationAnalytics = {
  total: 980,
  approved: 520,
  declined: 120,
  pending: 140,
  ibmRequired: 200,
};

export const mockStudentAnalytics = {
  total: 1240,
  signedUpOnly: 620,
  applied: 420,
  active: 1100,
  inactive: 140,
};

export const mockContentAnalytics = {
  workshops: 880,
  courses: 12450,
  reels: 3150,
  notificationsSent: 64,
};
