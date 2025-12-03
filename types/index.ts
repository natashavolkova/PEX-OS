// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - COMPREHENSIVE TYPE DEFINITIONS
// ATHENA Architecture | TypeScript Strict Mode | ENTJ Productivity System
// ============================================================================

// Re-export existing prompt-manager types
export * from './prompt-manager';

// --- PROJECT MANAGEMENT TYPES ---

export interface Project {
  id: string;
  name: string;
  description: string;
  emoji?: string;
  status: 'active' | 'archived' | 'completed' | 'on_hold';
  priority: 'critical' | 'high' | 'medium' | 'low';
  impactScore: number; // 1-10
  roiScore: number; // Calculated: value / effort
  owner: string;
  tags: string[];
  startDate: string;
  deadline?: string;
  completedDate?: string;
  createdAt: number;
  updatedAt: number;
  tasksCount: number;
  completedTasksCount: number;
  linkedPrompts: string[];
  linkedYoutubeRefs: string[];
}

// --- TASK MANAGEMENT TYPES ---

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  emoji?: string;
  status: 'pending' | 'in_progress' | 'blocked' | 'completed' | 'cancelled';
  priority: 'critical' | 'high' | 'medium' | 'low';
  impactScore: number; // 1-10 (real-world impact)
  effortScore: number; // 1-10 (time/energy required)
  roiScore: number; // Calculated: impact / effort
  owner: string;
  tags: string[];
  dueDate?: string;
  startedAt?: number;
  completedAt?: number;
  estimatedMinutes?: number;
  actualMinutes?: number;
  blockers: string[];
  dependencies: string[]; // task IDs
  createdAt: number;
  updatedAt: number;
}

export interface TaskLog {
  id: string;
  taskId: string;
  action: 'created' | 'started' | 'paused' | 'resumed' | 'completed' | 'blocked' | 'status_changed' | 'updated';
  previousStatus?: string;
  newStatus?: string;
  notes?: string;
  duration?: number; // minutes
  timestamp: number;
}

// --- PROMPT VERSIONING TYPES ---

export interface PromptVersion {
  id: string;
  promptId: string;
  version: number;
  content: string;
  changelog: string;
  efficiencyScore?: number; // 1-10
  qualityScore?: number; // 1-10
  createdAt: number;
  createdBy: string;
}

export interface PromptAnalysis {
  id: string;
  promptId: string;
  clarity: number; // 1-10
  specificity: number; // 1-10
  effectiveness: number; // 1-10
  suggestions: string[];
  analyzedAt: number;
}

// --- YOUTUBE REFERENCE TYPES ---

export interface YouTubeReference {
  id: string;
  url: string;
  videoId: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  duration: string;
  description?: string;
  tags: string[];
  insights: YouTubeInsight[];
  linkedProjects: string[];
  linkedPrompts: string[];
  watchedAt?: number;
  addedAt: number;
  updatedAt: number;
  impactScore: number; // How useful was this reference
  outputGenerated: boolean; // Did this generate useful output?
}

export interface YouTubeInsight {
  id: string;
  referenceId: string;
  timestamp?: string; // Video timestamp like "12:34"
  content: string;
  category: 'key_point' | 'action_item' | 'quote' | 'resource' | 'idea';
  linkedPromptId?: string;
  createdAt: number;
}

// --- PRODUCTIVITY ANALYTICS TYPES ---

export interface FocusWindow {
  id: string;
  startTime: number;
  endTime: number;
  duration: number; // minutes
  type: 'deep_work' | 'shallow_work' | 'break' | 'meeting';
  tasksCompleted: string[];
  productivityScore: number; // 1-10
  notes?: string;
}

export interface DailyMetrics {
  date: string; // YYYY-MM-DD
  focusMinutes: number;
  tasksCompleted: number;
  tasksCreated: number;
  promptsCreated: number;
  promptsRefined: number;
  productivityScore: number;
  peakHours: number[]; // Array of hours (0-23) with highest productivity
  deadZones: number[]; // Array of hours with lowest productivity
  hourlyActivity: HourlyActivity[];
}

export interface HourlyActivity {
  hour: number; // 0-23
  tasksCompleted: number;
  focusMinutes: number;
  activityLevel: 'high' | 'medium' | 'low' | 'none';
}

export interface WeeklyHeatmapData {
  week: string; // Week identifier
  days: {
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    date: string;
    hours: { hour: number; value: number; level: 'high' | 'medium' | 'low' | 'none' }[];
  }[];
  totalFocusHours: number;
  avgProductivity: number;
}

export interface ProductivityInsight {
  id: string;
  type: 'peak_time' | 'dead_zone' | 'pattern' | 'recommendation' | 'warning' | 'procrastination';
  title: string;
  description: string;
  actionable: boolean;
  suggestedAction?: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: number;
  dismissedAt?: number;
}

// --- ENTJ BATTLE PLAN TYPES ---

export interface BattlePlan {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'sprint' | 'quarterly';
  status: 'planning' | 'active' | 'completed' | 'abandoned';
  startDate: string;
  endDate: string;
  objectives: BattleObjective[];
  blockers: string[];
  pivotTriggers: PivotTrigger[];
  metrics: BattlePlanMetrics;
  createdAt: number;
  updatedAt: number;
}

export interface BattleObjective {
  id: string;
  name: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'pivoted';
  linkedTasks: string[];
  impactScore: number;
  completionCriteria: string;
  blockers: string[];
}

