'use client';

// ============================================================================
// ATHENAPEX - SETTINGS PAGE
// Athena Architecture | System Settings Module with Store Integration
// ============================================================================

import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Palette,
  Clock,
  Bot,
  Shield,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useSettingsStore } from '@/stores';

// Toggle Switch Component
const Toggle: React.FC<{
  enabled: boolean;
  onToggle: () => void;
}> = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`w-12 h-6 rounded-full relative transition-all ${enabled ? 'bg-athena-gold' : 'bg-athena-navy-light'
      }`}
  >
    <span
      className={`absolute top-1 w-4 h-4 rounded-full transition-all ${enabled ? 'right-1 bg-athena-navy-deep' : 'left-1 bg-athena-silver'
        }`}
    />
  </button>
);

// Settings Section Component
const SettingsSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="bg-athena-navy/80 border border-athena-gold/20 rounded-xl p-6">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h2 className="text-lg font-cinzel font-semibold text-athena-platinum">{title}</h2>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

// Settings Row Component
const SettingsRow: React.FC<{
  label: string;
  description?: string;
  children: React.ReactNode;
}> = ({ label, description, children }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-athena-platinum">{label}</p>
      {description && <p className="text-xs text-athena-silver/60">{description}</p>}
    </div>
    {children}
  </div>
);

