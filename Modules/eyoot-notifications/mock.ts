import type { Notification } from '@/lib/eyoot-types';
import { buildListResult, mockSuccess } from '@/lib/mocks/mock-helpers';

const mockNotifications: Notification[] = [
  {
    id: 701,
    title: 'IBM Proof Reminder',
    body: 'Please upload your IBM proof to continue your application.',
    type: 'in-app',
    target: 'missing-ibm-proof',
    recipientCount: 82,
    sentAt: '2026-05-02T11:15:00Z',
    createdBy: 'Admin A',
    status: 'sent',
  },
  {
    id: 702,
    title: 'New Internship Cycle',
    body: 'Applications are now open for summer internships.',
    type: 'email',
    target: 'all',
    recipientCount: 1240,
    sentAt: '2026-04-25T08:00:00Z',
    createdBy: 'Admin B',
    status: 'sent',
  },
];

export const mockNotificationsList = buildListResult(mockNotifications, 1, 20);
export const mockNotificationSuccess = mockSuccess('Notification sent');
