// ============================================================================
// ATHENAPEX - PROJECTS STORE TESTS
// Testing domain store for projects and tasks
// ============================================================================

import { act } from '@testing-library/react';
import { useProjectsStore } from '@/stores/domains/projectsStore';

describe('useProjectsStore', () => {
    beforeEach(() => {
        // Reset store before each test
        const { actions } = useProjectsStore.getState();
        useProjectsStore.setState({
            projects: [],
            tasks: [],
            taskLogs: [],
            selectedProjectId: null,
            selectedTaskId: null,
        });
    });

    describe('Project Actions', () => {
        it('should add a new project', () => {
            const { actions } = useProjectsStore.getState();

            const projectId = actions.addProject({
                name: 'Test Project',
                description: 'A test project',
                emoji: '🧪',
                status: 'active',
                priority: 'high',
                impactScore: 8,
                owner: 'Test User',
                tags: ['test'],
                startDate: '2024-01-01',
                linkedPrompts: [],
                linkedYoutubeRefs: [],
            });

            const { projects } = useProjectsStore.getState();
            expect(projects).toHaveLength(1);
            expect(projects[0].name).toBe('Test Project');
            expect(projects[0].id).toBe(projectId);
        });

        it('should update a project', () => {
            const { actions } = useProjectsStore.getState();

            const projectId = actions.addProject({
                name: 'Original Name',
                description: 'Original',
                status: 'active',
                priority: 'medium',
                impactScore: 5,
                owner: 'Test',
                tags: [],
                startDate: '2024-01-01',
                linkedPrompts: [],
                linkedYoutubeRefs: [],
            });

            actions.updateProject(projectId, { name: 'Updated Name' });

            const { projects } = useProjectsStore.getState();
            expect(projects[0].name).toBe('Updated Name');
        });

        it('should delete a project and its tasks', () => {
            const { actions } = useProjectsStore.getState();

            const projectId = actions.addProject({
                name: 'To Delete',
                description: '',
                status: 'active',
                priority: 'low',
                impactScore: 3,
                owner: 'Test',
                tags: [],
                startDate: '2024-01-01',
                linkedPrompts: [],
                linkedYoutubeRefs: [],
            });

            actions.addTask({
                projectId,
                name: 'Task to delete',
                description: '',
                status: 'pending',
                priority: 'medium',
                impactScore: 5,
                effortScore: 5,
                owner: 'Test',
                tags: [],
                blockers: [],
                dependencies: [],
            });

            actions.deleteProject(projectId);

            const { projects, tasks } = useProjectsStore.getState();
            expect(projects).toHaveLength(0);
            expect(tasks).toHaveLength(0);
        });
    });

    describe('Task Actions', () => {
        it('should add a task with calculated ROI', () => {
            const { actions } = useProjectsStore.getState();

            const projectId = actions.addProject({
                name: 'Project',
                description: '',
                status: 'active',
                priority: 'medium',
                impactScore: 5,
                owner: 'Test',
                tags: [],
                startDate: '2024-01-01',
                linkedPrompts: [],
                linkedYoutubeRefs: [],
            });

            actions.addTask({
                projectId,
                name: 'High ROI Task',
                description: '',
                status: 'pending',
                priority: 'critical',
                impactScore: 10,
                effortScore: 2,
                owner: 'Test',
                tags: [],
                blockers: [],
                dependencies: [],
            });

            const { tasks } = useProjectsStore.getState();
            expect(tasks).toHaveLength(1);
            expect(tasks[0].roiScore).toBe(5.0); // 10/2 = 5.0
        });

        it('should complete a task', () => {
            const { actions } = useProjectsStore.getState();

            const projectId = actions.addProject({
                name: 'Project',
                description: '',
                status: 'active',
                priority: 'medium',
                impactScore: 5,
                owner: 'Test',
                tags: [],
                startDate: '2024-01-01',
                linkedPrompts: [],
                linkedYoutubeRefs: [],
            });

            const taskId = actions.addTask({
                projectId,
                name: 'Task',
                description: '',
                status: 'pending',
                priority: 'medium',
                impactScore: 5,
                effortScore: 5,
                owner: 'Test',
                tags: [],
                blockers: [],
                dependencies: [],
            });

            actions.startTask(taskId);
            let { tasks } = useProjectsStore.getState();
            expect(tasks[0].status).toBe('in_progress');

            actions.completeTask(taskId);
            ({ tasks } = useProjectsStore.getState());
            expect(tasks[0].status).toBe('completed');
            expect(tasks[0].completedAt).toBeDefined();
        });

        it('should get high ROI tasks sorted correctly', () => {
            const { actions } = useProjectsStore.getState();

            const projectId = actions.addProject({
                name: 'Project',
                description: '',
                status: 'active',
                priority: 'medium',
                impactScore: 5,
                owner: 'Test',
                tags: [],
                startDate: '2024-01-01',
                linkedPrompts: [],
                linkedYoutubeRefs: [],
            });

            // Add tasks with different ROI scores
            actions.addTask({
                projectId,
                name: 'Low ROI',
                description: '',
                status: 'pending',
                priority: 'low',
                impactScore: 2,
                effortScore: 8,
                owner: 'Test',
                tags: [],
                blockers: [],
                dependencies: [],
            });

            actions.addTask({
                projectId,
                name: 'High ROI',
                description: '',
                status: 'pending',
                priority: 'high',
                impactScore: 9,
                effortScore: 3,
                owner: 'Test',
                tags: [],
                blockers: [],
                dependencies: [],
            });

            const highROITasks = actions.getHighROITasks(5);
            expect(highROITasks[0].name).toBe('High ROI');
        });
    });
});
