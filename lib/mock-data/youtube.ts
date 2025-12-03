// ============================================================================
// AthenaPeX - MOCK DATA: YOUTUBE REFERENCES
// ATHENA Architecture | Sample Data for Development
// ============================================================================

import type { YouTubeReference, YouTubeInsight } from '@/types';

export const mockYoutubeRefs: YouTubeReference[] = [
  {
    id: 'yt-001',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoId: 'dQw4w9WgXcQ',
    title: 'Building Production-Ready React Apps with TypeScript',
    channelName: 'Theo - t3.gg',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    duration: '45:32',
    description: 'Complete guide to building production-ready React applications using TypeScript, Tailwind, and modern best practices.',
    tags: ['react', 'typescript', 'production'],
    insights: [
      {
        id: 'yi-001',
        referenceId: 'yt-001',
        timestamp: '12:45',
        content: 'Use strict TypeScript config for better type safety',
        category: 'key_point',
        createdAt: Date.now() - 86400000 * 5,
      },
      {
        id: 'yi-002',
        referenceId: 'yt-001',
        timestamp: '23:10',
        content: 'Implement error boundaries at strategic points',
        category: 'action_item',
        createdAt: Date.now() - 86400000 * 5,
      },
    ],
    linkedProjects: ['proj-001'],
    linkedPrompts: ['p2'],
    watchedAt: Date.now() - 86400000 * 5,
    addedAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 5,
    impactScore: 9,
    outputGenerated: true,
  },
  {
    id: 'yt-002',
    url: 'https://www.youtube.com/watch?v=abc123xyz',
    videoId: 'abc123xyz',
    title: 'Next.js 15 App Router Deep Dive',
    channelName: 'Vercel',
    thumbnailUrl: 'https://img.youtube.com/vi/abc123xyz/mqdefault.jpg',
    duration: '1:15:20',
    description: 'Deep dive into Next.js 15 App Router, Server Components, and Server Actions.',
    tags: ['nextjs', 'app-router', 'server-components'],
    insights: [
      {
        id: 'yi-003',
        referenceId: 'yt-002',
        timestamp: '08:30',
        content: 'Server Components reduce JavaScript bundle size',
        category: 'key_point',
        createdAt: Date.now() - 86400000 * 3,
      },
      {
        id: 'yi-004',
        referenceId: 'yt-002',
        timestamp: '35:15',
        content: 'Use Server Actions for form mutations',
        category: 'action_item',
        createdAt: Date.now() - 86400000 * 3,
      },
      {
        id: 'yi-005',
        referenceId: 'yt-002',
        timestamp: '52:00',
        content: '"The future of web development is server-first" - Guillermo Rauch',
        category: 'quote',
        createdAt: Date.now() - 86400000 * 3,
      },
    ],
    linkedProjects: ['proj-001'],
    linkedPrompts: [],
    watchedAt: Date.now() - 86400000 * 3,
    addedAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 3,
    impactScore: 8,
    outputGenerated: true,
  },
  {
    id: 'yt-003',
    url: 'https://www.youtube.com/watch?v=xyz789abc',
    videoId: 'xyz789abc',
    title: 'Cold Email That Gets 40% Reply Rates',
    channelName: 'Alex Hormozi',
    thumbnailUrl: 'https://img.youtube.com/vi/xyz789abc/mqdefault.jpg',
    duration: '28:45',
    description: 'Exact framework for writing cold emails that convert. Based on data from 10,000+ campaigns.',
    tags: ['marketing', 'cold-email', 'sales'],
    insights: [
      {
        id: 'yi-006',
        referenceId: 'yt-003',
        timestamp: '05:20',
        content: 'Subject line should be personal and curiosity-driven',
        category: 'key_point',
        createdAt: Date.now() - 86400000 * 10,
      },
      {
        id: 'yi-007',
        referenceId: 'yt-003',
        timestamp: '15:30',
        content: 'Use the AIDA framework: Attention, Interest, Desire, Action',
        category: 'resource',
        createdAt: Date.now() - 86400000 * 10,
      },
    ],
    linkedProjects: ['proj-002'],
    linkedPrompts: ['p4'],
    watchedAt: Date.now() - 86400000 * 10,
    addedAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 86400000 * 10,
    impactScore: 9,
    outputGenerated: true,
  },
  {
    id: 'yt-004',
    url: 'https://www.youtube.com/watch?v=qrs456tuv',
    videoId: 'qrs456tuv',
    title: 'Zustand vs Redux in 2024',
    channelName: 'Web Dev Simplified',
    thumbnailUrl: 'https://img.youtube.com/vi/qrs456tuv/mqdefault.jpg',
    duration: '22:10',
    description: 'Comprehensive comparison of Zustand and Redux for state management in modern React apps.',
    tags: ['zustand', 'redux', 'state-management'],
    insights: [
      {
        id: 'yi-008',
        referenceId: 'yt-004',
        timestamp: '11:45',
        content: 'Zustand is 10x smaller bundle size than Redux Toolkit',
        category: 'key_point',
        createdAt: Date.now() - 86400000 * 8,
      },
    ],
    linkedProjects: ['proj-001'],
    linkedPrompts: [],
    addedAt: Date.now() - 86400000 * 9,
    updatedAt: Date.now() - 86400000 * 8,
    impactScore: 7,
    outputGenerated: false,
  },
  {
    id: 'yt-005',
    url: 'https://www.youtube.com/watch?v=mno123pqr',
    videoId: 'mno123pqr',
    title: 'Local LLMs for Development - Complete Guide',
    channelName: 'Fireship',
    thumbnailUrl: 'https://img.youtube.com/vi/mno123pqr/mqdefault.jpg',
    duration: '12:05',
    description: 'How to run local LLMs for development automation and code generation.',
    tags: ['llm', 'ai', 'automation', 'local'],
    insights: [],
    linkedProjects: ['proj-003'],
    linkedPrompts: [],
    addedAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    impactScore: 8,
    outputGenerated: false,
  },
];

export const getYoutubeRefById = (id: string): YouTubeReference | undefined => {
  return mockYoutubeRefs.find(r => r.id === id);
};

export const getYoutubeRefsByProject = (projectId: string): YouTubeReference[] => {
  return mockYoutubeRefs.filter(r => r.linkedProjects.includes(projectId));
};

export const getUnwatchedYoutubeRefs = (): YouTubeReference[] => {
  return mockYoutubeRefs.filter(r => !r.watchedAt);
};

export const getHighImpactYoutubeRefs = (minImpact: number = 8): YouTubeReference[] => {
  return mockYoutubeRefs.filter(r => r.impactScore >= minImpact);
};

export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

export default mockYoutubeRefs;
