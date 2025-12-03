import prisma from '@/lib/prisma';

export interface Project {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'archived' | 'completed';
    progress: number;
    members: number;
    dueDate?: string;
    createdAt: number;
    updatedAt: number;
}

export const ProjectService = {
    fetchProjects: async (): Promise<Project[]> => {
        const projects = await prisma.project.findMany();
        return projects.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description || '',
            status: p.status as 'active' | 'archived' | 'completed',
            progress: p.progress,
            members: p.members,
            dueDate: p.dueDate?.toISOString(),
            createdAt: p.createdAt.getTime(),
            updatedAt: p.updatedAt.getTime(),
        }));
    },

    createProject: async (project: Partial<Project>): Promise<Project> => {
        const newProject = await prisma.project.create({
            data: {
                name: project.name || 'New Project',
                description: project.description,
                status: project.status || 'active',
                progress: project.progress || 0,
                members: project.members || 1,
                dueDate: project.dueDate ? new Date(project.dueDate) : undefined,
                userId: 'user-1', // TODO: Get from Stack Auth
            }
        });

        return {
            id: newProject.id,
            name: newProject.name,
            description: newProject.description || '',
            status: newProject.status as 'active' | 'archived' | 'completed',
            progress: newProject.progress,
            members: newProject.members,
            dueDate: newProject.dueDate?.toISOString(),
            createdAt: newProject.createdAt.getTime(),
            updatedAt: newProject.updatedAt.getTime(),
        };
    },

    getProject: async (id: string): Promise<Project | null> => {
        const project = await prisma.project.findUnique({ where: { id } });
        if (!project) return null;

        return {
            id: project.id,
            name: project.name,
            description: project.description || '',
            status: project.status as 'active' | 'archived' | 'completed',
            progress: project.progress,
            members: project.members,
            dueDate: project.dueDate?.toISOString(),
            createdAt: project.createdAt.getTime(),
            updatedAt: project.updatedAt.getTime(),
        };
    }
};
