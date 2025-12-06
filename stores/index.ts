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

// Projects (UI state)
export { useProjectStore } from './useProjectStore';

// Productivity (Compatibility Layer - combines all domain stores)
export { useProductivityStore } from './productivityCompat';

// Domain Stores (Modular - PREFERRED)
export * from './domains';
