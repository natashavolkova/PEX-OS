// ============================================================================
// ATHENAPEX - SETTINGS STORE TESTS
// Testing domain store for settings and ENTJ rules
// ============================================================================

import { useSettingsStore } from '@/stores/domains/settingsStore';

describe('useSettingsStore', () => {
    beforeEach(() => {
        // Reset store to initial state
        useSettingsStore.setState({
            settings: {
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
                productivityRules: [],
            },
            entjRules: [],
            evaluations: [],
            activeSection: 'projects',
        });
    });

    describe('Settings Actions', () => {
        it('should update focus settings', () => {
            const { actions } = useSettingsStore.getState();

            actions.updateSettings({
                focusSettings: {
                    ...useSettingsStore.getState().settings.focusSettings,
                    defaultFocusDuration: 90,
                },
            });

            const { settings } = useSettingsStore.getState();
            expect(settings.focusSettings.defaultFocusDuration).toBe(90);
        });

        it('should update notification settings', () => {
            const { actions } = useSettingsStore.getState();

            actions.updateSettings({
                notificationSettings: {
                    ...useSettingsStore.getState().settings.notificationSettings,
                    soundEnabled: true,
                },
            });

            const { settings } = useSettingsStore.getState();
            expect(settings.notificationSettings.soundEnabled).toBe(true);
        });

        it('should update display settings', () => {
            const { actions } = useSettingsStore.getState();

            actions.updateSettings({
                displaySettings: {
                    ...useSettingsStore.getState().settings.displaySettings,
                    compactMode: true,
                    defaultView: 'analytics',
                },
            });

            const { settings } = useSettingsStore.getState();
            expect(settings.displaySettings.compactMode).toBe(true);
            expect(settings.displaySettings.defaultView).toBe('analytics');
        });
    });

    describe('ENTJ Rules', () => {
        it('should toggle ENTJ rule enabled state', () => {
            // First add a rule
            useSettingsStore.setState({
                entjRules: [{
                    id: 'rule-1',
                    name: 'Test Rule',
                    description: 'A test rule',
                    category: 'productivity',
                    condition: 'always',
                    action: 'optimize',
                    enabled: true,
                    priority: 1,
                    triggerCount: 0,
                }],
            });

            const { actions } = useSettingsStore.getState();
            actions.toggleENTJRule('rule-1');

            const { entjRules } = useSettingsStore.getState();
            expect(entjRules[0].enabled).toBe(false);

            // Toggle back
            actions.toggleENTJRule('rule-1');
            expect(useSettingsStore.getState().entjRules[0].enabled).toBe(true);
        });
    });

    describe('Active Section', () => {
        it('should update active section', () => {
            const { actions } = useSettingsStore.getState();

            actions.setActiveSection('analytics');

            const { activeSection } = useSettingsStore.getState();
            expect(activeSection).toBe('analytics');
        });
    });
});
