// ============================================================================
// PEX-OS PRODUCTIVITY MANAGER - ZUSTAND STORE
// ATHENA Architecture | ENTJ Productivity System | State Management
// ============================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  Project,
  Task,
  TaskLog,
  PromptVersion,
  PromptAnalysis,
  YouTubeReference,
  YouTubeInsight,
  FocusWindow,
  DailyMetrics,
  ProductivityInsight,
  BattlePlan,
  StrategicTemplate,
  NeovimConfig,
  AgentStatus,
  AgentTask,
  SystemSettings,
  ENTJRule,
  ENTJEvaluation,
} from '@/types';

// --- UTILITY FUNCTIONS ---

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const calculateROI = (impact: number, effort: number): number => {
  if (effort === 0) return impact * 10;
  return Math.round((impact / effort) * 10) / 10;
};

const getTodayKey = () => new Date().toISOString().split('T')[0];

// --- INITIAL DATA ---

const initialProjects: Project[] = [
  {
    id: 'proj-demo-1',
    name: 'PEX-OS Core Development',
    description: 'Main development of the PEX-OS productivity platform',
    emoji: '🚀',
    status: 'active',
    priority: 'critical',
    impactScore: 9,
    roiScore: 8.5,
    owner: 'Natasha (ENTJ)',
    tags: ['core', 'development', 'priority'],
    startDate: '2024-01-01',
    deadline: '2024-03-31',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now(),
    tasksCount: 12,
    completedTasksCount: 5,
    linkedPrompts: [],
    linkedYoutubeRefs: [],
  },
];

const initialTasks: Task[] = [
  {
    id: 'task-demo-1',
    projectId: 'proj-demo-1',
    name: 'Implement Analytics Dashboard',
    description: 'Create comprehensive productivity analytics with heatmaps and insights',
    emoji: '📊',
    status: 'in_progress',
    priority: 'high',
    impactScore: 8,
    effortScore: 5,
    roiScore: 1.6,
    owner: 'Natasha (ENTJ)',
    tags: ['analytics', 'ui', 'high-impact'],
    estimatedMinutes: 240,
    blockers: [],
    dependencies: [],
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now(),
  },
  {
    id: 'task-demo-2',
    projectId: 'proj-demo-1',
    name: 'Build ENTJ Battle Plan Generator',
    description: 'Create aggressive sprint planning system with ROI optimization',
    emoji: '⚔️',
    status: 'pending',
    priority: 'critical',
    impactScore: 9,
    effortScore: 4,
    roiScore: 2.25,
    owner: 'Natasha (ENTJ)',
    tags: ['planning', 'entj', 'automation'],
    estimatedMinutes: 180,
    blockers: [],
    dependencies: [],
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now(),
  },
];

const initialBattlePlans: BattlePlan[] = [
  {
    id: 'bp-demo-1',
    name: 'Q1 Velocity Sprint',
    description: 'Maximum velocity sprint focusing on core feature delivery',
    type: 'sprint',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    objectives: [
      {
        id: 'obj-1',
        name: 'Complete Analytics Dashboard',
        description: 'Ship full analytics with heatmaps',
        priority: 'critical',
        status: 'in_progress',
        linkedTasks: ['task-demo-1'],
        impactScore: 9,
        completionCriteria: 'Dashboard live with all metrics',
        blockers: [],
      },
    ],
    blockers: [],
    pivotTriggers: [
      {
        id: 'pt-1',
        condition: 'Velocity < 3 tasks/day for 3 consecutive days',
        action: 'Review blockers and redistribute tasks',
        triggered: false,
      },
    ],
    metrics: {
      objectivesTotal: 1,
      objectivesCompleted: 0,
      blockerCount: 0,
      pivotsExecuted: 0,
      progressPercentage: 25,
      velocityScore: 4.2,
    },
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now(),
  },
];

