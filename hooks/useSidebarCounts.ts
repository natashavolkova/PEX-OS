'use client';

// ============================================================================
// ATHENAPEX - SIDEBAR COUNTS HOOK
// Returns dynamic counts from stores for sidebar badges
// ============================================================================

import { useProjectsStore } from '@/stores/domains/projectsStore';
import { useYouTubeStore } from '@/stores/domains/youtubeStore';
import { useTemplatesStore } from '@/stores/domains/templatesStore';
import { useBattlePlanStore } from '@/stores/domains/battlePlanStore';

export interface SidebarCounts {
    analytics: number | null;
    prompts: number | null;
    projects: number;
    tasks: number;
    battlePlan: number;
    youtube: number;
    templates: number;
    neovim: number | null;
    aiAgent: number | null;
}

export function useSidebarCounts(): SidebarCounts {
    // Subscribe to stores reactively - using correct property names
    const projects = useProjectsStore((s) => s.projects);
    const tasks = useProjectsStore((s) => s.tasks);
    const youtubeRefs = useYouTubeStore((s) => s.youtubeRefs);
    const templates = useTemplatesStore((s) => s.templates);
    const battlePlans = useBattlePlanStore((s) => s.battlePlans);

    // Calculate counts with fallbacks
    const activeProjects = (projects || []).filter((p) => p.status === 'active').length;
    const pendingTasks = (tasks || []).filter((t) => t.status === 'pending' || t.status === 'in_progress').length;
    const activeBattlePlans = (battlePlans || []).filter((bp) => bp.status === 'active').length;

    return {
        analytics: null,
        prompts: null, // Prompts use complex tree structure
        projects: activeProjects,
        tasks: pendingTasks,
        battlePlan: activeBattlePlans,
        youtube: (youtubeRefs || []).length,
        templates: (templates || []).length,
        neovim: null,
        aiAgent: null,
    };
}
