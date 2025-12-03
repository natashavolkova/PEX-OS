// ============================================================================
// AthenaPeX - MOCK DATA: TASKS
// ATHENA Architecture | Sample Data for Development
// ============================================================================

import type { Task } from '@/types';

export const mockTasks: Task[] = [
  // AthenaPeX Core Platform Tasks
  {
    id: 'task-001',
    projectId: 'proj-001',
    name: 'Implement Analytics Dashboard',
    description: 'Create comprehensive productivity analytics with heatmaps, focus tracking, and insights',
    emoji: '📊',
    status: 'in_progress',
    priority: 'critical',
    impactScore: 9,
    effortScore: 4,
    roiScore: 2.25,
    owner: 'Natasha (ENTJ)',
    tags: ['analytics', 'ui', 'dashboard'],
    estimatedMinutes: 480,
    blockers: [],
    dependencies: [],
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now(),
    startedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'task-002',
    projectId: 'proj-001',
    name: 'Build Battle Plan Generator',
    description: 'ENTJ-style aggressive sprint planning with ROI optimization',
    emoji: '⚔️',
    status: 'pending',
    priority: 'critical',
    impactScore: 9,
    effortScore: 3,
    roiScore: 3.0,
    owner: 'Natasha (ENTJ)',
    tags: ['planning', 'entj', 'sprint'],
    estimatedMinutes: 360,
    blockers: [],
    dependencies: ['task-001'],
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now(),
  },
  {
    id: 'task-003',
    projectId: 'proj-001',
    name: 'Create Neovim Config Generator',
    description: 'Generate LazyVim configurations with ENTJ keymaps and macros',
    emoji: '⌨️',
    status: 'pending',
    priority: 'high',
    impactScore: 7,
    effortScore: 3,
    roiScore: 2.33,
    owner: 'Natasha (ENTJ)',
    tags: ['neovim', 'config', 'dev-tools'],
    estimatedMinutes: 240,
    blockers: [],
    dependencies: [],
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now(),
  },
  {
    id: 'task-004',
    projectId: 'proj-001',
    name: 'Implement Real-time Notifications',
    description: 'Add notification system for deadlines, focus reminders, and insights',
    emoji: '🔔',
    status: 'blocked',
    priority: 'high',
    impactScore: 8,
    effortScore: 5,
    roiScore: 1.6,
    owner: 'Natasha (ENTJ)',
    tags: ['notifications', 'realtime', 'ux'],
    estimatedMinutes: 360,
    blockers: ['Waiting for WebSocket setup'],
    dependencies: [],
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now(),
  },
  {
    id: 'task-005',
    projectId: 'proj-001',
    name: 'Add Monaco Editor Integration',
    description: 'Integrate Monaco editor for code/prompt editing with syntax highlighting',
    emoji: '📝',
    status: 'completed',
    priority: 'high',
    impactScore: 8,
    effortScore: 4,
    roiScore: 2.0,
    owner: 'Natasha (ENTJ)',
    tags: ['editor', 'monaco', 'ux'],
    estimatedMinutes: 240,
    actualMinutes: 180,
    blockers: [],
    dependencies: [],
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 2,
    startedAt: Date.now() - 86400000 * 14,
    completedAt: Date.now() - 86400000 * 2,
  },

  // Marketing Automation Tasks
  {
    id: 'task-006',
    projectId: 'proj-002',
    name: 'Create Email Sequence Templates',
    description: 'Build high-converting cold email templates with personalization',
    emoji: '📧',
    status: 'in_progress',
    priority: 'high',
    impactScore: 8,
    effortScore: 3,
    roiScore: 2.67,
    owner: 'Marketing Team',
    tags: ['email', 'templates', 'conversion'],
    estimatedMinutes: 180,
    blockers: [],
    dependencies: [],
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now(),
    startedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'task-007',
    projectId: 'proj-002',
    name: 'Design Landing Page A/B Tests',
    description: 'Set up A/B testing framework for landing page optimization',
    emoji: '🎯',
    status: 'pending',
    priority: 'medium',
    impactScore: 7,
    effortScore: 4,
    roiScore: 1.75,
    owner: 'Marketing Team',
    tags: ['landing', 'testing', 'optimization'],
    estimatedMinutes: 300,
    blockers: [],
    dependencies: ['task-006'],
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now(),
  },

  // AI Agent Tasks
  {
    id: 'task-008',
    projectId: 'proj-003',
    name: 'Setup WebSocket Communication',
    description: 'Implement WebSocket layer for real-time agent communication',
    emoji: '🔌',
    status: 'in_progress',
    priority: 'critical',
    impactScore: 9,
    effortScore: 5,
    roiScore: 1.8,
    owner: 'Natasha (ENTJ)',
    tags: ['websocket', 'agent', 'realtime'],
    estimatedMinutes: 420,
    blockers: [],
    dependencies: [],
    createdAt: Date.now() - 86400000 * 14,
    updatedAt: Date.now(),
    startedAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'task-009',
    projectId: 'proj-003',
    name: 'Build Agent Task Queue',
    description: 'Create task queue system for agent commands with priority handling',
    emoji: '📋',
    status: 'pending',
    priority: 'high',
    impactScore: 8,
    effortScore: 4,
    roiScore: 2.0,
    owner: 'Natasha (ENTJ)',
    tags: ['queue', 'agent', 'automation'],
    estimatedMinutes: 300,
    blockers: [],
    dependencies: ['task-008'],
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now(),
  },
  {
    id: 'task-010',
    projectId: 'proj-003',
    name: 'Create Macro Library',
    description: 'Build library of reusable agent macros for common tasks',
    emoji: '🎭',
    status: 'pending',
    priority: 'medium',
    impactScore: 7,
    effortScore: 3,
    roiScore: 2.33,
    owner: 'Natasha (ENTJ)',
    tags: ['macros', 'agent', 'automation'],
    estimatedMinutes: 240,
    blockers: [],
    dependencies: ['task-009'],
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now(),
  },

  // Low priority / potential elimination candidates
  {
    id: 'task-011',
    projectId: 'proj-004',
    name: 'Research Mobile Frameworks',
    description: 'Compare React Native, Flutter, and native approaches',
    emoji: '🔍',
    status: 'pending',
    priority: 'low',
    impactScore: 4,
    effortScore: 6,
    roiScore: 0.67,
    owner: 'Mobile Team',
    tags: ['research', 'mobile', 'framework'],
    estimatedMinutes: 480,
    blockers: [],
    dependencies: [],
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now(),
  },
  {
    id: 'task-012',
    projectId: 'proj-006',
    name: 'Implement Code Splitting',
    description: 'Add dynamic imports and route-based code splitting',
    emoji: '✂️',
    status: 'pending',
    priority: 'medium',
    impactScore: 7,
    effortScore: 3,
    roiScore: 2.33,
    owner: 'Natasha (ENTJ)',
    tags: ['performance', 'optimization', 'code'],
    estimatedMinutes: 180,
    blockers: [],
    dependencies: [],
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now(),
  },
];

export const getTaskById = (id: string): Task | undefined => {
  return mockTasks.find(t => t.id === id);
};

export const getTasksByProject = (projectId: string): Task[] => {
  return mockTasks.filter(t => t.projectId === projectId);
};

export const getTasksByStatus = (status: Task['status']): Task[] => {
  return mockTasks.filter(t => t.status === status);
};

export const getHighROITasks = (limit: number = 10): Task[] => {
  return [...mockTasks]
    .filter(t => t.status !== 'completed' && t.status !== 'cancelled')
    .sort((a, b) => b.roiScore - a.roiScore)
    .slice(0, limit);
};

export const getBlockedTasks = (): Task[] => {
  return mockTasks.filter(t => t.status === 'blocked');
};

export const getLowROITasks = (maxROI: number = 1.0): Task[] => {
  return mockTasks.filter(t => t.roiScore < maxROI && t.status !== 'completed');
};

export default mockTasks;
