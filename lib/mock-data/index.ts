// ============================================================================
// AthenaPeX - MOCK DATA: INDEX
// ATHENA Architecture | Central Mock Data Export
// ============================================================================

export { mockPrompts, mockSharedItems } from './prompts';
export { mockProjects, getProjectById, getActiveProjects, getProjectsByPriority, getHighROIProjects } from './projects';
export { mockTasks, getTaskById, getTasksByProject, getTasksByStatus, getHighROITasks, getBlockedTasks, getLowROITasks } from './tasks';
export { mockDailyMetrics, mockWeeklyHeatmap, mockFocusWindows, mockInsights, generateDailyMetrics, generateWeeklyHeatmap, getRecentInsights, getActionableInsights } from './analytics';
export { mockYoutubeRefs, getYoutubeRefById, getYoutubeRefsByProject, getUnwatchedYoutubeRefs, getHighImpactYoutubeRefs, extractVideoId } from './youtube';
export { mockTemplates, getTemplateById, getTemplatesByCategory, getMostUsedTemplates } from './templates';
