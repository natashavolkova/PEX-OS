// ============================================================================
// ATHENAPEX - SIDEBAR COUNTS HOOK
// Returns dynamic counts from stores for sidebar badges
// ============================================================================

import { useProjectsStore } from '@/stores/domains/projectsStore';
import { useYouTubeStore } from '@/stores/domains/youtubeStore';
import { useTemplatesStore } from '@/stores/domains/templatesStore';
import { useBattlePlanStore } from '@/stores/domains/battlePlanStore';
import { usePromptStore } from '@/stores/usePromptStore';

export interface SidebarCounts {
    analytics: number | null;
    prompts: number;
    projects: number;
    tasks: number;
    battlePlan: number;
    youtube: number;
    templates: number;
    neovim: number | null;
    aiAgent: number | null;
}

export function useSidebarCounts(): SidebarCounts {
    // Projects and Tasks
    const projects = useProjectsStore((s) => s.projects);
    const tasks = useProjectsStore((s) => s.tasks);

    // YouTube references
    const youtubeRefs = useYouTubeStore((s) => s.references);

    // Templates
    const templates = useTemplatesStore((s) => s.templates);

    // Battle Plans
    const battlePlans = useBattlePlanStore((s) => s.battlePlans);

    // Prompts
    const prompts = usePromptStore((s) => s.prompts);

    // Calculate counts
    const activeProjects = projects.filter((p) => p.status === 'active').length;
    const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress').length;
    const activeBattlePlans = battlePlans.filter((bp) => bp.status === 'active').length;

    return {
        analytics: null, // Analytics doesn't have a count
        prompts: prompts.length,
        projects: activeProjects,
        tasks: pendingTasks,
        battlePlan: activeBattlePlans,
        youtube: youtubeRefs.length,
        templates: templates.length,
        neovim: null, // Neovim doesn't have a count
        aiAgent: null, // AI Agent doesn't have a count
    };
}
