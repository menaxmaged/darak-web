import type { Certificate } from '@/lib/eyoot-types';
import { buildListResult, mockSuccess } from '@/lib/mocks/mock-helpers';

const mockCertificates: Certificate[] = [
  {
    id: 401,
    studentId: 12,
    studentName: 'Sara Mahmoud',
    studentEmail: 'sara.mahmoud@example.com',
    applicationId: 101,
    companyName: 'Orbit Labs',
    positionTitle: 'Frontend Intern',
    title: 'Internship Completion Certificate',
    fileUrl: 'https://example.com/certificates/101.pdf',
    completionDate: '2026-07-15',
    uploadedAt: '2026-07-16T10:00:00Z',
    isNotified: true,
  },
  {
    id: 402,
    studentId: 25,
    studentName: 'Mona Saad',
    studentEmail: 'mona.saad@example.com',
    applicationId: 103,
    companyName: 'Atlas Growth',
    positionTitle: 'Marketing Intern',
    title: 'Marketing Internship Certificate',
    fileUrl: 'https://example.com/certificates/103.pdf',
    completionDate: '2026-07-01',
    uploadedAt: '2026-07-03T09:30:00Z',
    isNotified: false,
  },
];

export const mockCertificatesList = buildListResult(mockCertificates, 1, 20);
export const mockCertificateSuccess = mockSuccess('Certificate updated');
