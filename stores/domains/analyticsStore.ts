// ============================================================================
// ATHENAPEX - ANALYTICS STORE
// ATHENA Architecture | Analytics & Focus Domain
// ============================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { FocusWindow, DailyMetrics, ProductivityInsight, PromptVersion, PromptAnalysis } from '@/types';

// --- UTILITY FUNCTIONS ---

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const getTodayKey = () => new Date().toISOString().split('T')[0];

// --- STORE INTERFACE ---

interface AnalyticsState {
    focusWindows: FocusWindow[];
    dailyMetrics: DailyMetrics[];
    insights: ProductivityInsight[];
    promptVersions: PromptVersion[];
    promptAnalyses: PromptAnalysis[];
    currentFocusWindow: FocusWindow | null;

    // API State
    isLoading: boolean;
    lastFetchedAt: number | null;
    statsCache: {
        totalPrompts: number;
        activeProjects: number;
        totalFocusHours: number;
        completedTasks: number;
        youtubeVideos: number;
        neovimConfigs: number;
    } | null;

    actions: {
        // Focus Windows
        startFocusWindow: (type: FocusWindow['type']) => void;
        endFocusWindow: (tasksCompleted?: string[]) => void;

        // Metrics
        updateDailyMetrics: (metrics: Partial<DailyMetrics>) => void;
        getTodayMetrics: () => DailyMetrics | null;
        calculateWeeklyHeatmap: () => { date: string; activity: any[]; score: number }[];

        // Insights
        generateInsight: (insight: Omit<ProductivityInsight, 'id' | 'createdAt'>) => void;
        dismissInsight: (id: string) => void;

        // Prompt Versions
        addPromptVersion: (promptId: string, content: string, changelog: string) => void;
        getPromptVersions: (promptId: string) => PromptVersion[];

        // API Methods
        fetchDashboardStats: () => Promise<void>;
        fetchHeatmapData: () => Promise<void>;
    };
}

// --- ZUSTAND STORE ---

