// ============================================================================
// ATHENAPEX - PRODUCTIVITY STORE COMPATIBILITY LAYER
// ATHENA Architecture | Backward Compatibility for useProductivityStore
// ============================================================================
// 
// ⚠️ DEPRECATED: Esta é uma camada de compatibilidade.
// Use os stores modulares diretamente:
// - useProjectsStore (projects, tasks)
// - useYouTubeStore (youtube refs)
// - useTemplatesStore (templates)
// - useBattlePlanStore (battle plans)
// - useAnalyticsStore (focus, metrics, insights)
// - useAgentStore (agent, neovim)
// - useSettingsStore (settings, entj rules)
//
// ============================================================================

import { useProjectsStore } from './domains/projectsStore';
import { useYouTubeStore } from './domains/youtubeStore';
import { useTemplatesStore } from './domains/templatesStore';
import { useBattlePlanStore } from './domains/battlePlanStore';
import { useAnalyticsStore } from './domains/analyticsStore';
import { useAgentStore } from './domains/agentStore';
import { useSettingsStore } from './domains/settingsStore';
import type {
    Project,
    Task,
    TaskLog,
    YouTubeReference,
    StrategicTemplate,
    BattlePlan,
    FocusWindow,
    DailyMetrics,
    ProductivityInsight,
    PromptVersion,
    PromptAnalysis,
    AgentStatus,
    AgentTask,
    NeovimConfig,
    SystemSettings,
    ENTJRule,
    ENTJEvaluation,
} from '@/types';

// --- Type Definitions (before usage) ---

interface ProductivityCompatState {
    // Projects & Tasks
    projects: Project[];
    tasks: Task[];
    taskLogs: TaskLog[];
    selectedProjectId: string | null;
    selectedTaskId: string | null;

    // YouTube
    youtubeRefs: YouTubeReference[];

    // Templates
    templates: StrategicTemplate[];

    // Battle Plans
    battlePlans: BattlePlan[];

    // Analytics
    focusWindows: FocusWindow[];
    dailyMetrics: DailyMetrics[];
    insights: ProductivityInsight[];
    promptVersions: PromptVersion[];
    promptAnalyses: PromptAnalysis[];
    currentFocusWindow: FocusWindow | null;

    // Agent
    agentStatus: AgentStatus;
    agentTasks: AgentTask[];
    neovimConfigs: NeovimConfig[];

    // Settings
    settings: SystemSettings;
    entjRules: ENTJRule[];
    evaluations: ENTJEvaluation[];
    activeSection: 'projects' | 'tasks' | 'prompts' | 'analytics' | 'youtube' | 'templates' | 'neovim' | 'battle-plan' | 'agent';

    // Actions
    actions: Record<string, (...args: any[]) => any>;
}

// --- Compatibility Hook ---
// Provides the same interface as the old productivityStore
// by combining all domain stores

