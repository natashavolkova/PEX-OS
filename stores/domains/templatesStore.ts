// ============================================================================
// ATHENAPEX - TEMPLATES STORE
// ATHENA Architecture | Strategic Templates Domain
// ============================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { StrategicTemplate } from '@/types';

// --- UTILITY FUNCTIONS ---

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// --- INITIAL DATA ---

const initialTemplates: StrategicTemplate[] = [
    {
        id: 'tpl-mvp-react',
        name: 'Micro-MVP React App',
        category: 'mvp',
        description: 'Minimal viable product template for React applications',
        emoji: '⚛️',
        content: `# {{projectName}} - Micro-MVP

## Core Value Proposition
{{valueProposition}}

## Target User
{{targetUser}}

## MVP Features (Max 3)
1. {{feature1}}
2. {{feature2}}
3. {{feature3}}

## Tech Stack
- React 18 + TypeScript
- {{stateManagement}}
- {{styling}}

## Timeline: {{timeline}} days

## Success Metrics
- {{metric1}}
- {{metric2}}`,
        variables: [
            { name: 'projectName', description: 'Project name', type: 'text', required: true },
            { name: 'valueProposition', description: 'Core value proposition', type: 'textarea', required: true },
            { name: 'targetUser', description: 'Target user persona', type: 'text', required: true },
            { name: 'feature1', description: 'MVP Feature 1', type: 'text', required: true },
            { name: 'feature2', description: 'MVP Feature 2', type: 'text', required: false },
            { name: 'feature3', description: 'MVP Feature 3', type: 'text', required: false },
            { name: 'stateManagement', description: 'State management', type: 'select', options: ['Zustand', 'Redux', 'Context API', 'Jotai'], required: true },
            { name: 'styling', description: 'Styling solution', type: 'select', options: ['Tailwind CSS', 'Styled Components', 'CSS Modules'], required: true },
            { name: 'timeline', description: 'Timeline in days', type: 'number', required: true },
            { name: 'metric1', description: 'Success metric 1', type: 'text', required: true },
            { name: 'metric2', description: 'Success metric 2', type: 'text', required: false },
        ],
        tags: ['react', 'mvp', 'development'],
        usageCount: 0,
        avgRating: 0,
        isCustom: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        id: 'tpl-impact-matrix',
        name: 'Impact vs Effort Matrix',
        category: 'matrix',
        description: 'ENTJ-style prioritization matrix',
        emoji: '📈',
        content: `# Impact vs Effort Matrix: {{projectName}}

## Quick Wins (High Impact, Low Effort) ⚡
Execute immediately:
{{quickWins}}

## Strategic Projects (High Impact, High Effort) 🎯
Schedule and resource:
{{strategic}}

## Fill-Ins (Low Impact, Low Effort) 📝
Do when time permits:
{{fillIns}}

## Time Wasters (Low Impact, High Effort) 🚫
ELIMINATE or DELEGATE:
{{eliminate}}

---

## ENTJ Decision Rules:
1. Quick Wins first - immediate ROI
2. Strategic Projects - schedule in focused blocks
3. Fill-Ins - delegate or batch
4. Time Wasters - ruthlessly eliminate

## Action Items:
{{actionItems}}`,
        variables: [
            { name: 'projectName', description: 'Project or context name', type: 'text', required: true },
            { name: 'quickWins', description: 'Quick wins list', type: 'textarea', required: true },
            { name: 'strategic', description: 'Strategic projects list', type: 'textarea', required: true },
            { name: 'fillIns', description: 'Fill-in tasks list', type: 'textarea', required: false },
            { name: 'eliminate', description: 'Items to eliminate', type: 'textarea', required: true },
            { name: 'actionItems', description: 'Immediate action items', type: 'textarea', required: true },
        ],
        tags: ['prioritization', 'matrix', 'entj'],
        usageCount: 0,
        avgRating: 0,
        isCustom: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
];

// --- STORE INTERFACE ---

interface TemplatesState {
    templates: StrategicTemplate[];

    actions: {
        addTemplate: (template: Omit<StrategicTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'avgRating'>) => string;
        updateTemplate: (id: string, updates: Partial<StrategicTemplate>) => void;
        deleteTemplate: (id: string) => void;
        useTemplate: (id: string) => void;
    };
}

// --- ZUSTAND STORE ---

export const useTemplatesStore = create<TemplatesState>()(
    devtools(
        persist(
            (set) => ({
                templates: initialTemplates,

                actions: {
                    addTemplate: (template) => {
                        const id = generateId();
                        const newTemplate: StrategicTemplate = {
                            ...template,
                            id,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            usageCount: 0,
                            avgRating: 0,
                        };
                        set((state) => ({
                            templates: [newTemplate, ...state.templates],
                        }));
                        return id;
                    },

                    updateTemplate: (id, updates) =>
                        set((state) => ({
                            templates: state.templates.map((t) =>
                                t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
                            ),
                        })),

                    deleteTemplate: (id) =>
                        set((state) => ({
                            templates: state.templates.filter((t) => t.id !== id),
                        })),

                    useTemplate: (id) =>
                        set((state) => ({
                            templates: state.templates.map((t) =>
                                t.id === id ? { ...t, usageCount: t.usageCount + 1 } : t
                            ),
                        })),
                },
            }),
            {
                name: 'pex-os-templates',
                partialize: (state) => ({
                    templates: state.templates,
                }),
            }
        ),
        { name: 'TemplatesStore' }
    )
);

// Selector hooks
export const useTemplates = () => useTemplatesStore((s) => s.templates);
export const useTemplatesActions = () => useTemplatesStore((s) => s.actions);
