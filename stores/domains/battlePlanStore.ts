// ============================================================================
// ATHENAPEX - BATTLE PLANS STORE
// ATHENA Architecture | Battle Plans Domain
// ============================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { BattlePlan } from '@/types';

// --- UTILITY FUNCTIONS ---

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// --- INITIAL DATA ---

const initialBattlePlans: BattlePlan[] = [
    {
        id: 'bp-demo-1',
        name: 'Q1 Velocity Sprint',
        description: 'Maximum velocity sprint focusing on core feature delivery',
        type: 'sprint',
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        objectives: [
            {
                id: 'obj-1',
                name: 'Complete Analytics Dashboard',
                description: 'Ship full analytics with heatmaps',
                priority: 'critical',
                status: 'in_progress',
                linkedTasks: ['task-demo-1'],
                impactScore: 9,
                completionCriteria: 'Dashboard live with all metrics',
                blockers: [],
            },
        ],
        blockers: [],
        pivotTriggers: [
            {
                id: 'pt-1',
                condition: 'Velocity < 3 tasks/day for 3 consecutive days',
                action: 'Review blockers and redistribute tasks',
                triggered: false,
            },
        ],
        metrics: {
            objectivesTotal: 1,
            objectivesCompleted: 0,
            blockerCount: 0,
            pivotsExecuted: 0,
            progressPercentage: 25,
            velocityScore: 4.2,
        },
        createdAt: Date.now() - 86400000 * 10,
        updatedAt: Date.now(),
    },
];

// --- STORE INTERFACE ---

interface BattlePlanState {
    battlePlans: BattlePlan[];

    actions: {
        addBattlePlan: (plan: Omit<BattlePlan, 'id' | 'createdAt' | 'updatedAt'>) => string;
        updateBattlePlan: (id: string, updates: Partial<BattlePlan>) => void;
        deleteBattlePlan: (id: string) => void;
    };
}

// --- ZUSTAND STORE ---

export const useBattlePlanStore = create<BattlePlanState>()(
    devtools(
        persist(
            (set) => ({
                battlePlans: initialBattlePlans,

                actions: {
                    addBattlePlan: (plan) => {
                        const id = generateId();
                        const newPlan: BattlePlan = {
                            ...plan,
                            id,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                        };
                        set((state) => ({
                            battlePlans: [newPlan, ...state.battlePlans],
                        }));
                        return id;
                    },

                    updateBattlePlan: (id, updates) =>
                        set((state) => ({
                            battlePlans: state.battlePlans.map((p) =>
                                p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
                            ),
                        })),

                    deleteBattlePlan: (id) =>
                        set((state) => ({
                            battlePlans: state.battlePlans.filter((p) => p.id !== id),
                        })),
                },
            }),
            {
                name: 'pex-os-battleplans',
                partialize: (state) => ({
                    battlePlans: state.battlePlans,
                }),
            }
        ),
        { name: 'BattlePlanStore' }
    )
);

// Selector hooks
export const useBattlePlans = () => useBattlePlanStore((s) => s.battlePlans);
export const useBattlePlanActions = () => useBattlePlanStore((s) => s.actions);
