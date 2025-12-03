import prisma from '@/lib/prisma';

export interface Task {
    id: string;
    title: string;
    status: 'todo' | 'in-progress' | 'done' | 'blocked';
    priority: 'low' | 'medium' | 'high' | 'critical';
    dueDate?: string;
    tags: string[];
    createdAt: number;
    updatedAt: number;
}

export const TaskService = {
    fetchTasks: async (): Promise<Task[]> => {
        const tasks = await prisma.task.findMany();
        return tasks.map(t => ({
            id: t.id,
            title: t.title,
            status: t.status as 'todo' | 'in-progress' | 'done' | 'blocked',
            priority: t.priority as 'low' | 'medium' | 'high' | 'critical',
            dueDate: t.dueDate?.toISOString(),
            tags: t.tags,
            createdAt: t.createdAt.getTime(),
            updatedAt: t.updatedAt.getTime(),
        }));
    },

    createTask: async (task: Partial<Task>): Promise<Task> => {
        const newTask = await prisma.task.create({
            data: {
                title: task.title || 'New Task',
                status: task.status || 'todo',
                priority: task.priority || 'medium',
                tags: task.tags || [],
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
                userId: 'user-1', // TODO: Get from Stack Auth
            }
        });

        return {
            id: newTask.id,
            title: newTask.title,
            status: newTask.status as 'todo' | 'in-progress' | 'done' | 'blocked',
            priority: newTask.priority as 'low' | 'medium' | 'high' | 'critical',
            dueDate: newTask.dueDate?.toISOString(),
            tags: newTask.tags,
            createdAt: newTask.createdAt.getTime(),
            updatedAt: newTask.updatedAt.getTime(),
        };
    },

    updateTask: async (id: string, updates: Partial<Task>): Promise<Task | null> => {
        try {
            const updatedTask = await prisma.task.update({
                where: { id },
                data: {
                    title: updates.title,
                    status: updates.status,
                    priority: updates.priority,
                    tags: updates.tags,
                    dueDate: updates.dueDate ? new Date(updates.dueDate) : undefined,
                }
            });

            return {
                id: updatedTask.id,
                title: updatedTask.title,
                status: updatedTask.status as 'todo' | 'in-progress' | 'done' | 'blocked',
                priority: updatedTask.priority as 'low' | 'medium' | 'high' | 'critical',
                dueDate: updatedTask.dueDate?.toISOString(),
                tags: updatedTask.tags,
                createdAt: updatedTask.createdAt.getTime(),
                updatedAt: updatedTask.updatedAt.getTime(),
            };
        } catch (e) {
            return null;
        }
    },

    deleteTask: async (id: string): Promise<boolean> => {
        try {
            await prisma.task.delete({ where: { id } });
            return true;
        } catch (e) {
            return false;
        }
    }
};
