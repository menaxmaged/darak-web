import type { Reel } from '@/lib/eyoot-types';
import { buildListResult, mockSuccess } from '@/lib/mocks/mock-helpers';

const mockReels: Reel[] = [
  {
    id: 100,
    title: 'Internship Day 1: Orientation',
    thumbnailUrl: '',
    videoUrl: 'https://example.com/reels/orientation.mp4',
    category: 'Campus Life',
    linkedOpportunityId: 14,
    linkedOpportunityType: 'position',
    views: 12400,
    likes: 1800,
    saves: 620,
    shares: 210,
    publishedAt: '2026-04-20T10:00:00Z',
    status: 'published',
  },
  {
    id: 101,
    title: 'Interview Tips in 60 Seconds',
    thumbnailUrl: '',
    videoUrl: 'https://example.com/reels/interview-tips.mp4',
    category: 'Tips',
    linkedOpportunityId: 601,
    linkedOpportunityType: 'workshop',
    views: 9800,
    likes: 1400,
    saves: 500,
    shares: 160,
    publishedAt: '2026-04-28T09:00:00Z',
    status: 'published',
  },
];

export const mockReelsList = buildListResult(mockReels, 1, 20);
export const mockReelSuccess = mockSuccess('Reel updated');
