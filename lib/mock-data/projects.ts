// ============================================================================
// AthenaPeX - MOCK DATA: PROJECTS
// ATHENA Architecture | Sample Data for Development
// ============================================================================

import type { Project } from '@/types';

export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'AthenaPeX Core Platform',
    description: 'Main development of the AthenaPeX productivity system with all core modules',
    emoji: '🚀',
    status: 'active',
    priority: 'critical',
    impactScore: 10,
    roiScore: 3.3,
    owner: 'Natasha (ENTJ)',
    tags: ['core', 'platform', 'priority-alpha'],
    startDate: '2024-01-01',
    deadline: '2024-06-30',
    createdAt: Date.now() - 86400000 * 90,
    updatedAt: Date.now(),
    tasksCount: 24,
    completedTasksCount: 12,
    linkedPrompts: ['p1', 'p2'],
    linkedYoutubeRefs: [],
  },
  {
    id: 'proj-002',
    name: 'Marketing Automation',
    description: 'Automated email sequences and landing page optimization',
    emoji: '📈',
    status: 'active',
    priority: 'high',
    impactScore: 8,
    roiScore: 2.7,
    owner: 'Marketing Team',
    tags: ['marketing', 'automation', 'growth'],
    startDate: '2024-02-01',
    deadline: '2024-04-30',
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now(),
    tasksCount: 18,
    completedTasksCount: 8,
    linkedPrompts: ['p4', 'p5'],
    linkedYoutubeRefs: [],
  },
  {
    id: 'proj-003',
    name: 'AI Agent Integration',
    description: 'Integrate Fara-7B local agent for automation workflows',
    emoji: '🤖',
    status: 'active',
    priority: 'high',
    impactScore: 9,
    roiScore: 2.25,
    owner: 'Natasha (ENTJ)',
    tags: ['ai', 'automation', 'agent'],
    startDate: '2024-03-01',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now(),
    tasksCount: 12,
    completedTasksCount: 4,
    linkedPrompts: ['p1'],
    linkedYoutubeRefs: [],
  },
  {
    id: 'proj-004',
    name: 'Mobile Companion App',
    description: 'React Native mobile app for quick task capture and status updates',
    emoji: '📱',
    status: 'on_hold',
    priority: 'medium',
    impactScore: 6,
    roiScore: 1.2,
    owner: 'Mobile Team',
    tags: ['mobile', 'react-native', 'companion'],
    startDate: '2024-04-01',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now(),
    tasksCount: 8,
    completedTasksCount: 1,
    linkedPrompts: [],
    linkedYoutubeRefs: [],
  },
  {
    id: 'proj-005',
    name: 'Documentation Hub',
    description: 'Comprehensive documentation for all AthenaPeX modules',
    emoji: '📚',
    status: 'completed',
    priority: 'medium',
    impactScore: 5,
    roiScore: 1.7,
    owner: 'Tech Writers',
    tags: ['docs', 'documentation', 'knowledge-base'],
    startDate: '2024-01-15',
    deadline: '2024-02-28',
    completedDate: '2024-02-25',
    createdAt: Date.now() - 86400000 * 120,
    updatedAt: Date.now() - 86400000 * 5,
    tasksCount: 15,
    completedTasksCount: 15,
    linkedPrompts: [],
    linkedYoutubeRefs: [],
  },
  {
    id: 'proj-006',
    name: 'Performance Optimization',
    description: 'Optimize frontend performance and reduce load times',
    emoji: '⚡',
    status: 'active',
    priority: 'medium',
    impactScore: 7,
    roiScore: 1.75,
    owner: 'Natasha (ENTJ)',
    tags: ['performance', 'optimization', 'frontend'],
    startDate: '2024-03-15',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now(),
    tasksCount: 10,
    completedTasksCount: 3,
    linkedPrompts: ['p2'],
    linkedYoutubeRefs: [],
  },
];

export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(p => p.id === id);
};

export const getActiveProjects = (): Project[] => {
  return mockProjects.filter(p => p.status === 'active');
};

export const getProjectsByPriority = (priority: Project['priority']): Project[] => {
  return mockProjects.filter(p => p.priority === priority);
};

export const getHighROIProjects = (minROI: number = 2.0): Project[] => {
  return mockProjects.filter(p => p.roiScore >= minROI);
};

export default mockProjects;
