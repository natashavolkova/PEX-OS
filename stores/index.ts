// ============================================================================
// ATHENAPEX - STORES INDEX
// Central export for all Zustand stores
// ============================================================================

// Theme
export { useThemeStore } from './useThemeStore';

// User
export { useUserStore, useUser, useIsAuthenticated } from './useUserStore';

// UI
export { useUIStore, useSidebarCollapsed, useSearchOpen, useNotifications } from './useUIStore';

// Prompts
export { usePromptStore, usePromptManagerStore } from './usePromptStore';

// Projects
export { useProjectStore, useProductivityStore } from './useProjectStore';