export interface PivotTrigger {
  id: string;
  condition: string;
  action: string;
  triggered: boolean;
  triggeredAt?: number;
}

export interface BattlePlanMetrics {
  objectivesTotal: number;
  objectivesCompleted: number;
  blockerCount: number;
  pivotsExecuted: number;
  progressPercentage: number;
  velocityScore: number; // tasks completed per day
}

// --- STRATEGIC TEMPLATES TYPES ---

export interface StrategicTemplate {
  id: string;
  name: string;
  category: 'mvp' | 'landing_page' | 'cold_email' | 'pitch' | 'validation' | 'matrix' | 'blueprint';
  description: string;
  emoji: string;
  content: string;
  variables: TemplateVariable[];
  tags: string[];
  usageCount: number;
  avgRating: number;
  isCustom: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface TemplateVariable {
  name: string;
  description: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  options?: string[];
  defaultValue?: string;
  required: boolean;
}

// --- NEOVIM CONFIGURATION TYPES ---

export interface NeovimConfig {
  id: string;
  name: string;
  description: string;
  baseConfig: 'lazyvim' | 'nvchad' | 'astronvim' | 'custom';
  lspConfigs: LSPConfig[];
  plugins: NeovimPlugin[];
  keymaps: NeovimKeymap[];
  macros: NeovimMacro[];
  generatedContent: string;
  createdAt: number;
  updatedAt: number;
}

export interface LSPConfig {
  language: string;
  server: string;
  enabled: boolean;
  settings?: Record<string, unknown>;
}

export interface NeovimPlugin {
  name: string;
  repo: string;
  enabled: boolean;
  config?: string;
  lazy?: boolean;
}

export interface NeovimKeymap {
  mode: 'n' | 'i' | 'v' | 'x' | 'c';
  key: string;
  action: string;
  description: string;
}

export interface NeovimMacro {
  id: string;
  name: string;
  description: string;
  category: 'react' | 'api' | 'database' | 'crud' | 'mvp' | 'landing' | 'general';
  keybinding?: string;
  content: string;
}

// --- LOCAL AI AGENT TYPES ---

export interface AgentStatus {
  connected: boolean;
  agentName: string;
  agentVersion: string;
  capabilities: string[];
  lastPing: number;
  queuedTasks: number;
}

export interface AgentTask {
  id: string;
  type: 'file_generation' | 'code_refactor' | 'macro_execution' | 'analysis' | 'automation';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}

export interface AgentMessage {
  id: string;
  direction: 'to_agent' | 'from_agent';
  type: 'task' | 'status' | 'result' | 'error' | 'ping';
  payload: Record<string, unknown>;
  timestamp: number;
}

// --- NOTIFICATION TYPES (Extended) ---

export interface ExtendedNotification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'transfer' | 'share' | 'system' | 'warning' | 'focus' | 'deadline' | 'insight' | 'agent';
  payload?: Record<string, unknown>;
  read: boolean;
  actionRequired: boolean;
  actionType?: 'start_task' | 'review_prompt' | 'check_insight' | 'respond_agent';
  linkedItemId?: string;
  linkedItemType?: 'task' | 'project' | 'prompt' | 'insight';
}

// --- SYSTEM SETTINGS TYPES ---

export interface SystemSettings {
  productivityRules: ProductivityRule[];
  focusSettings: FocusSettings;
  notificationSettings: NotificationSettings;
  agentSettings: AgentSettings;
  displaySettings: DisplaySettings;
}

export interface ProductivityRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'auto_prioritize' | 'auto_archive' | 'procrastination_detect' | 'roi_optimize' | 'blocker_alert';
  config: Record<string, unknown>;
}

export interface FocusSettings {
  defaultFocusDuration: number; // minutes
  breakDuration: number; // minutes
  autoStartBreaks: boolean;
  blockNotificationsDuringFocus: boolean;
  peakHoursEnabled: boolean;
  preferredWorkHours: { start: number; end: number };
}

export interface NotificationSettings {
  deadlineReminders: boolean;
  deadlineReminderHours: number;
  focusWindowReminders: boolean;
  insightNotifications: boolean;
  agentNotifications: boolean;
  soundEnabled: boolean;
}

export interface AgentSettings {
  autoConnect: boolean;
  endpoint: string;
  authToken?: string;
  maxConcurrentTasks: number;
  autoExecuteMacros: boolean;
}

export interface DisplaySettings {
  defaultView: 'projects' | 'tasks' | 'prompts' | 'analytics' | 'battle-plan';
  sidebarCollapsed: boolean;
  compactMode: boolean;
  showCompletedTasks: boolean;
  sortTasksBy: 'priority' | 'due_date' | 'roi' | 'created';
}

// --- API RESPONSE TYPES ---

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// --- ENTJ RULES ENGINE TYPES ---

export interface ENTJRule {
  id: string;
  name: string;
  description: string;
  category: 'productivity' | 'velocity' | 'impact' | 'elimination' | 'automation' | 'pivot';
  condition: string;
  action: string;
  enabled: boolean;
  priority: number;
  triggerCount: number;
  lastTriggered?: number;
}

export interface ENTJEvaluation {
  itemId: string;
  itemType: 'task' | 'project' | 'idea' | 'prompt';
  impactScore: number;
  effortScore: number;
  roiScore: number;
  recommendation: 'execute' | 'delegate' | 'defer' | 'eliminate';
  reasoning: string;
  suggestedPriority: 'critical' | 'high' | 'medium' | 'low';
  flaggedForRemoval: boolean;
  evaluatedAt: number;
}
