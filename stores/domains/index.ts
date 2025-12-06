// ============================================================================
// ATHENAPEX - DOMAINS STORES BARREL EXPORT
// ATHENA Architecture | Modular Store Exports
// ============================================================================

// Projects & Tasks
export {
    useProjectsStore,
    useProjects,
    useTasks,
    useProjectsActions,
} from './projectsStore';

// YouTube
export {
    useYouTubeStore,
    useYouTubeRefs,
    useYouTubeActions,
} from './youtubeStore';

// Templates
export {
    useTemplatesStore,
    useTemplates,
    useTemplatesActions,
} from './templatesStore';

// Battle Plans
export {
    useBattlePlanStore,
    useBattlePlans,
    useBattlePlanActions,
} from './battlePlanStore';

// Analytics
export {
    useAnalyticsStore,
    useFocusWindows,
    useDailyMetrics,
    useInsights,
    useAnalyticsActions,
} from './analyticsStore';

// Agent & Neovim
export {
    useAgentStore,
    useAgentStatus,
    useAgentTasks,
    useNeovimConfigs,
    useAgentActions,
} from './agentStore';

// Settings & ENTJ Rules
export {
    useSettingsStore,
    useSettings,
    useENTJRules,
    useActiveSection,
    useSettingsActions,
} from './settingsStore';
