// ============================================================================
// ATHENAPEX - PROJECTS STORE
// ATHENA Architecture | Projects + Tasks Domain
// ============================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Project, Task, TaskLog } from '@/types';

// --- UTILITY FUNCTIONS ---

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const calculateROI = (impact: number, effort: number): number => {
    if (effort === 0) return impact * 10;
    return Math.round((impact / effort) * 10) / 10;
};

// --- INITIAL DATA ---

const initialProjects: Project[] = [
    {
        id: 'proj-demo-1',
        name: 'AthenaPeX Core Development',
        description: 'Main development of the AthenaPeX productivity platform',
        emoji: '🚀',
        status: 'active',
        priority: 'critical',
        impactScore: 9,
        roiScore: 8.5,
        owner: 'Natasha (ENTJ)',
        tags: ['core', 'development', 'priority'],
        startDate: '2024-01-01',
        deadline: '2024-03-31',
        createdAt: Date.now() - 86400000 * 30,
        updatedAt: Date.now(),
        tasksCount: 12,
        completedTasksCount: 5,
        linkedPrompts: [],
        linkedYoutubeRefs: [],
    },
];

const initialTasks: Task[] = [
    {
        id: 'task-demo-1',
        projectId: 'proj-demo-1',
        name: 'Implement Analytics Dashboard',
        description: 'Create comprehensive productivity analytics with heatmaps and insights',
        emoji: '📊',
        status: 'in_progress',
        priority: 'high',
        impactScore: 8,
        effortScore: 5,
        roiScore: 1.6,
        owner: 'Natasha (ENTJ)',
        tags: ['analytics', 'ui', 'high-impact'],
        estimatedMinutes: 240,
        blockers: [],
        dependencies: [],
        createdAt: Date.now() - 86400000 * 5,
        updatedAt: Date.now(),
    },
    {
        id: 'task-demo-2',
        projectId: 'proj-demo-1',
        name: 'Build ENTJ Battle Plan Generator',
        description: 'Create aggressive sprint planning system with ROI optimization',
        emoji: '⚔️',
        status: 'pending',
        priority: 'critical',
        impactScore: 9,
        effortScore: 4,
        roiScore: 2.25,
        owner: 'Natasha (ENTJ)',
        tags: ['planning', 'entj', 'automation'],
        estimatedMinutes: 180,
        blockers: [],
        dependencies: [],
        createdAt: Date.now() - 86400000 * 3,
        updatedAt: Date.now(),
    },
];

// --- STORE INTERFACE ---

interface ProjectsState {
    projects: Project[];
    tasks: Task[];
    taskLogs: TaskLog[];
    selectedProjectId: string | null;
    selectedTaskId: string | null;

    actions: {
        // Projects
        addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasksCount' | 'completedTasksCount'>) => string;
        updateProject: (id: string, updates: Partial<Project>) => void;
        deleteProject: (id: string) => void;
        archiveProject: (id: string) => void;
        setSelectedProject: (id: string | null) => void;

        // Tasks
        addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'roiScore'>) => string;
        updateTask: (id: string, updates: Partial<Task>) => void;
        deleteTask: (id: string) => void;
        startTask: (id: string) => void;
        completeTask: (id: string, actualMinutes?: number) => void;
        blockTask: (id: string, blocker: string) => void;
        setSelectedTask: (id: string | null) => void;

        // Task Logs
        logTaskAction: (taskId: string, action: TaskLog['action'], notes?: string) => void;

        // Utilities
        getProjectTasks: (projectId: string) => Task[];
        getHighROITasks: (limit?: number) => Task[];
    };
}

// --- ZUSTAND STORE ---

