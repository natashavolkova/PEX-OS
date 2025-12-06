// ============================================================================
// ATHENAPEX - PROJECT STORE
// Simplified project store (delegates to productivityStore for complex operations)
// ============================================================================

import { create } from 'zustand';

type ProjectStatus = 'active' | 'completed' | 'archived' | 'on_hold';
type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';

interface ProjectFilter {
    search: string;
    status: ProjectStatus | null;
    priority: ProjectPriority | null;
    tags: string[];
    sortBy: 'name' | 'date' | 'priority' | 'roi';
    sortOrder: 'asc' | 'desc';
}

interface ProjectStoreState {
    // Filters
    filters: ProjectFilter;

    // UI State
    selectedProjectId: string | null;
    viewMode: 'grid' | 'list' | 'kanban';
    showCompleted: boolean;

    // Actions
    setFilter: <K extends keyof ProjectFilter>(key: K, value: ProjectFilter[K]) => void;
    resetFilters: () => void;
    setSelectedProject: (id: string | null) => void;
    setViewMode: (mode: ProjectStoreState['viewMode']) => void;
    toggleShowCompleted: () => void;
}

const defaultFilters: ProjectFilter = {
    search: '',
    status: null,
    priority: null,
    tags: [],
    sortBy: 'roi',
    sortOrder: 'desc',
};

export const useProjectStore = create<ProjectStoreState>((set) => ({
    filters: defaultFilters,
    selectedProjectId: null,
    viewMode: 'grid',
    showCompleted: false,

    setFilter: (key, value) => set((s) => ({
        filters: { ...s.filters, [key]: value },
    })),

    resetFilters: () => set({ filters: defaultFilters }),

    setSelectedProject: (id) => set({ selectedProjectId: id }),

    setViewMode: (mode) => set({ viewMode: mode }),

    toggleShowCompleted: () => set((s) => ({ showCompleted: !s.showCompleted })),
}));

// Re-export main store for complex operations (via compatibility layer)
export { useProductivityStore } from './productivityCompat';