export const useProductivityStore = <T>(
    selector: (state: ProductivityCompatState) => T
): T => {
    // Get state from all stores
    const projectsState = useProjectsStore();
    const youtubeState = useYouTubeStore();
    const templatesState = useTemplatesStore();
    const battlePlanState = useBattlePlanStore();
    const analyticsState = useAnalyticsStore();
    const agentState = useAgentStore();
    const settingsState = useSettingsStore();

    // Combine into unified state
    const combinedState: ProductivityCompatState = {
        // Projects & Tasks
        projects: projectsState.projects,
        tasks: projectsState.tasks,
        taskLogs: projectsState.taskLogs,
        selectedProjectId: projectsState.selectedProjectId,
        selectedTaskId: projectsState.selectedTaskId,

        // YouTube
        youtubeRefs: youtubeState.youtubeRefs,

        // Templates
        templates: templatesState.templates,

        // Battle Plans
        battlePlans: battlePlanState.battlePlans,

        // Analytics
        focusWindows: analyticsState.focusWindows,
        dailyMetrics: analyticsState.dailyMetrics,
        insights: analyticsState.insights,
        promptVersions: analyticsState.promptVersions,
        promptAnalyses: analyticsState.promptAnalyses,
        currentFocusWindow: analyticsState.currentFocusWindow,

        // Agent
        agentStatus: agentState.agentStatus,
        agentTasks: agentState.agentTasks,
        neovimConfigs: agentState.neovimConfigs,

        // Settings
        settings: settingsState.settings,
        entjRules: settingsState.entjRules,
        evaluations: settingsState.evaluations,
        activeSection: settingsState.activeSection,

        // Combined Actions
        actions: {
            // Projects
            addProject: projectsState.actions.addProject,
            updateProject: projectsState.actions.updateProject,
            deleteProject: projectsState.actions.deleteProject,
            archiveProject: projectsState.actions.archiveProject,
            setSelectedProject: projectsState.actions.setSelectedProject,

            // Tasks
            addTask: projectsState.actions.addTask,
            updateTask: projectsState.actions.updateTask,
            deleteTask: projectsState.actions.deleteTask,
            startTask: projectsState.actions.startTask,
            completeTask: projectsState.actions.completeTask,
            blockTask: projectsState.actions.blockTask,
            setSelectedTask: projectsState.actions.setSelectedTask,
            logTaskAction: projectsState.actions.logTaskAction,
            getProjectTasks: projectsState.actions.getProjectTasks,
            getHighROITasks: projectsState.actions.getHighROITasks,

            // YouTube
            addYoutubeRef: youtubeState.actions.addYoutubeRef,
            updateYoutubeRef: youtubeState.actions.updateYoutubeRef,
            deleteYoutubeRef: youtubeState.actions.deleteYoutubeRef,
            addYoutubeInsight: youtubeState.actions.addYoutubeInsight,

            // Templates
            addTemplate: templatesState.actions.addTemplate,
            updateTemplate: templatesState.actions.updateTemplate,
            deleteTemplate: templatesState.actions.deleteTemplate,
            useTemplate: templatesState.actions.useTemplate,

            // Battle Plans
            addBattlePlan: battlePlanState.actions.addBattlePlan,
            updateBattlePlan: battlePlanState.actions.updateBattlePlan,
            deleteBattlePlan: battlePlanState.actions.deleteBattlePlan,

            // Analytics
            startFocusWindow: analyticsState.actions.startFocusWindow,
            endFocusWindow: analyticsState.actions.endFocusWindow,
            updateDailyMetrics: analyticsState.actions.updateDailyMetrics,
            getTodayMetrics: analyticsState.actions.getTodayMetrics,
            calculateWeeklyHeatmap: analyticsState.actions.calculateWeeklyHeatmap,
            generateInsight: analyticsState.actions.generateInsight,
            dismissInsight: analyticsState.actions.dismissInsight,
            addPromptVersion: analyticsState.actions.addPromptVersion,
            getPromptVersions: analyticsState.actions.getPromptVersions,

            // Agent
            setAgentStatus: agentState.actions.setAgentStatus,
            addAgentTask: agentState.actions.addAgentTask,
            updateAgentTask: agentState.actions.updateAgentTask,
            addNeovimConfig: agentState.actions.addNeovimConfig,
            updateNeovimConfig: agentState.actions.updateNeovimConfig,
            deleteNeovimConfig: agentState.actions.deleteNeovimConfig,

            // Settings
            updateSettings: settingsState.actions.updateSettings,
            toggleRule: settingsState.actions.toggleRule,
            evaluateItem: settingsState.actions.evaluateItem,
            setActiveSection: settingsState.actions.setActiveSection,
        },
    };

    return selector(combinedState);
};

// --- Legacy Selector Hooks (for backward compatibility) ---

export const useProjects = () => useProductivityStore((s) => s.projects);
export const useTasks = () => useProductivityStore((s) => s.tasks);
export const useActiveSection = () => useProductivityStore((s) => s.activeSection);
export const useBattlePlans = () => useProductivityStore((s) => s.battlePlans);
export const useTemplates = () => useProductivityStore((s) => s.templates);
export const useAgentStatus = () => useProductivityStore((s) => s.agentStatus);
export const useProductivityActions = () => useProductivityStore((s) => s.actions);
