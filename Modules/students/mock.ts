import type { Application, Student, StudentDetail } from '@/lib/eyoot-types';
import { buildPaginatedResult, mockSuccess } from '@/lib/mocks/mock-helpers';

const mockApplications: Application[] = [
  {
    id: 101,
    studentId: 12,
    studentName: 'Sara Mahmoud',
    studentEmail: 'sara.mahmoud@example.com',
    studentUsername: 'sara_m',
    companyId: 3,
    companyName: 'Orbit Labs',
    companyLogo: '',
    positionId: 14,
    positionTitle: 'Frontend Intern',
    status: 'interview',
    ibmProofStatus: 'approved',
    interviewStatus: 'scheduled',
    volunteeringStatus: 'pending',
    certificateStatus: 'not-ready',
    capacityWarning: false,
    appliedAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-08T12:30:00Z',
  },
];

const mockStudents: Student[] = [
  {
    id: 12,
    username: 'sara_m',
    firstName: 'Sara',
    lastName: 'Mahmoud',
    email: 'sara.mahmoud@example.com',
    phone: '+20 100 123 4567',
    dialCode: '+20',
    dateOfBirth: '2002-09-12',
    nationalId: '29809011234567',
    nationalIdFront: '',
    nationalIdBack: '',
    age: 22,
    gender: 'female',
    profileImage: '',
    signupDate: '2026-02-01T10:00:00Z',
    lastActive: '2026-05-09T09:00:00Z',
    studentType: 'applied',
    applicationsCount: 2,
    ibmBadgesCount: 1,
    certificatesCount: 0,
    status: 'active',
    isBanned: false,
  },
  {
    id: 18,
    username: 'omar_ali',
    firstName: 'Omar',
    lastName: 'Ali',
    email: 'omar.ali@example.com',
    phone: '+20 111 555 0000',
    dialCode: '+20',
    dateOfBirth: '2001-01-05',
    nationalId: '30101051234567',
    nationalIdFront: '',
    nationalIdBack: '',
    age: 23,
    gender: 'male',
    profileImage: '',
    signupDate: '2026-01-15T11:00:00Z',
    lastActive: '2026-05-08T18:00:00Z',
    studentType: 'signed-up',
    applicationsCount: 0,
    ibmBadgesCount: 0,
    certificatesCount: 0,
    status: 'active',
    isBanned: false,
  },
];

export const mockStudentsList = buildPaginatedResult(mockStudents, 1, 20);

export const mockStudentDetail: StudentDetail = {
  ...mockStudents[0],
  form: {
    university: 'Cairo University',
    faculty: 'Engineering',
    major: 'Computer Science',
    academicYear: '3',
    gpa: 3.4,
    skills: ['React', 'TypeScript', 'UI Design'],
    languages: ['Arabic', 'English'],
    experience: 'Frontend internship at Orbit Labs',
  },
  applications: mockApplications,
};

export const mockStudentSuccess = mockSuccess('Student updated');
