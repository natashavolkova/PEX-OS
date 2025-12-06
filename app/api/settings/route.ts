// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - SETTINGS API
// ATHENA Architecture | REST API Endpoints
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// Mock settings - in production, this would come from database
const mockSettings = {
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
    entjRules: [
        {
            id: 'rule-1',
            name: 'Maximum Productivity Over Comfort',
            description: 'Always prioritize tasks that maximize output over comfortable busywork',
            category: 'productivity',
            enabled: true,
            priority: 1,
        },
        {
            id: 'rule-2',
            name: 'Aggressive Velocity Over Perfection',
            description: 'Ship fast, iterate faster. 80% done > 100% planned',
            category: 'velocity',
            enabled: true,
            priority: 2,
        },
    ],
};

// GET /api/settings - Get user settings
export async function GET() {
    try {
        return NextResponse.json({
            data: mockSettings,
            success: true,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

// PATCH /api/settings - Update user settings
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { section, updates } = body;

        // Validate section
        const validSections = ['focusSettings', 'notificationSettings', 'agentSettings', 'displaySettings', 'entjRules'];
        if (section && !validSections.includes(section)) {
            return NextResponse.json(
                { success: false, message: 'Invalid settings section' },
                { status: 400 }
            );
        }

        // In production, this would update the database
        const updatedSettings = section
            ? { ...mockSettings, [section]: { ...mockSettings[section as keyof typeof mockSettings], ...updates } }
            : { ...mockSettings, ...updates };

        return NextResponse.json({
            data: updatedSettings,
            success: true,
            message: 'Settings updated successfully',
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to update settings' },
            { status: 500 }
        );
    }
}

// POST /api/settings/reset - Reset to default settings
export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const section = searchParams.get('section');

        if (section) {
            // Reset specific section
            return NextResponse.json({
                data: mockSettings,
                success: true,
                message: `${section} reset to defaults`,
            });
        }

        // Reset all settings
        return NextResponse.json({
            data: mockSettings,
            success: true,
            message: 'All settings reset to defaults',
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to reset settings' },
            { status: 500 }
        );
    }
}