const initialTemplates: StrategicTemplate[] = [
  {
    id: 'tpl-mvp-react',
    name: 'Micro-MVP React App',
    category: 'mvp',
    description: 'Minimal viable product template for React applications',
    emoji: '⚛️',
    content: `# {{projectName}} - Micro-MVP

## Core Value Proposition
{{valueProposition}}

## Target User
{{targetUser}}

## MVP Features (Max 3)
1. {{feature1}}
2. {{feature2}}
3. {{feature3}}

## Tech Stack
- React 18 + TypeScript
- {{stateManagement}}
- {{styling}}

## Timeline: {{timeline}} days

## Success Metrics
- {{metric1}}
- {{metric2}}`,
    variables: [
      { name: 'projectName', description: 'Project name', type: 'text', required: true },
      { name: 'valueProposition', description: 'Core value proposition', type: 'textarea', required: true },
      { name: 'targetUser', description: 'Target user persona', type: 'text', required: true },
      { name: 'feature1', description: 'MVP Feature 1', type: 'text', required: true },
      { name: 'feature2', description: 'MVP Feature 2', type: 'text', required: false },
      { name: 'feature3', description: 'MVP Feature 3', type: 'text', required: false },
      { name: 'stateManagement', description: 'State management', type: 'select', options: ['Zustand', 'Redux', 'Context API', 'Jotai'], required: true },
      { name: 'styling', description: 'Styling solution', type: 'select', options: ['Tailwind CSS', 'Styled Components', 'CSS Modules'], required: true },
      { name: 'timeline', description: 'Timeline in days', type: 'number', required: true },
      { name: 'metric1', description: 'Success metric 1', type: 'text', required: true },
      { name: 'metric2', description: 'Success metric 2', type: 'text', required: false },
    ],
    tags: ['react', 'mvp', 'development'],
    usageCount: 0,
    avgRating: 0,
    isCustom: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'tpl-landing-page',
    name: 'High-Conversion Landing Page',
    category: 'landing_page',
    description: 'Landing page template optimized for conversions',
    emoji: '🎯',
    content: `# {{productName}} Landing Page

## Headline (Max 10 words)
{{headline}}

## Subheadline (Value Proposition)
{{subheadline}}

## Hero Section
- Visual: {{heroVisual}}
- CTA Button: {{ctaText}}

## Pain Points (Address 3)
1. {{pain1}}
2. {{pain2}}
3. {{pain3}}

## Solution Benefits
1. {{benefit1}}
2. {{benefit2}}
3. {{benefit3}}

## Social Proof
- {{socialProof}}

## Final CTA
{{finalCTA}}

## Urgency Element
{{urgency}}`,
    variables: [
      { name: 'productName', description: 'Product name', type: 'text', required: true },
      { name: 'headline', description: 'Main headline', type: 'text', required: true },
      { name: 'subheadline', description: 'Subheadline with value prop', type: 'textarea', required: true },
      { name: 'heroVisual', description: 'Hero image description', type: 'text', required: true },
      { name: 'ctaText', description: 'CTA button text', type: 'text', required: true },
      { name: 'pain1', description: 'Pain point 1', type: 'text', required: true },
      { name: 'pain2', description: 'Pain point 2', type: 'text', required: true },
      { name: 'pain3', description: 'Pain point 3', type: 'text', required: false },
      { name: 'benefit1', description: 'Benefit 1', type: 'text', required: true },
      { name: 'benefit2', description: 'Benefit 2', type: 'text', required: true },
      { name: 'benefit3', description: 'Benefit 3', type: 'text', required: false },
      { name: 'socialProof', description: 'Social proof element', type: 'text', required: true },
      { name: 'finalCTA', description: 'Final call to action', type: 'text', required: true },
      { name: 'urgency', description: 'Urgency element', type: 'text', required: false },
    ],
    tags: ['landing', 'conversion', 'marketing'],
    usageCount: 0,
    avgRating: 0,
    isCustom: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'tpl-cold-email',
    name: 'Cold Email Sequence',
    category: 'cold_email',
    description: 'High-response cold email template for outreach',
    emoji: '📧',
    content: `# Cold Email: {{purpose}}

## Email 1 - Initial Contact

**Subject:** {{subject1}}

{{recipientName}},

{{hook}}

{{valueStatement}}

{{credibility}}

{{cta1}}

Best,
{{senderName}}

---

## Email 2 - Follow Up (3 days later)

**Subject:** Re: {{subject1}}

{{recipientName}},

{{followUpHook}}

{{additionalValue}}

{{cta2}}

{{senderName}}

---

## Email 3 - Break Up (5 days later)

**Subject:** Should I close your file?

{{recipientName}},

{{breakUpMessage}}

{{finalCta}}

{{senderName}}`,
    variables: [
      { name: 'purpose', description: 'Purpose of outreach', type: 'text', required: true },
      { name: 'subject1', description: 'Subject line', type: 'text', required: true },
      { name: 'recipientName', description: 'Recipient name placeholder', type: 'text', defaultValue: '{{name}}', required: true },
      { name: 'hook', description: 'Opening hook', type: 'textarea', required: true },
      { name: 'valueStatement', description: 'Value statement', type: 'textarea', required: true },
      { name: 'credibility', description: 'Credibility element', type: 'text', required: true },
      { name: 'cta1', description: 'Call to action 1', type: 'text', required: true },
      { name: 'senderName', description: 'Your name', type: 'text', required: true },
      { name: 'followUpHook', description: 'Follow up hook', type: 'textarea', required: true },
      { name: 'additionalValue', description: 'Additional value', type: 'textarea', required: true },
      { name: 'cta2', description: 'Call to action 2', type: 'text', required: true },
      { name: 'breakUpMessage', description: 'Break up message', type: 'textarea', required: true },
      { name: 'finalCta', description: 'Final CTA', type: 'text', required: true },
    ],
    tags: ['email', 'outreach', 'sales'],
    usageCount: 0,
    avgRating: 0,
    isCustom: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'tpl-impact-matrix',
    name: 'Impact vs Effort Matrix',
    category: 'matrix',
    description: 'ENTJ-style prioritization matrix',
    emoji: '📈',
    content: `# Impact vs Effort Matrix: {{projectName}}

## Quick Wins (High Impact, Low Effort) ⚡
Execute immediately:
{{quickWins}}

## Strategic Projects (High Impact, High Effort) 🎯
Schedule and resource:
{{strategic}}

## Fill-Ins (Low Impact, Low Effort) 📝
Do when time permits:
{{fillIns}}

## Time Wasters (Low Impact, High Effort) 🚫
ELIMINATE or DELEGATE:
{{eliminate}}

---

## ENTJ Decision Rules:
1. Quick Wins first - immediate ROI
2. Strategic Projects - schedule in focused blocks
3. Fill-Ins - delegate or batch
4. Time Wasters - ruthlessly eliminate

## Action Items:
{{actionItems}}`,
    variables: [
      { name: 'projectName', description: 'Project or context name', type: 'text', required: true },
      { name: 'quickWins', description: 'Quick wins list', type: 'textarea', required: true },
      { name: 'strategic', description: 'Strategic projects list', type: 'textarea', required: true },
      { name: 'fillIns', description: 'Fill-in tasks list', type: 'textarea', required: false },
      { name: 'eliminate', description: 'Items to eliminate', type: 'textarea', required: true },
      { name: 'actionItems', description: 'Immediate action items', type: 'textarea', required: true },
    ],
    tags: ['prioritization', 'matrix', 'entj'],
    usageCount: 0,
    avgRating: 0,
    isCustom: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

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
  {
    id: 'rule-6',
    name: 'Procrastination Pattern Detection',
    description: 'Detect and alert on procrastination patterns',
    category: 'productivity',
    condition: 'hourlyActivity.filter(h => h.activityLevel === "none").length > 4',
    action: 'Warning: Procrastination detected. Suggest focus session',
    enabled: true,
    priority: 6,
    triggerCount: 0,
  },
  {
    id: 'rule-7',
    name: 'ROI Optimization',
    description: 'Continuously optimize for highest ROI tasks',
    category: 'automation',
    condition: 'queue.some(t => t.roiScore > currentTask.roiScore * 1.5)',
    action: 'Higher ROI task available. Consider switching',
    enabled: true,
    priority: 7,
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

interface ProductivityState {
  // Data
  projects: Project[];
  tasks: Task[];
  taskLogs: TaskLog[];
  promptVersions: PromptVersion[];
  promptAnalyses: PromptAnalysis[];
  youtubeRefs: YouTubeReference[];
  focusWindows: FocusWindow[];
  dailyMetrics: DailyMetrics[];
  insights: ProductivityInsight[];
  battlePlans: BattlePlan[];
  templates: StrategicTemplate[];
  neovimConfigs: NeovimConfig[];
  entjRules: ENTJRule[];
  evaluations: ENTJEvaluation[];
  
  // Agent State
  agentStatus: AgentStatus;
  agentTasks: AgentTask[];
  
  // System
  settings: SystemSettings;
  
  // UI State
  activeSection: 'projects' | 'tasks' | 'prompts' | 'analytics' | 'youtube' | 'templates' | 'neovim' | 'battle-plan' | 'agent';
  selectedProjectId: string | null;
  selectedTaskId: string | null;
  currentFocusWindow: FocusWindow | null;
  
  // Actions
  actions: {
    // Projects
    addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasksCount' | 'completedTasksCount'>) => string;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    archiveProject: (id: string) => void;
    
    // Tasks
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'roiScore'>) => string;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    startTask: (id: string) => void;
    completeTask: (id: string, actualMinutes?: number) => void;
    blockTask: (id: string, blocker: string) => void;
    
    // Task Logs
    logTaskAction: (taskId: string, action: TaskLog['action'], notes?: string) => void;
    
    // Prompt Versions
    addPromptVersion: (promptId: string, content: string, changelog: string) => void;
    getPromptVersions: (promptId: string) => PromptVersion[];
    
    // YouTube References
    addYoutubeRef: (ref: Omit<YouTubeReference, 'id' | 'addedAt' | 'updatedAt'>) => string;
    updateYoutubeRef: (id: string, updates: Partial<YouTubeReference>) => void;
    deleteYoutubeRef: (id: string) => void;
    addYoutubeInsight: (refId: string, insight: Omit<YouTubeInsight, 'id' | 'referenceId' | 'createdAt'>) => void;
    
    // Focus Windows
    startFocusWindow: (type: FocusWindow['type']) => void;
    endFocusWindow: (tasksCompleted?: string[]) => void;
    
    // Analytics
    updateDailyMetrics: (metrics: Partial<DailyMetrics>) => void;
    generateInsight: (insight: Omit<ProductivityInsight, 'id' | 'createdAt'>) => void;
    dismissInsight: (id: string) => void;
    
    // Battle Plans
    addBattlePlan: (plan: Omit<BattlePlan, 'id' | 'createdAt' | 'updatedAt'>) => string;
    updateBattlePlan: (id: string, updates: Partial<BattlePlan>) => void;
    deleteBattlePlan: (id: string) => void;
    
    // Templates
    addTemplate: (template: Omit<StrategicTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'avgRating'>) => string;
    updateTemplate: (id: string, updates: Partial<StrategicTemplate>) => void;
    deleteTemplate: (id: string) => void;
    useTemplate: (id: string) => void;
    
    // Neovim
    addNeovimConfig: (config: Omit<NeovimConfig, 'id' | 'createdAt' | 'updatedAt'>) => string;
    updateNeovimConfig: (id: string, updates: Partial<NeovimConfig>) => void;
    deleteNeovimConfig: (id: string) => void;
    
    // Agent
    setAgentStatus: (status: Partial<AgentStatus>) => void;
    addAgentTask: (task: Omit<AgentTask, 'id' | 'createdAt'>) => string;
    updateAgentTask: (id: string, updates: Partial<AgentTask>) => void;
    
    // ENTJ Rules
    toggleRule: (id: string) => void;
    evaluateItem: (itemId: string, itemType: ENTJEvaluation['itemType']) => ENTJEvaluation;
    
    // Settings
    updateSettings: (settings: Partial<SystemSettings>) => void;
    
    // UI
    setActiveSection: (section: ProductivityState['activeSection']) => void;
    setSelectedProject: (id: string | null) => void;
    setSelectedTask: (id: string | null) => void;
    
    // Utilities
    getProjectTasks: (projectId: string) => Task[];
    getHighROITasks: (limit?: number) => Task[];
    getTodayMetrics: () => DailyMetrics | null;
    calculateWeeklyHeatmap: () => any;
  };
}

// --- ZUSTAND STORE ---

export const useProductivityStore = create<ProductivityState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        projects: initialProjects,
        tasks: initialTasks,
        taskLogs: [],
        promptVersions: [],
        promptAnalyses: [],
        youtubeRefs: [],
        focusWindows: [],
        dailyMetrics: [],
        insights: [],
        battlePlans: initialBattlePlans,
        templates: initialTemplates,
        neovimConfigs: [],
        entjRules: initialENTJRules,
        evaluations: [],
        agentStatus: {
          connected: false,
          agentName: 'Fara-7B',
          agentVersion: '1.0.0',
          capabilities: ['file_generation', 'code_refactor', 'macro_execution'],
          lastPing: 0,
          queuedTasks: 0,
        },
        agentTasks: [],
        settings: initialSettings,
        activeSection: 'projects',
        selectedProjectId: null,
        selectedTaskId: null,
        currentFocusWindow: null,

        actions: {
          // Projects
          addProject: (project) => {
            const id = generateId();
            const newProject: Project = {
              ...project,
              id,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              tasksCount: 0,
              completedTasksCount: 0,
              roiScore: calculateROI(project.impactScore, 5),
            };
            set((state) => ({
              projects: [newProject, ...state.projects],
            }));
            return id;
          },
          
          updateProject: (id, updates) =>
            set((state) => ({
              projects: state.projects.map((p) =>
                p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
              ),
            })),
          
          deleteProject: (id) =>
            set((state) => ({
              projects: state.projects.filter((p) => p.id !== id),
              tasks: state.tasks.filter((t) => t.projectId !== id),
            })),
          
          archiveProject: (id) =>
            set((state) => ({
              projects: state.projects.map((p) =>
                p.id === id ? { ...p, status: 'archived', updatedAt: Date.now() } : p
              ),
            })),

          // Tasks
          addTask: (task) => {
            const id = generateId();
            const roiScore = calculateROI(task.impactScore, task.effortScore);
            const newTask: Task = {
              ...task,
              id,
              roiScore,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            set((state) => ({
              tasks: [newTask, ...state.tasks],
              projects: state.projects.map((p) =>
                p.id === task.projectId
                  ? { ...p, tasksCount: p.tasksCount + 1, updatedAt: Date.now() }
                  : p
              ),
            }));
            get().actions.logTaskAction(id, 'created');
            return id;
          },
          
          updateTask: (id, updates) => {
            set((state) => {
              const task = state.tasks.find((t) => t.id === id);
              if (!task) return state;
              
              const newImpact = updates.impactScore ?? task.impactScore;
              const newEffort = updates.effortScore ?? task.effortScore;
              const roiScore = calculateROI(newImpact, newEffort);
              
              return {
                tasks: state.tasks.map((t) =>
                  t.id === id
                    ? { ...t, ...updates, roiScore, updatedAt: Date.now() }
                    : t
                ),
              };
            });
            get().actions.logTaskAction(id, 'updated');
          },
          
          deleteTask: (id) => {
            const task = get().tasks.find((t) => t.id === id);
            set((state) => ({
              tasks: state.tasks.filter((t) => t.id !== id),
              projects: task
                ? state.projects.map((p) =>
                    p.id === task.projectId
                      ? { ...p, tasksCount: Math.max(0, p.tasksCount - 1), updatedAt: Date.now() }
                      : p
                  )
                : state.projects,
            }));
          },
          
          startTask: (id) => {
            set((state) => ({
              tasks: state.tasks.map((t) =>
                t.id === id
                  ? { ...t, status: 'in_progress', startedAt: Date.now(), updatedAt: Date.now() }
                  : t
              ),
            }));
            get().actions.logTaskAction(id, 'started');
          },
          
          completeTask: (id, actualMinutes) => {
            const task = get().tasks.find((t) => t.id === id);
            set((state) => ({
              tasks: state.tasks.map((t) =>
                t.id === id
                  ? {
                      ...t,
                      status: 'completed',
                      completedAt: Date.now(),
                      actualMinutes: actualMinutes ?? t.actualMinutes,
                      updatedAt: Date.now(),
                    }
                  : t
              ),
              projects: task
                ? state.projects.map((p) =>
                    p.id === task.projectId
                      ? { ...p, completedTasksCount: p.completedTasksCount + 1, updatedAt: Date.now() }
                      : p
                  )
                : state.projects,
            }));
            get().actions.logTaskAction(id, 'completed');
          },
          
          blockTask: (id, blocker) => {
            set((state) => ({
              tasks: state.tasks.map((t) =>
                t.id === id
                  ? {
                      ...t,
                      status: 'blocked',
                      blockers: [...t.blockers, blocker],
                      updatedAt: Date.now(),
                    }
                  : t
              ),
            }));
            get().actions.logTaskAction(id, 'blocked', blocker);
          },

          // Task Logs
          logTaskAction: (taskId, action, notes) => {
            const log: TaskLog = {
              id: generateId(),
              taskId,
              action,
              notes,
              timestamp: Date.now(),
            };
            set((state) => ({
              taskLogs: [log, ...state.taskLogs],
            }));
          },

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

          // YouTube References
          addYoutubeRef: (ref) => {
            const id = generateId();
            const newRef: YouTubeReference = {
              ...ref,
              id,
              addedAt: Date.now(),
              updatedAt: Date.now(),
            };
            set((state) => ({
              youtubeRefs: [newRef, ...state.youtubeRefs],
            }));
            return id;
          },
          
          updateYoutubeRef: (id, updates) =>
            set((state) => ({
              youtubeRefs: state.youtubeRefs.map((r) =>
                r.id === id ? { ...r, ...updates, updatedAt: Date.now() } : r
              ),
            })),
          
          deleteYoutubeRef: (id) =>
            set((state) => ({
              youtubeRefs: state.youtubeRefs.filter((r) => r.id !== id),
            })),
          
          addYoutubeInsight: (refId, insight) => {
            const newInsight: YouTubeInsight = {
              ...insight,
              id: generateId(),
              referenceId: refId,
              createdAt: Date.now(),
            };
            set((state) => ({
              youtubeRefs: state.youtubeRefs.map((r) =>
                r.id === refId
                  ? { ...r, insights: [...r.insights, newInsight], updatedAt: Date.now() }
                  : r
              ),
            }));
          },

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

          // Analytics
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

          // Battle Plans
          addBattlePlan: (plan) => {
            const id = generateId();
            const newPlan: BattlePlan = {
              ...plan,
              id,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            set((state) => ({
              battlePlans: [newPlan, ...state.battlePlans],
            }));
            return id;
          },
          
          updateBattlePlan: (id, updates) =>
            set((state) => ({
              battlePlans: state.battlePlans.map((p) =>
                p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
              ),
            })),
          
          deleteBattlePlan: (id) =>
            set((state) => ({
              battlePlans: state.battlePlans.filter((p) => p.id !== id),
            })),

          // Templates
          addTemplate: (template) => {
            const id = generateId();
            const newTemplate: StrategicTemplate = {
              ...template,
              id,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              usageCount: 0,
              avgRating: 0,
            };
            set((state) => ({
              templates: [newTemplate, ...state.templates],
            }));
            return id;
          },
          
          updateTemplate: (id, updates) =>
            set((state) => ({
              templates: state.templates.map((t) =>
                t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
              ),
            })),
          
          deleteTemplate: (id) =>
            set((state) => ({
              templates: state.templates.filter((t) => t.id !== id),
            })),
          
          useTemplate: (id) =>
            set((state) => ({
              templates: state.templates.map((t) =>
                t.id === id ? { ...t, usageCount: t.usageCount + 1 } : t
              ),
            })),

          // Neovim
          addNeovimConfig: (config) => {
            const id = generateId();
            const newConfig: NeovimConfig = {
              ...config,
              id,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            set((state) => ({
              neovimConfigs: [newConfig, ...state.neovimConfigs],
            }));
            return id;
          },
          
          updateNeovimConfig: (id, updates) =>
            set((state) => ({
              neovimConfigs: state.neovimConfigs.map((c) =>
                c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
              ),
            })),
          
          deleteNeovimConfig: (id) =>
            set((state) => ({
              neovimConfigs: state.neovimConfigs.filter((c) => c.id !== id),
            })),

          // Agent
          setAgentStatus: (status) =>
            set((state) => ({
              agentStatus: { ...state.agentStatus, ...status },
            })),
          
          addAgentTask: (task) => {
            const id = generateId();
            const newTask: AgentTask = {
              ...task,
              id,
              createdAt: Date.now(),
            };
            set((state) => ({
              agentTasks: [newTask, ...state.agentTasks],
              agentStatus: {
                ...state.agentStatus,
                queuedTasks: state.agentStatus.queuedTasks + 1,
              },
            }));
            return id;
          },
          
          updateAgentTask: (id, updates) =>
            set((state) => ({
              agentTasks: state.agentTasks.map((t) =>
                t.id === id ? { ...t, ...updates } : t
              ),
            })),

          // ENTJ Rules
          toggleRule: (id) =>
            set((state) => ({
              entjRules: state.entjRules.map((r) =>
                r.id === id ? { ...r, enabled: !r.enabled } : r
              ),
            })),
          
          evaluateItem: (itemId, itemType) => {
            const state = get();
            let item: any;
            
            if (itemType === 'task') {
              item = state.tasks.find((t) => t.id === itemId);
            } else if (itemType === 'project') {
              item = state.projects.find((p) => p.id === itemId);
            }
            
            if (!item) {
              throw new Error('Item not found');
            }
            
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

          // Settings
          updateSettings: (settings) =>
            set((state) => ({
              settings: { ...state.settings, ...settings },
            })),

          // UI
          setActiveSection: (section) => set({ activeSection: section }),
          setSelectedProject: (id) => set({ selectedProjectId: id }),
          setSelectedTask: (id) => set({ selectedTaskId: id }),

          // Utilities
          getProjectTasks: (projectId) =>
            get().tasks.filter((t) => t.projectId === projectId),
          
          getHighROITasks: (limit = 10) =>
            [...get().tasks]
              .filter((t) => t.status !== 'completed' && t.status !== 'cancelled')
              .sort((a, b) => b.roiScore - a.roiScore)
              .slice(0, limit),
          
          getTodayMetrics: () =>
            get().dailyMetrics.find((m) => m.date === getTodayKey()) || null,
          
          calculateWeeklyHeatmap: () => {
            const metrics = get().dailyMetrics.slice(0, 7);
            // Return heatmap data structure
            return metrics.map((m) => ({
              date: m.date,
              activity: m.hourlyActivity,
              score: m.productivityScore,
            }));
          },
        },
      }),
      {
        name: 'pex-os-productivity',
        partialize: (state) => ({
          projects: state.projects,
          tasks: state.tasks,
          taskLogs: state.taskLogs,
          promptVersions: state.promptVersions,
          youtubeRefs: state.youtubeRefs,
          focusWindows: state.focusWindows,
          dailyMetrics: state.dailyMetrics,
          insights: state.insights,
          battlePlans: state.battlePlans,
          templates: state.templates,
          neovimConfigs: state.neovimConfigs,
          entjRules: state.entjRules,
          settings: state.settings,
        }),
      }
    ),
    { name: 'ProductivityStore' }
  )
);

// Selector hooks
export const useProjects = () => useProductivityStore((s) => s.projects);
export const useTasks = () => useProductivityStore((s) => s.tasks);
export const useActiveSection = () => useProductivityStore((s) => s.activeSection);
export const useBattlePlans = () => useProductivityStore((s) => s.battlePlans);
export const useTemplates = () => useProductivityStore((s) => s.templates);
export const useAgentStatus = () => useProductivityStore((s) => s.agentStatus);
export const useProductivityActions = () => useProductivityStore((s) => s.actions);
