// ============================================================================
// ATHENAPEX - SETTINGS STORE
// ATHENA Architecture | Settings & ENTJ Rules Domain
// ============================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { SystemSettings, ENTJRule, ENTJEvaluation } from '@/types';

// --- UTILITY FUNCTIONS ---

const calculateROI = (impact: number, effort: number): number => {
    if (effort === 0) return impact * 10;
    return Math.round((impact / effort) * 10) / 10;
};

// --- INITIAL DATA ---

const initialENTJRules: ENTJRule[] = [
    {
        id: 'rule-1',
        name: 'Maximum Productivity Over Comfort',
        description: 'Always prioritize tasks that maximize output over comfortable busywork',
        category: 'productivity',
        condition: 'task.impactScore < 5 && task.status === "in_progress"',
        action: 'Flag for review and suggest higher-impact alternatives',
        enabled: true,
        priority: 1,
        triggerCount: 0,
    },
    {
        id: 'rule-2',
        name: 'Aggressive Velocity Over Perfection',
        description: 'Ship fast, iterate faster. 80% done > 100% planned',
        category: 'velocity',
        condition: 'task.actualMinutes > task.estimatedMinutes * 1.5',
        action: 'Alert: Task taking too long. Consider shipping MVP version',
        enabled: true,
        priority: 2,
        triggerCount: 0,
    },
    {
        id: 'rule-3',
        name: 'Real Impact Over Work Quantity',
        description: 'Measure by outcomes, not hours worked',
        category: 'impact',
        condition: 'dailyMetrics.tasksCompleted > 10 && dailyMetrics.productivityScore < 6',
        action: 'Warning: High activity but low impact. Review task selection',
        enabled: true,
        priority: 3,
        triggerCount: 0,
    },
    {
        id: 'rule-4',
        name: 'Ruthless Elimination of Weak Ideas',
        description: 'Kill ideas with ROI < 1.5 after 48 hours',
        category: 'elimination',
        condition: 'task.roiScore < 1.5 && task.createdAt < Date.now() - 172800000',
        action: 'Flag for elimination or pivot. Low ROI detected',
        enabled: true,
        priority: 4,
        triggerCount: 0,
    },
    {
        id: 'rule-5',
        name: 'Automatic Pivot Recommendations',
        description: 'Suggest pivots when progress stalls',
        category: 'pivot',
        condition: 'task.status === "blocked" && task.blockers.length > 0 && blockerAge > 86400000',
        action: 'Trigger pivot recommendation. Blocker unresolved for 24+ hours',
        enabled: true,
        priority: 5,
        triggerCount: 0,
    },
];

const initialSettings: SystemSettings = {
    productivityRules: [],
    focusSettings: {
        defaultFocusDuration: 50,
        breakDuration: 10,
        autoStartBreaks: true,
        blockNotificationsDuringFocus: true,
        peakHoursEnabled: true,
        preferredWorkHours: { start: 9, end: 18 },
    },
    notificationSettings: {
        deadlineReminders: true,
        deadlineReminderHours: 24,
        focusWindowReminders: true,
        insightNotifications: true,
        agentNotifications: true,
        soundEnabled: false,
    },
    agentSettings: {
        autoConnect: false,
        endpoint: 'ws://localhost:8765',
        maxConcurrentTasks: 3,
        autoExecuteMacros: false,
    },
    displaySettings: {
        defaultView: 'projects',
        sidebarCollapsed: false,
        compactMode: false,
        showCompletedTasks: true,
        sortTasksBy: 'roi',
    },
};

// --- STORE INTERFACE ---

interface SettingsState {
    settings: SystemSettings;
    entjRules: ENTJRule[];
    evaluations: ENTJEvaluation[];
    activeSection: 'projects' | 'tasks' | 'prompts' | 'analytics' | 'youtube' | 'templates' | 'neovim' | 'battle-plan' | 'agent';

    actions: {
        // Settings
        updateSettings: (settings: Partial<SystemSettings>) => void;

        // ENTJ Rules
        toggleRule: (id: string) => void;
        evaluateItem: (itemId: string, itemType: ENTJEvaluation['itemType'], item: { impactScore?: number; effortScore?: number }) => ENTJEvaluation;

        // UI
        setActiveSection: (section: SettingsState['activeSection']) => void;
    };
}

// --- ZUSTAND STORE ---

export const useSettingsStore = create<SettingsState>()(
    devtools(
        persist(
            (set, get) => ({
                settings: initialSettings,
                entjRules: initialENTJRules,
                evaluations: [],
                activeSection: 'projects',

                actions: {
                    // Settings
                    updateSettings: (settings) =>
                        set((state) => ({
                            settings: { ...state.settings, ...settings },
                        })),

                    // ENTJ Rules
                    toggleRule: (id) =>
                        set((state) => ({
                            entjRules: state.entjRules.map((r) =>
                                r.id === id ? { ...r, enabled: !r.enabled } : r
                            ),
                        })),

                    evaluateItem: (itemId, itemType, item) => {
                        const impactScore = item.impactScore || 5;
                        const effortScore = item.effortScore || 5;
                        const roiScore = calculateROI(impactScore, effortScore);

                        let recommendation: ENTJEvaluation['recommendation'];
                        if (roiScore >= 2) recommendation = 'execute';
                        else if (roiScore >= 1.5) recommendation = 'delegate';
                        else if (roiScore >= 1) recommendation = 'defer';
                        else recommendation = 'eliminate';

                        const evaluation: ENTJEvaluation = {
                            itemId,
                            itemType,
                            impactScore,
                            effortScore,
                            roiScore,
                            recommendation,
                            reasoning: `ROI: ${roiScore.toFixed(1)} - ${recommendation.toUpperCase()} recommended`,
                            suggestedPriority: roiScore >= 2 ? 'critical' : roiScore >= 1.5 ? 'high' : roiScore >= 1 ? 'medium' : 'low',
                            flaggedForRemoval: roiScore < 1,
                            evaluatedAt: Date.now(),
                        };

                        set((state) => ({
                            evaluations: [evaluation, ...state.evaluations.filter((e) => e.itemId !== itemId)],
                        }));

                        return evaluation;
                    },

                    // UI
                    setActiveSection: (section) => set({ activeSection: section }),
                },
            }),
            {
                name: 'pex-os-settings',
                partialize: (state) => ({
                    settings: state.settings,
                    entjRules: state.entjRules,
                }),
            }
        ),
        { name: 'SettingsStore' }
    )
);

// Selector hooks
export const useSettings = () => useSettingsStore((s) => s.settings);
export const useENTJRules = () => useSettingsStore((s) => s.entjRules);
export const useActiveSection = () => useSettingsStore((s) => s.activeSection);
export const useSettingsActions = () => useSettingsStore((s) => s.actions);