export const useProjectsStore = create<ProjectsState>()(
    devtools(
        persist(
            (set, get) => ({
                projects: initialProjects,
                tasks: initialTasks,
                taskLogs: [],
                selectedProjectId: null,
                selectedTaskId: null,

                actions: {
                    // Projects
                    addProject: (project) => {
                        const id = generateId();
                        const newProject: Project = {
                            ...project,
                            id,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            tasksCount: 0,
                            completedTasksCount: 0,
                            roiScore: calculateROI(project.impactScore, 5),
                        };
                        set((state) => ({
                            projects: [newProject, ...state.projects],
                        }));
                        return id;
                    },

                    updateProject: (id, updates) =>
                        set((state) => ({
                            projects: state.projects.map((p) =>
                                p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
                            ),
                        })),

                    deleteProject: (id) =>
                        set((state) => ({
                            projects: state.projects.filter((p) => p.id !== id),
                            tasks: state.tasks.filter((t) => t.projectId !== id),
                        })),

                    archiveProject: (id) =>
                        set((state) => ({
                            projects: state.projects.map((p) =>
                                p.id === id ? { ...p, status: 'archived', updatedAt: Date.now() } : p
                            ),
                        })),

                    setSelectedProject: (id) => set({ selectedProjectId: id }),

                    // Tasks
                    addTask: (task) => {
                        const id = generateId();
                        const roiScore = calculateROI(task.impactScore, task.effortScore);
                        const newTask: Task = {
                            ...task,
                            id,
                            roiScore,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                        };
                        set((state) => ({
                            tasks: [newTask, ...state.tasks],
                            projects: state.projects.map((p) =>
                                p.id === task.projectId
                                    ? { ...p, tasksCount: p.tasksCount + 1, updatedAt: Date.now() }
                                    : p
                            ),
                        }));
                        get().actions.logTaskAction(id, 'created');
                        return id;
                    },

                    updateTask: (id, updates) => {
                        set((state) => {
                            const task = state.tasks.find((t) => t.id === id);
                            if (!task) return state;

                            const newImpact = updates.impactScore ?? task.impactScore;
                            const newEffort = updates.effortScore ?? task.effortScore;
                            const roiScore = calculateROI(newImpact, newEffort);

                            return {
                                tasks: state.tasks.map((t) =>
                                    t.id === id
                                        ? { ...t, ...updates, roiScore, updatedAt: Date.now() }
                                        : t
                                ),
                            };
                        });
                        get().actions.logTaskAction(id, 'updated');
                    },

                    deleteTask: (id) => {
                        const task = get().tasks.find((t) => t.id === id);
                        set((state) => ({
                            tasks: state.tasks.filter((t) => t.id !== id),
                            projects: task
                                ? state.projects.map((p) =>
                                    p.id === task.projectId
                                        ? { ...p, tasksCount: Math.max(0, p.tasksCount - 1), updatedAt: Date.now() }
                                        : p
                                )
                                : state.projects,
                        }));
                    },

                    startTask: (id) => {
                        set((state) => ({
                            tasks: state.tasks.map((t) =>
                                t.id === id
                                    ? { ...t, status: 'in_progress', startedAt: Date.now(), updatedAt: Date.now() }
                                    : t
                            ),
                        }));
                        get().actions.logTaskAction(id, 'started');
                    },

                    completeTask: (id, actualMinutes) => {
                        const task = get().tasks.find((t) => t.id === id);
                        set((state) => ({
                            tasks: state.tasks.map((t) =>
                                t.id === id
                                    ? {
                                        ...t,
                                        status: 'completed',
                                        completedAt: Date.now(),
                                        actualMinutes: actualMinutes ?? t.actualMinutes,
                                        updatedAt: Date.now(),
                                    }
                                    : t
                            ),
                            projects: task
                                ? state.projects.map((p) =>
                                    p.id === task.projectId
                                        ? { ...p, completedTasksCount: p.completedTasksCount + 1, updatedAt: Date.now() }
                                        : p
                                )
                                : state.projects,
                        }));
                        get().actions.logTaskAction(id, 'completed');
                    },

                    blockTask: (id, blocker) => {
                        set((state) => ({
                            tasks: state.tasks.map((t) =>
                                t.id === id
                                    ? {
                                        ...t,
                                        status: 'blocked',
                                        blockers: [...t.blockers, blocker],
                                        updatedAt: Date.now(),
                                    }
                                    : t
                            ),
                        }));
                        get().actions.logTaskAction(id, 'blocked', blocker);
                    },

                    setSelectedTask: (id) => set({ selectedTaskId: id }),

                    // Task Logs
                    logTaskAction: (taskId, action, notes) => {
                        const log: TaskLog = {
                            id: generateId(),
                            taskId,
                            action,
                            notes,
                            timestamp: Date.now(),
                        };
                        set((state) => ({
                            taskLogs: [log, ...state.taskLogs],
                        }));
                    },

                    // Utilities
                    getProjectTasks: (projectId) =>
                        get().tasks.filter((t) => t.projectId === projectId),

                    getHighROITasks: (limit = 10) =>
                        [...get().tasks]
                            .filter((t) => t.status !== 'completed' && t.status !== 'cancelled')
                            .sort((a, b) => b.roiScore - a.roiScore)
                            .slice(0, limit),
                },
            }),
            {
                name: 'pex-os-projects',
                partialize: (state) => ({
                    projects: state.projects,
                    tasks: state.tasks,
                    taskLogs: state.taskLogs,
                }),
            }
        ),
        { name: 'ProjectsStore' }
    )
);

// Selector hooks
export const useProjects = () => useProjectsStore((s) => s.projects);
export const useTasks = () => useProjectsStore((s) => s.tasks);
export const useProjectsActions = () => useProjectsStore((s) => s.actions);
