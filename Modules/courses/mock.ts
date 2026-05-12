import type { Course } from '@/lib/eyoot-types';
import { buildListResult, mockSuccess } from '@/lib/mocks/mock-helpers';

const mockCourses: Course[] = [
  {
    id: 501,
    title: 'UI Foundations for Interns',
    image: '',
    description: 'Fundamental UI/UX concepts for early career roles.',
    type: 'informational',
    provider: 'Eyoot Academy',
    link: 'https://example.com/ui-foundations',
    category: 'Design',
    views: 3200,
    clicks: 740,
    saves: 210,
    registrations: 180,
    status: 'published',
    createdAt: '2026-02-10T09:00:00Z',
  },
  {
    id: 502,
    title: 'Frontend Intern Bootcamp',
    image: '',
    description: 'Hands-on React and Next.js basics.',
    type: 'internal-video',
    provider: 'Eyoot Studio',
    link: 'https://example.com/frontend-bootcamp',
    category: 'Engineering',
    views: 5400,
    clicks: 1200,
    saves: 410,
    registrations: 320,
    status: 'published',
    createdAt: '2026-03-01T09:00:00Z',
  },
];

export const mockCoursesList = buildListResult(mockCourses, 1, 20);
export const mockCourseSuccess = mockSuccess('Course updated');
