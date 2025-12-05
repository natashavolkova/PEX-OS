// ============================================================================
// ATHENAPEX - DATABASE SEED SCRIPT
// Populates initial data for Athena admin user
// ============================================================================

import prisma from '../lib/prisma';

const ADMIN_USER_ID = 'athena-admin-001';

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Create Admin User
    const user = await prisma.user.upsert({
        where: { id: ADMIN_USER_ID },
        update: {},
        create: {
            id: ADMIN_USER_ID,
            email: 'natashavolkova771@gmail.com',
            name: 'Athena',
        },
    });
    console.log('✅ User created:', user.name);

    // 2. Create Folders
    const promptFolder = await prisma.folder.upsert({
        where: { id: 'folder-prompts-001' },
        update: {},
        create: {
            id: 'folder-prompts-001',
            name: 'AI Development',
            userId: ADMIN_USER_ID,
        },
    });
    console.log('✅ Folder created:', promptFolder.name);

    // 3. Create Prompts (5)
    const prompts = [
        {
            id: 'prompt-001',
            title: 'Code Review Expert',
            content: 'You are a senior software engineer specializing in code review. Analyze the following code for: 1) Performance issues, 2) Security vulnerabilities, 3) Code style and best practices, 4) Potential bugs. Provide specific line-by-line feedback.',
            tags: ['code-review', 'development', 'quality'],
        },
        {
            id: 'prompt-002',
            title: 'API Design Architect',
            content: 'Design a RESTful API for the following requirements. Include: endpoints, HTTP methods, request/response schemas, authentication strategy, rate limiting, and error handling. Follow OpenAPI 3.0 specification.',
            tags: ['api', 'architecture', 'design'],
        },
        {
            id: 'prompt-003',
            title: 'TypeScript Type Generator',
            content: 'Generate TypeScript types/interfaces for the following data structures. Include: proper naming conventions, optional properties, union types where appropriate, JSDoc comments, and export statements.',
            tags: ['typescript', 'types', 'codegen'],
        },
        {
            id: 'prompt-004',
            title: 'SQL Query Optimizer',
            content: 'Optimize the following SQL query for performance. Consider: indexing strategies, query restructuring, avoiding N+1 problems, proper JOINs, and execution plan analysis. Provide the optimized query with explanations.',
            tags: ['sql', 'performance', 'database'],
        },
        {
            id: 'prompt-005',
            title: 'React Component Generator',
            content: 'Create a React component based on the following requirements. Use: TypeScript, functional components with hooks, proper prop typing, error boundaries, loading states, and accessibility (a11y) best practices.',
            tags: ['react', 'frontend', 'components'],
        },
    ];

    for (const prompt of prompts) {
        await prisma.prompt.upsert({
            where: { id: prompt.id },
            update: {},
            create: {
                id: prompt.id,
                title: prompt.title,
                content: prompt.content,
                tags: prompt.tags,
                userId: ADMIN_USER_ID,
                folderId: promptFolder.id,
            },
        });
    }
    console.log('✅ Prompts created:', prompts.length);

    // 4. Create Projects (3)
    const projects = [
        {
            id: 'project-001',
            name: 'AthenaPeX Core',
            description: 'Main productivity platform development',
            status: 'active',
        },
        {
            id: 'project-002',
            name: 'Neovim Config Generator',
            description: 'Tool for generating custom Neovim configurations',
            status: 'active',
        },
        {
            id: 'project-003',
            name: 'YouTube Knowledge Base',
            description: 'Curated collection of development tutorials',
            status: 'active',
        },
    ];

    for (const project of projects) {
        await prisma.project.upsert({
            where: { id: project.id },
            update: {},
            create: {
                id: project.id,
                name: project.name,
                description: project.description,
                status: project.status,
                userId: ADMIN_USER_ID,
            },
        });
    }
    console.log('✅ Projects created:', projects.length);

    // 5. Create Tasks (5)
    const tasks = [
        { id: 'task-001', title: 'Implement analytics API', status: 'completed' },
        { id: 'task-002', title: 'Design prompt editor UI', status: 'completed' },
        { id: 'task-003', title: 'Add YouTube video sync', status: 'in-progress' },
        { id: 'task-004', title: 'Create LSP config templates', status: 'todo' },
        { id: 'task-005', title: 'Write documentation', status: 'todo' },
    ];

    for (const task of tasks) {
        await prisma.task.upsert({
            where: { id: task.id },
            update: {},
            create: {
                id: task.id,
                title: task.title,
                status: task.status,
                userId: ADMIN_USER_ID,
            },
        });
    }
    console.log('✅ Tasks created:', tasks.length);

    // 6. Create Analytics Events (10+)
    const eventTypes = [
        { type: 'focus_start', duration: null },
        { type: 'focus_end', duration: 45 },
        { type: 'task_complete', duration: null, metadata: { taskId: 'task-001' } },
        { type: 'prompt_create', duration: null, metadata: { title: 'Code Review Expert' } },
        { type: 'prompt_update', duration: null, metadata: { title: 'API Design Architect' } },
        { type: 'task_complete', duration: null, metadata: { taskId: 'task-002' } },
        { type: 'project_create', duration: null, metadata: { name: 'AthenaPeX Core' } },
        { type: 'focus_start', duration: null },
        { type: 'focus_end', duration: 90 },
        { type: 'page_view', duration: null, metadata: { page: '/pex-os/analytics' } },
    ];

    // Clear old events first
    await prisma.analyticsEvent.deleteMany({ where: { userId: ADMIN_USER_ID } });

    for (let i = 0; i < eventTypes.length; i++) {
        const event = eventTypes[i];
        const createdAt = new Date();
        createdAt.setMinutes(createdAt.getMinutes() - (i * 30)); // Space events 30 min apart

        await prisma.analyticsEvent.create({
            data: {
                type: event.type,
                duration: event.duration,
                metadata: event.metadata ? JSON.parse(JSON.stringify(event.metadata)) : undefined,
                userId: ADMIN_USER_ID,
                createdAt,
            },
        });
    }
    console.log('✅ Analytics events created:', eventTypes.length);

    // 7. Create YouTube Videos (3)
    const videos = [
        {
            id: 'video-001',
            videoId: 'dQw4w9WgXcQ',
            title: 'Never Gonna Give You Up',
            channelName: 'Rick Astley',
            watchStatus: 'watched',
        },
        {
            id: 'video-002',
            videoId: 'Tn6-PIqc4UM',
            title: 'React in 100 Seconds',
            channelName: 'Fireship',
            watchStatus: 'unwatched',
        },
        {
            id: 'video-003',
            videoId: 'w7ejDZ8SWv8',
            title: 'TypeScript Tutorial',
            channelName: 'Traversy Media',
            watchStatus: 'watching',
        },
    ];

    for (const video of videos) {
        await prisma.youTubeVideo.upsert({
            where: { id: video.id },
            update: {},
            create: {
                id: video.id,
                videoId: video.videoId,
                title: video.title,
                channelName: video.channelName,
                watchStatus: video.watchStatus,
                userId: ADMIN_USER_ID,
            },
        });
    }
    console.log('✅ YouTube videos created:', videos.length);

    // 8. Create Neovim Config (1)
    await prisma.neovimConfig.upsert({
        where: { id: 'config-001' },
        update: {},
        create: {
            id: 'config-001',
            name: 'Athena Dev Setup',
            base: 'lazyvim',
            lspConfigs: ['typescript', 'rust', 'lua'],
            plugins: ['nvim-telescope/telescope.nvim', 'nvim-treesitter/nvim-treesitter'],
            content: '-- LazyVim Config\\n-- Generated by AthenaPeX',
            userId: ADMIN_USER_ID,
        },
    });
    console.log('✅ Neovim config created: 1');

    console.log('\\n🎉 Seed completed successfully!');
    console.log('\\n📊 Summary:');
    console.log('  - User: 1 (Athena)');
    console.log('  - Folders: 1');
    console.log('  - Prompts: 5');
    console.log('  - Projects: 3');
    console.log('  - Tasks: 5');
    console.log('  - Analytics Events: 10');
    console.log('  - YouTube Videos: 3');
    console.log('  - Neovim Configs: 1');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
