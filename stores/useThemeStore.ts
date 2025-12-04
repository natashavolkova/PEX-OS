// ============================================================================
// ATHENAPEX - THEME STORE
// Dark/Light mode with persistence
// ============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      resolvedTheme: 'dark',
      
      setTheme: (theme) => {
        const resolved = theme === 'system' 
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : theme;
        
        set({ theme, resolvedTheme: resolved });
        
        // Update DOM
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(resolved);
      },
      
      toggleTheme: () => {
        const current = get().resolvedTheme;
        const next = current === 'dark' ? 'light' : 'dark';
        get().setTheme(next);
      },
    }),
    {
      name: 'athenapex-theme',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
