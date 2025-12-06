// ============================================================================
// ATHENAPEX - AGENT STORE
// ATHENA Architecture | AI Agent Domain
// ============================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AgentStatus, AgentTask, NeovimConfig } from '@/types';

// --- UTILITY FUNCTIONS ---

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// --- STORE INTERFACE ---

interface AgentState {
    agentStatus: AgentStatus;
    agentTasks: AgentTask[];
    neovimConfigs: NeovimConfig[];

    actions: {
        // Agent Status
        setAgentStatus: (status: Partial<AgentStatus>) => void;

        // Agent Tasks
        addAgentTask: (task: Omit<AgentTask, 'id' | 'createdAt'>) => string;
        updateAgentTask: (id: string, updates: Partial<AgentTask>) => void;

        // Neovim
        addNeovimConfig: (config: Omit<NeovimConfig, 'id' | 'createdAt' | 'updatedAt'>) => string;
        updateNeovimConfig: (id: string, updates: Partial<NeovimConfig>) => void;
        deleteNeovimConfig: (id: string) => void;
    };
}

// --- ZUSTAND STORE ---

export const useAgentStore = create<AgentState>()(
    devtools(
        persist(
            (set) => ({
                agentStatus: {
                    connected: false,
                    agentName: 'Fara-7B',
                    agentVersion: '1.0.0',
                    capabilities: ['file_generation', 'code_refactor', 'macro_execution'],
                    lastPing: 0,
                    queuedTasks: 0,
                },
                agentTasks: [],
                neovimConfigs: [],

                actions: {
                    // Agent Status
                    setAgentStatus: (status) =>
                        set((state) => ({
                            agentStatus: { ...state.agentStatus, ...status },
                        })),

                    // Agent Tasks
                    addAgentTask: (task) => {
                        const id = generateId();
                        const newTask: AgentTask = {
                            ...task,
                            id,
                            createdAt: Date.now(),
                        };
                        set((state) => ({
                            agentTasks: [newTask, ...state.agentTasks],
                            agentStatus: {
                                ...state.agentStatus,
                                queuedTasks: state.agentStatus.queuedTasks + 1,
                            },
                        }));
                        return id;
                    },

                    updateAgentTask: (id, updates) =>
                        set((state) => ({
                            agentTasks: state.agentTasks.map((t) =>
                                t.id === id ? { ...t, ...updates } : t
                            ),
                        })),

                    // Neovim
                    addNeovimConfig: (config) => {
                        const id = generateId();
                        const newConfig: NeovimConfig = {
                            ...config,
                            id,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                        };
                        set((state) => ({
                            neovimConfigs: [newConfig, ...state.neovimConfigs],
                        }));
                        return id;
                    },

                    updateNeovimConfig: (id, updates) =>
                        set((state) => ({
                            neovimConfigs: state.neovimConfigs.map((c) =>
                                c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
                            ),
                        })),

                    deleteNeovimConfig: (id) =>
                        set((state) => ({
                            neovimConfigs: state.neovimConfigs.filter((c) => c.id !== id),
                        })),
                },
            }),
            {
                name: 'pex-os-agent',
                partialize: (state) => ({
                    neovimConfigs: state.neovimConfigs,
                }),
            }
        ),
        { name: 'AgentStore' }
    )
);

// Selector hooks
export const useAgentStatus = () => useAgentStore((s) => s.agentStatus);
export const useAgentTasks = () => useAgentStore((s) => s.agentTasks);
export const useNeovimConfigs = () => useAgentStore((s) => s.neovimConfigs);
export const useAgentActions = () => useAgentStore((s) => s.actions);