export const useAnalyticsStore = create<AnalyticsState>()(
    devtools(
        persist(
            (set, get) => ({
                focusWindows: [],
                dailyMetrics: [],
                insights: [],
                promptVersions: [],
                promptAnalyses: [],
                currentFocusWindow: null,

                // API State - initial values
                isLoading: false,
                lastFetchedAt: null,
                statsCache: null,

                actions: {
                    // Focus Windows
                    startFocusWindow: (type) => {
                        const window: FocusWindow = {
                            id: generateId(),
                            startTime: Date.now(),
                            endTime: 0,
                            duration: 0,
                            type,
                            tasksCompleted: [],
                            productivityScore: 0,
                        };
                        set({ currentFocusWindow: window });
                    },

                    endFocusWindow: (tasksCompleted = []) => {
                        const current = get().currentFocusWindow;
                        if (!current) return;

                        const endTime = Date.now();
                        const duration = Math.round((endTime - current.startTime) / 60000);
                        const completedWindow: FocusWindow = {
                            ...current,
                            endTime,
                            duration,
                            tasksCompleted,
                            productivityScore: Math.min(10, tasksCompleted.length * 2 + 5),
                        };

                        set((state) => ({
                            focusWindows: [completedWindow, ...state.focusWindows],
                            currentFocusWindow: null,
                        }));
                    },

                    // Metrics
                    updateDailyMetrics: (metrics) => {
                        const todayKey = getTodayKey();
                        set((state) => {
                            const existing = state.dailyMetrics.find((m) => m.date === todayKey);
                            if (existing) {
                                return {
                                    dailyMetrics: state.dailyMetrics.map((m) =>
                                        m.date === todayKey ? { ...m, ...metrics } : m
                                    ),
                                };
                            }
                            const newMetrics: DailyMetrics = {
                                date: todayKey,
                                focusMinutes: 0,
                                tasksCompleted: 0,
                                tasksCreated: 0,
                                promptsCreated: 0,
                                promptsRefined: 0,
                                productivityScore: 0,
                                peakHours: [],
                                deadZones: [],
                                hourlyActivity: [],
                                ...metrics,
                            };
                            return {
                                dailyMetrics: [newMetrics, ...state.dailyMetrics],
                            };
                        });
                    },

                    getTodayMetrics: () =>
                        get().dailyMetrics.find((m) => m.date === getTodayKey()) || null,

                    calculateWeeklyHeatmap: () => {
                        const metrics = get().dailyMetrics.slice(0, 7);
                        return metrics.map((m) => ({
                            date: m.date,
                            activity: m.hourlyActivity,
                            score: m.productivityScore,
                        }));
                    },

                    // Insights
                    generateInsight: (insight) => {
                        const newInsight: ProductivityInsight = {
                            ...insight,
                            id: generateId(),
                            createdAt: Date.now(),
                        };
                        set((state) => ({
                            insights: [newInsight, ...state.insights],
                        }));
                    },

                    dismissInsight: (id) =>
                        set((state) => ({
                            insights: state.insights.map((i) =>
                                i.id === id ? { ...i, dismissedAt: Date.now() } : i
                            ),
                        })),

                    // Prompt Versions
                    addPromptVersion: (promptId, content, changelog) => {
                        const versions = get().promptVersions.filter((v) => v.promptId === promptId);
                        const newVersion: PromptVersion = {
                            id: generateId(),
                            promptId,
                            version: versions.length + 1,
                            content,
                            changelog,
                            createdAt: Date.now(),
                            createdBy: 'Natasha (ENTJ)',
                        };
                        set((state) => ({
                            promptVersions: [newVersion, ...state.promptVersions],
                        }));
                    },

                    getPromptVersions: (promptId) =>
                        get().promptVersions.filter((v) => v.promptId === promptId),

                    // API Methods
                    fetchDashboardStats: async () => {
                        set({ isLoading: true });
                        try {
                            const res = await fetch('/api/analytics/stats');
                            const data = await res.json();
                            if (data.success && data.data) {
                                set({
                                    statsCache: data.data,
                                    lastFetchedAt: Date.now(),
                                });
                            }
                        } catch (error) {
                            console.error('fetchDashboardStats error:', error);
                        } finally {
                            set({ isLoading: false });
                        }
                    },

                    fetchHeatmapData: async () => {
                        set({ isLoading: true });
                        try {
                            const res = await fetch('/api/analytics?type=heatmap');
                            const data = await res.json();
                            if (data.success && data.data) {
                                // Transform heatmap data into dailyMetrics format
                                const metrics = data.data.map((d: any) => ({
                                    date: d.date,
                                    hourlyActivity: d.hours || [],
                                    productivityScore: d.score || 0,
                                    focusMinutes: 0,
                                    tasksCompleted: 0,
                                    tasksCreated: 0,
                                    promptsCreated: 0,
                                    promptsRefined: 0,
                                    peakHours: [],
                                    deadZones: [],
                                }));
                                set({
                                    dailyMetrics: metrics,
                                    lastFetchedAt: Date.now(),
                                });
                            }
                        } catch (error) {
                            console.error('fetchHeatmapData error:', error);
                        } finally {
                            set({ isLoading: false });
                        }
                    },
                },
            }),
            {
                name: 'pex-os-analytics',
                partialize: (state) => ({
                    focusWindows: state.focusWindows,
                    dailyMetrics: state.dailyMetrics,
                    insights: state.insights,
                    promptVersions: state.promptVersions,
                }),
            }
        ),
        { name: 'AnalyticsStore' }
    )
);

// Selector hooks
export const useFocusWindows = () => useAnalyticsStore((s) => s.focusWindows);
export const useDailyMetrics = () => useAnalyticsStore((s) => s.dailyMetrics);
export const useInsights = () => useAnalyticsStore((s) => s.insights);
export const useAnalyticsActions = () => useAnalyticsStore((s) => s.actions);
