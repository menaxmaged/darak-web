import { ApplicationStatus, IBMProofStatus, AdminRole } from './eyoot-types';

export const APPLICATION_STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; variant: 'default' | 'success' | 'destructive' | 'warning' | 'info' | 'purple' | 'teal' | 'gray' }
> = {
  applied: { label: 'Applied', variant: 'info' },
  'ibm-course-required': { label: 'IBM Course Required', variant: 'warning' },
  interview: { label: 'Interview', variant: 'purple' },
  declined: { label: 'Declined', variant: 'destructive' },
  approved: { label: 'Approved', variant: 'success' },
  'volunteering-required': { label: 'Volunteering Required', variant: 'teal' },
  'certificate-ready': { label: 'Certificate Ready', variant: 'success' },
};

export const IBM_PROOF_STATUS_CONFIG: Record<
  IBMProofStatus,
  { label: string; variant: 'default' | 'success' | 'destructive' | 'warning' | 'info' | 'gray' }
> = {
  'not-uploaded': { label: 'Not Uploaded', variant: 'gray' },
  pending: { label: 'Pending Review', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  'reupload-requested': { label: 'Reupload Requested', variant: 'warning' },
};

export const ADMIN_ROLE_CONFIG: Record<AdminRole, { label: string }> = {
  'super-admin': { label: 'Super Admin' },
  'applications-manager': { label: 'Applications Manager' },
  'student-manager': { label: 'Student Manager' },
  'content-manager': { label: 'Content Manager' },
  'analytics-viewer': { label: 'Analytics Viewer' },
};

export const APPLICATION_STATUS_ORDER: ApplicationStatus[] = [
  'applied',
  'ibm-course-required',
  'interview',
  'approved',
  'volunteering-required',
  'certificate-ready',
  'declined',
];

export function formatDate(date?: string | null): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date?: string | null): string {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function capacityColor(used: number, total: number): string {
  const pct = total > 0 ? (used / total) * 100 : 0;
  if (pct >= 100) return 'bg-red-500';
  if (pct >= 80) return 'bg-amber-500';
  return 'bg-emerald-500';
}

export function capacityTextColor(used: number, total: number): string {
  const pct = total > 0 ? (used / total) * 100 : 0;
  if (pct >= 100) return 'text-red-600';
  if (pct >= 80) return 'text-amber-600';
  return 'text-emerald-600';
}
