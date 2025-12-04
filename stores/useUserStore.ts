// ============================================================================
// ATHENAPEX - USER STORE
// User session and profile management with persistence
// ============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'user' | 'guest';
    preferences: {
        timezone: string;
        locale: string;
        notifications: boolean;
    };
}

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    lastActivity: number;

    // Actions
    setUser: (user: User | null) => void;
    updateUser: (updates: Partial<User>) => void;
    updatePreferences: (prefs: Partial<User['preferences']>) => void;
    login: (user: User) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    updateActivity: () => void;
}

const defaultPreferences: User['preferences'] = {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: 'pt-BR',
    notifications: true,
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            lastActivity: Date.now(),

            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                lastActivity: Date.now(),
            }),

            updateUser: (updates) => set((state) => ({
                user: state.user ? { ...state.user, ...updates } : null,
                lastActivity: Date.now(),
            })),

            updatePreferences: (prefs) => set((state) => ({
                user: state.user ? {
                    ...state.user,
                    preferences: { ...state.user.preferences, ...prefs },
                } : null,
            })),

            login: (user) => set({
                user,
                isAuthenticated: true,
                isLoading: false,
                lastActivity: Date.now(),
            }),

            logout: () => set({
                user: null,
                isAuthenticated: false,
                lastActivity: Date.now(),
            }),

            setLoading: (loading) => set({ isLoading: loading }),

            updateActivity: () => set({ lastActivity: Date.now() }),
        }),
        {
            name: 'athenapex-user',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

// Selector hooks
export const useUser = () => useUserStore((s) => s.user);
export const useIsAuthenticated = () => useUserStore((s) => s.isAuthenticated);
