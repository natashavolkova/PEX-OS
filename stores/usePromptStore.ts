// ============================================================================
// ATHENAPEX - PROMPT STORE
// Simplified prompt store (delegates to promptManager for complex operations)
// ============================================================================

import { create } from 'zustand';

interface PromptFilter {
    search: string;
    category: string | null;
    tags: string[];
    sortBy: 'name' | 'date' | 'category';
    sortOrder: 'asc' | 'desc';
}

interface PromptStoreState {
    // Filters
    filters: PromptFilter;

    // UI State
    selectedPromptId: string | null;
    isEditing: boolean;
    editorContent: string;

    // Actions
    setFilter: <K extends keyof PromptFilter>(key: K, value: PromptFilter[K]) => void;
    resetFilters: () => void;
    setSelectedPrompt: (id: string | null) => void;
    setIsEditing: (editing: boolean) => void;
    setEditorContent: (content: string) => void;
}

const defaultFilters: PromptFilter = {
    search: '',
    category: null,
    tags: [],
    sortBy: 'date',
    sortOrder: 'desc',
};

export const usePromptStore = create<PromptStoreState>((set) => ({
    filters: defaultFilters,
    selectedPromptId: null,
    isEditing: false,
    editorContent: '',

    setFilter: (key, value) => set((s) => ({
        filters: { ...s.filters, [key]: value },
    })),

    resetFilters: () => set({ filters: defaultFilters }),

    setSelectedPrompt: (id) => set({ selectedPromptId: id }),

    setIsEditing: (editing) => set({ isEditing: editing }),

    setEditorContent: (content) => set({ editorContent: content }),
}));

// Re-export main store for complex operations
export { usePromptManagerStore } from './promptManager';
