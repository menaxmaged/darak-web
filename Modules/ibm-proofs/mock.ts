import type { IBMProof } from '@/lib/eyoot-types';
import { buildListResult, mockSuccess } from '@/lib/mocks/mock-helpers';

const mockProofs: IBMProof[] = [
  {
    id: 201,
    studentId: 12,
    studentName: 'Sara Mahmoud',
    studentEmail: 'sara.mahmoud@example.com',
    applicationId: 101,
    companyName: 'Orbit Labs',
    positionTitle: 'Frontend Intern',
    courseTitle: 'IBM Frontend Foundations',
    courseUrl: 'https://example.com/ibm-frontend',
    proofUrl: 'https://example.com/proof-frontend.png',
    proofType: 'image',
    status: 'pending',
    uploadedAt: '2026-05-03T10:00:00Z',
  },
  {
    id: 202,
    studentId: 18,
    studentName: 'Omar Ali',
    studentEmail: 'omar.ali@example.com',
    applicationId: 102,
    companyName: 'Nimbus Tech',
    positionTitle: 'Data Intern',
    courseTitle: 'IBM Data Analytics',
    courseUrl: 'https://example.com/ibm-data',
    proofUrl: 'https://example.com/proof-data.pdf',
    proofType: 'pdf',
    status: 'approved',
    uploadedAt: '2026-05-01T09:00:00Z',
  },
];

export const mockIBMProofsList = buildListResult(mockProofs, 1, 20);
export const mockIBMProofSuccess = mockSuccess('Proof reviewed');