export default function SettingsPage() {
  const { settings, actions } = useSettingsStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-cinzel font-bold text-athena-gold flex items-center gap-3">
            <Settings className="w-7 h-7" />
            Settings
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-athena-gold text-athena-navy-deep rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-athena-gold-dark transition-all disabled:opacity-50"
            >
              <Save size={14} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Focus Settings */}
          <SettingsSection icon={<Clock className="w-5 h-5 text-athena-gold" />} title="Focus Settings">
            <SettingsRow label="Default Focus Duration" description="Duration of focus sessions in minutes">
              <select
                value={settings.focusSettings.defaultFocusDuration}
                onChange={(e) =>
                  actions.updateSettings({
                    focusSettings: { ...settings.focusSettings, defaultFocusDuration: parseInt(e.target.value) },
                  })
                }
                className="h-9 bg-athena-navy-deep border border-athena-gold/20 rounded-lg px-3 text-sm text-athena-platinum focus:border-athena-gold"
              >
                <option value="25">25 min (Pomodoro)</option>
                <option value="50">50 min (Deep Work)</option>
                <option value="90">90 min (Flow State)</option>
              </select>
            </SettingsRow>

            <SettingsRow label="Break Duration" description="Duration of breaks between sessions">
              <select
                value={settings.focusSettings.breakDuration}
                onChange={(e) =>
                  actions.updateSettings({
                    focusSettings: { ...settings.focusSettings, breakDuration: parseInt(e.target.value) },
                  })
                }
                className="h-9 bg-athena-navy-deep border border-athena-gold/20 rounded-lg px-3 text-sm text-athena-platinum focus:border-athena-gold"
              >
                <option value="5">5 min</option>
                <option value="10">10 min</option>
                <option value="15">15 min</option>
              </select>
            </SettingsRow>

            <SettingsRow label="Auto-start Breaks" description="Automatically start breaks after focus sessions">
              <Toggle
                enabled={settings.focusSettings.autoStartBreaks}
                onToggle={() =>
                  actions.updateSettings({
                    focusSettings: { ...settings.focusSettings, autoStartBreaks: !settings.focusSettings.autoStartBreaks },
                  })
                }
              />
            </SettingsRow>

            <SettingsRow label="Block Notifications During Focus" description="Mute all notifications during focus sessions">
              <Toggle
                enabled={settings.focusSettings.blockNotificationsDuringFocus}
                onToggle={() =>
                  actions.updateSettings({
                    focusSettings: {
                      ...settings.focusSettings,
                      blockNotificationsDuringFocus: !settings.focusSettings.blockNotificationsDuringFocus,
                    },
                  })
                }
              />
            </SettingsRow>
          </SettingsSection>

          {/* Notification Settings */}
          <SettingsSection icon={<Bell className="w-5 h-5 text-athena-gold" />} title="Notifications">
            <SettingsRow label="Deadline Reminders" description="Get notified before task deadlines">
              <Toggle
                enabled={settings.notificationSettings.deadlineReminders}
                onToggle={() =>
                  actions.updateSettings({
                    notificationSettings: {
                      ...settings.notificationSettings,
                      deadlineReminders: !settings.notificationSettings.deadlineReminders,
                    },
                  })
                }
              />
            </SettingsRow>

            <SettingsRow label="Focus Window Reminders" description="Reminders to start focus sessions">
              <Toggle
                enabled={settings.notificationSettings.focusWindowReminders}
                onToggle={() =>
                  actions.updateSettings({
                    notificationSettings: {
                      ...settings.notificationSettings,
                      focusWindowReminders: !settings.notificationSettings.focusWindowReminders,
                    },
                  })
                }
              />
            </SettingsRow>

            <SettingsRow label="Insight Notifications" description="Get notified about productivity insights">
              <Toggle
                enabled={settings.notificationSettings.insightNotifications}
                onToggle={() =>
                  actions.updateSettings({
                    notificationSettings: {
                      ...settings.notificationSettings,
                      insightNotifications: !settings.notificationSettings.insightNotifications,
                    },
                  })
                }
              />
            </SettingsRow>

            <SettingsRow label="Sound Effects" description="Enable sound for notifications">
              <Toggle
                enabled={settings.notificationSettings.soundEnabled}
                onToggle={() =>
                  actions.updateSettings({
                    notificationSettings: {
                      ...settings.notificationSettings,
                      soundEnabled: !settings.notificationSettings.soundEnabled,
                    },
                  })
                }
              />
            </SettingsRow>
          </SettingsSection>

          {/* Agent Settings */}
          <SettingsSection icon={<Bot className="w-5 h-5 text-athena-gold" />} title="AI Agent (Fara-7B)">
            <SettingsRow label="Auto-connect" description="Automatically connect to agent on startup">
              <Toggle
                enabled={settings.agentSettings.autoConnect}
                onToggle={() =>
                  actions.updateSettings({
                    agentSettings: { ...settings.agentSettings, autoConnect: !settings.agentSettings.autoConnect },
                  })
                }
              />
            </SettingsRow>

            <SettingsRow label="Endpoint" description="WebSocket endpoint for agent connection">
              <input
                type="text"
                value={settings.agentSettings.endpoint}
                onChange={(e) =>
                  actions.updateSettings({
                    agentSettings: { ...settings.agentSettings, endpoint: e.target.value },
                  })
                }
                className="h-9 w-48 bg-athena-navy-deep border border-athena-gold/20 rounded-lg px-3 text-sm text-athena-platinum focus:border-athena-gold"
              />
            </SettingsRow>

            <SettingsRow label="Max Concurrent Tasks" description="Maximum tasks to run simultaneously">
              <select
                value={settings.agentSettings.maxConcurrentTasks}
                onChange={(e) =>
                  actions.updateSettings({
                    agentSettings: { ...settings.agentSettings, maxConcurrentTasks: parseInt(e.target.value) },
                  })
                }
                className="h-9 bg-athena-navy-deep border border-athena-gold/20 rounded-lg px-3 text-sm text-athena-platinum focus:border-athena-gold"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="5">5</option>
              </select>
            </SettingsRow>
          </SettingsSection>

          {/* Display Settings */}
          <SettingsSection icon={<Palette className="w-5 h-5 text-athena-gold" />} title="Display">
            <SettingsRow label="Default View" description="Default landing page when opening app">
              <select
                value={settings.displaySettings.defaultView}
                onChange={(e) =>
                  actions.updateSettings({
                    displaySettings: { ...settings.displaySettings, defaultView: e.target.value as any },
                  })
                }
                className="h-9 bg-athena-navy-deep border border-athena-gold/20 rounded-lg px-3 text-sm text-athena-platinum focus:border-athena-gold"
              >
                <option value="projects">Projects</option>
                <option value="tasks">Tasks</option>
                <option value="analytics">Analytics</option>
                <option value="battle-plan">Battle Plan</option>
              </select>
            </SettingsRow>

            <SettingsRow label="Compact Mode" description="Use smaller elements for more content">
              <Toggle
                enabled={settings.displaySettings.compactMode}
                onToggle={() =>
                  actions.updateSettings({
                    displaySettings: { ...settings.displaySettings, compactMode: !settings.displaySettings.compactMode },
                  })
                }
              />
            </SettingsRow>

            <SettingsRow label="Show Completed Tasks" description="Display completed tasks in lists">
              <Toggle
                enabled={settings.displaySettings.showCompletedTasks}
                onToggle={() =>
                  actions.updateSettings({
                    displaySettings: {
                      ...settings.displaySettings,
                      showCompletedTasks: !settings.displaySettings.showCompletedTasks,
                    },
                  })
                }
              />
            </SettingsRow>
          </SettingsSection>

          {/* About */}
          <SettingsSection icon={<Shield className="w-5 h-5 text-athena-gold" />} title="About AthenaPeX">
            <div className="space-y-2 text-sm text-athena-silver">
              <p>
                <span className="text-athena-gold">Version:</span> 2.0.0
              </p>
              <p>
                <span className="text-athena-gold">Architecture:</span> Athena Olympian
              </p>
              <p>
                <span className="text-athena-gold">Build:</span> ENTJ Productivity System
              </p>
              <p>
                <span className="text-athena-gold">Framework:</span> Next.js 15 + React 19
              </p>
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
