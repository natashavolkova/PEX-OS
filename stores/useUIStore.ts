// ============================================================================
// ATHENAPEX - UI STORE
// Global UI state: sidebar, modals, search, notifications
// ============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModalState {
    isOpen: boolean;
    data?: unknown;
}

interface UIState {
    // Sidebar
    sidebarCollapsed: boolean;
    sidebarHovered: boolean;

    // Search
    searchOpen: boolean;
    searchQuery: string;
    searchResults: unknown[];

    // Modals
    modals: {
        settings: ModalState;
        newProject: ModalState;
        newTask: ModalState;
        newPrompt: ModalState;
        commandPalette: ModalState;
        confirmDelete: ModalState;
    };

    // Notifications
    notifications: Array<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message?: string;
        duration?: number;
    }>;

    // Loading States
    isLoading: boolean;
    loadingMessage: string;

    // Actions
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    setSidebarHovered: (hovered: boolean) => void;

    openSearch: () => void;
    closeSearch: () => void;
    setSearchQuery: (query: string) => void;
    setSearchResults: (results: unknown[]) => void;

    openModal: (modal: keyof UIState['modals'], data?: unknown) => void;
    closeModal: (modal: keyof UIState['modals']) => void;
    closeAllModals: () => void;

    addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;

    setLoading: (loading: boolean, message?: string) => void;
}

const initialModals: UIState['modals'] = {
    settings: { isOpen: false },
    newProject: { isOpen: false },
    newTask: { isOpen: false },
    newPrompt: { isOpen: false },
    commandPalette: { isOpen: false },
    confirmDelete: { isOpen: false },
};

export const useUIStore = create<UIState>()(
    persist(
        (set, get) => ({
            // Initial State
            sidebarCollapsed: false,
            sidebarHovered: false,
            searchOpen: false,
            searchQuery: '',
            searchResults: [],
            modals: initialModals,
            notifications: [],
            isLoading: false,
            loadingMessage: '',

            // Sidebar Actions
            toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
            setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
            setSidebarHovered: (hovered) => set({ sidebarHovered: hovered }),

            // Search Actions
            openSearch: () => set({ searchOpen: true }),
            closeSearch: () => set({ searchOpen: false, searchQuery: '', searchResults: [] }),
            setSearchQuery: (query) => set({ searchQuery: query }),
            setSearchResults: (results) => set({ searchResults: results }),

            // Modal Actions
            openModal: (modal, data) => set((s) => ({
                modals: {
                    ...s.modals,
                    [modal]: { isOpen: true, data },
                },
            })),
            closeModal: (modal) => set((s) => ({
                modals: {
                    ...s.modals,
                    [modal]: { isOpen: false, data: undefined },
                },
            })),
            closeAllModals: () => set({ modals: initialModals }),

            // Notification Actions
            addNotification: (notification) => {
                const id = `notif-${Date.now()}`;
                set((s) => ({
                    notifications: [...s.notifications, { ...notification, id }],
                }));

                // Auto-remove after duration
                const duration = notification.duration ?? 5000;
                if (duration > 0) {
                    setTimeout(() => get().removeNotification(id), duration);
                }
            },
            removeNotification: (id) => set((s) => ({
                notifications: s.notifications.filter((n) => n.id !== id),
            })),
            clearNotifications: () => set({ notifications: [] }),

            // Loading Actions
            setLoading: (loading, message = '') => set({
                isLoading: loading,
                loadingMessage: message,
            }),
        }),
        {
            name: 'athenapex-ui',
            partialize: (state) => ({
                sidebarCollapsed: state.sidebarCollapsed,
            }),
        }
    )
);

// Selector hooks
export const useSidebarCollapsed = () => useUIStore((s) => s.sidebarCollapsed);
export const useSearchOpen = () => useUIStore((s) => s.searchOpen);
export const useNotifications = () => useUIStore((s) => s.notifications);
