// ============================================================================
// SEED DEMO PROJECT DATA - TURSO/SQLITE
// Run: npx tsx lib/db/seed-demo-project.ts
// Populates Turso with matching data from the mock store
// ============================================================================

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@libsql/client';

const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

const ATHENA_USER_ID = 'athena-supreme-user-001';

async function seedDemoData() {
    console.log('🚀 Seeding demo project data to Turso...');

    try {
        // 1. Insert the demo project (matching mock ID)
        await client.execute({
            sql: `INSERT OR REPLACE INTO projects 
                (id, name, description, status, progress, roi_score, members, due_date, created_at, updated_at, user_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                'proj-demo-1',
                'AthenaPeX Core Development',
                'Main development of the AthenaPeX productivity platform',
                'active',
                42, // 5/12 tasks = ~42%
                85, // roiScore * 10 to store as integer
                1,
                '2024-03-31',
                new Date().toISOString(),
                new Date().toISOString(),
                ATHENA_USER_ID
            ]
        });
        console.log('✅ Project inserted: proj-demo-1');

        // 2. Insert demo tasks
        const tasks = [
            {
                id: 'task-demo-1',
                title: 'Implement Analytics Dashboard',
                status: 'in_progress',
                priority: 'high',
                dueDate: '2024-02-15',
            },
            {
                id: 'task-demo-2',
                title: 'Build ENTJ Battle Plan Generator',
                status: 'todo',
                priority: 'critical',
                dueDate: '2024-02-20',
            },
            {
                id: 'task-demo-3',
                title: 'Create Project War Room UI',
                status: 'completed',
                priority: 'high',
                dueDate: null,
            },
            {
                id: 'task-demo-4',
                title: 'Integrate Turso DB Relations',
                status: 'completed',
                priority: 'medium',
                dueDate: null,
            },
            {
                id: 'task-demo-5',
                title: 'Setup API Route for Projects',
                status: 'completed',
                priority: 'medium',
                dueDate: null,
            },
        ];

        for (const task of tasks) {
            await client.execute({
                sql: `INSERT OR REPLACE INTO tasks 
                    (id, title, status, priority, due_date, tags, project_id, created_at, updated_at, user_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [
                    task.id,
                    task.title,
                    task.status,
                    task.priority,
                    task.dueDate,
                    '[]',
                    'proj-demo-1', // Link to project
                    new Date().toISOString(),
                    new Date().toISOString(),
                    ATHENA_USER_ID
                ]
            });
            console.log(`✅ Task inserted: ${task.id} - ${task.title}`);
        }

        // 3. Insert battle plan for the project
        await client.execute({
            sql: `INSERT OR REPLACE INTO battle_plans 
                (id, title, content, status, project_id, created_at, updated_at, user_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                'battleplan-demo-1',
                'AthenaPeX Sprint Q1 2024',
                `# 🎯 Objetivo: Lançar MVP até Março

## Prioridades
1. **Analytics Dashboard** - Visualização de produtividade
2. **Battle Plan Generator** - Planejamento ENTJ agressivo
3. **War Room UI** - Interface de detalhes do projeto

## Métricas de Sucesso
- [ ] 5 projetos ativos
- [ ] 20 tasks completas
- [ ] ROI médio > 7.0

## Riscos
- Tempo limitado
- Scope creep

---
*Gerado por ATHENA*`,
                'active',
                'proj-demo-1',
                new Date().toISOString(),
                new Date().toISOString(),
                ATHENA_USER_ID
            ]
        });
        console.log('✅ Battle Plan inserted: battleplan-demo-1');

        console.log('🎉 Demo data seeded successfully!');
        console.log('📊 Summary: 1 project, 5 tasks (3 completed), 1 battle plan');

    } catch (error) {
        console.error('❌ Seed failed:', error);
        throw error;
    }
}

seedDemoData();
