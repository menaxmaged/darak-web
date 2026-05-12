import type { Company, CompanyDetail, Position } from '@/lib/eyoot-types';
import { buildListResult, mockSuccess } from '@/lib/mocks/mock-helpers';

const mockPositions: Position[] = [
  {
    id: 14,
    companyId: 3,
    companyName: 'Orbit Labs',
    companyLogo: '',
    title: 'Frontend Intern',
    description: 'Work on UI components and design systems.',
    requirements: ['React basics', 'CSS fundamentals'],
    capacity: 12,
    usedCapacity: 9,
    remainingCapacity: 3,
    deadline: '2026-06-15',
    applicantsCount: 45,
    approvedCount: 9,
    pendingCount: 8,
    status: 'active',
    createdAt: '2026-03-20T09:00:00Z',
  },
  {
    id: 15,
    companyId: 3,
    companyName: 'Orbit Labs',
    companyLogo: '',
    title: 'Backend Intern',
    description: 'API support and data services.',
    requirements: ['Node.js basics', 'REST APIs'],
    capacity: 8,
    usedCapacity: 8,
    remainingCapacity: 0,
    deadline: '2026-06-10',
    applicantsCount: 38,
    approvedCount: 8,
    pendingCount: 5,
    status: 'full',
    createdAt: '2026-03-18T09:00:00Z',
  },
];

const baseCompanies: Company[] = [
  {
    id: 3,
    name: 'Orbit Labs',
    logo: '',
    industry: 'Software',
    description: 'A product studio focused on student experiences.',
    website: 'https://orbitlabs.example.com',
    email: 'hello@orbitlabs.example.com',
    phone: '+20 100 000 0000',
    activePositions: 4,
    totalCapacity: 32,
    usedCapacity: 24,
    remainingCapacity: 8,
    applicationsCount: 112,
    requirements: {
      minAge: 18,
      minGpa: 2.8,
      languageRequirements: ['English'],
      ibmRequired: true,
    },
    createdAt: '2026-02-12T10:00:00Z',
    status: 'active',
  },
  {
    id: 7,
    name: 'Nimbus Tech',
    logo: '',
    industry: 'Data & AI',
    description: 'AI-driven analytics for education.',
    website: 'https://nimbus.example.com',
    email: 'contact@nimbus.example.com',
    phone: '+20 120 000 0000',
    activePositions: 3,
    totalCapacity: 20,
    usedCapacity: 14,
    remainingCapacity: 6,
    applicationsCount: 68,
    requirements: {
      minAge: 18,
      minGpa: 3.0,
      languageRequirements: ['English', 'Arabic'],
      ibmRequired: false,
    },
    createdAt: '2026-01-08T10:00:00Z',
    status: 'active',
  },
];

export const mockCompaniesList = buildListResult(baseCompanies, 1, 20);

export const mockCompanyDetail: CompanyDetail = {
  ...baseCompanies[0],
  positions: mockPositions,
};

export const mockCompanySuccess = mockSuccess('Company updated');
