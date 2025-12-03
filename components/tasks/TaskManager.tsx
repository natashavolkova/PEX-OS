'use client';

// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - TASK MANAGER
// ATHENA Architecture | Premium Dark Theme | ENTJ Task Execution
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Plus,
  ListTodo,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Target,
  TrendingUp,
  MoreVertical,
  Trash2,
  Edit3,
  Flag,
  Calendar,
  ArrowUpRight,
  Filter,
  Zap,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useProductivityStore } from '@/stores/productivityStore';
import type { Task, Project } from '@/types';

// --- TASK ROW COMPONENT ---

interface TaskRowProps {
  task: Task;
  project?: Project;
  onStart: () => void;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  project,
  onStart,
  onComplete,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const statusIcons = {
    pending: <Clock size={14} className="text-gray-400" />,
    in_progress: <Play size={14} className="text-[#2979ff]" />,
    blocked: <AlertTriangle size={14} className="text-red-400" />,
    completed: <CheckCircle2 size={14} className="text-green-400" />,
    cancelled: <Trash2 size={14} className="text-gray-500" />,
  };

  const priorityColors = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    low: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  const roiColor = task.roiScore >= 2 ? 'text-green-400' : task.roiScore >= 1.5 ? 'text-yellow-400' : 'text-gray-400';

  return (
    <div
      className={`
        group bg-[#1e2330] border border-white/5 rounded-lg p-3 hover:border-[#2979ff]/30 transition-all
        ${task.status === 'completed' ? 'opacity-60' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        {/* Status Icon */}
        <div className="shrink-0">{statusIcons[task.status]}</div>

        {/* Task Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base">{task.emoji || '📋'}</span>
            <h4
              className={`text-sm font-medium truncate ${
                task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'
              }`}
            >
              {task.name}
            </h4>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>
          
          <div className="flex items-center gap-3 mt-1">
            {project && (
              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                <span>{project.emoji}</span>
                {project.name}
              </span>
            )}
            {task.dueDate && (
              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                <Calendar size={10} />
                {task.dueDate}
              </span>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-center">
            <div className="text-[9px] text-gray-500 uppercase">Impact</div>
            <div className="text-xs font-bold text-white">{task.impactScore}</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-gray-500 uppercase">Effort</div>
            <div className="text-xs font-bold text-white">{task.effortScore}</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-gray-500 uppercase">ROI</div>
            <div className={`text-xs font-bold ${roiColor}`}>{task.roiScore.toFixed(1)}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {task.status === 'pending' && (
            <button
              onClick={onStart}
              className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
              title="Start Task"
            >
              <Play size={14} />
            </button>
          )}
          {task.status === 'in_progress' && (
            <button
              onClick={onComplete}
              className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
              title="Complete Task"
            >
              <CheckCircle2 size={14} />
            </button>
          )}
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-gray-400 hover:bg-white/5 rounded-lg transition-colors"
            >
              <MoreVertical size={14} />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 bg-[#252b3b] border border-white/10 rounded-lg shadow-xl z-20 py-1 min-w-[100px] animate-pop-in-menu">
                  <button
                    onClick={() => { onEdit(); setShowMenu(false); }}
                    className="w-full px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => { onDelete(); setShowMenu(false); }}
                    className="w-full px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Blockers */}
      {task.blockers.length > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <AlertTriangle size={12} className="text-red-400" />
          <span className="text-[10px] text-red-400">
            Blocked: {task.blockers.join(', ')}
          </span>
        </div>
      )}
    </div>
  );
};

// --- CREATE TASK MODAL ---

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, projectId }) => {
  const projects = useProductivityStore((s) => s.projects);
  const { addTask } = useProductivityStore((s) => s.actions);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    emoji: '📋',
    projectId: projectId || '',
    priority: 'medium' as Task['priority'],
    impactScore: 5,
    effortScore: 5,
    dueDate: '',
    estimatedMinutes: 60,
    tags: '',
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.name.trim() || !form.projectId) return;

    addTask({
      name: form.name,
      description: form.description,
      emoji: form.emoji,
      projectId: form.projectId,
      status: 'pending',
      priority: form.priority,
      impactScore: form.impactScore,
      effortScore: form.effortScore,
      owner: 'Natasha (ENTJ)',
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      dueDate: form.dueDate || undefined,
      estimatedMinutes: form.estimatedMinutes,
      blockers: [],
      dependencies: [],
    });

    setForm({
      name: '',
      description: '',
      emoji: '📋',
      projectId: projectId || '',
      priority: 'medium',
      impactScore: 5,
      effortScore: 5,
      dueDate: '',
      estimatedMinutes: 60,
      tags: '',
    });
    onClose();
  };

  const calculatedROI = form.effortScore > 0 
    ? (form.impactScore / form.effortScore).toFixed(1) 
    : '∞';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1e2330] border border-white/10 rounded-xl shadow-2xl w-full max-w-md p-0 animate-modal-bounce">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ListTodo size={18} className="text-[#2979ff]" />
            Create Task
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Project Selection */}
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
              Project
            </label>
            <select
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff]"
            >
              <option value="">Select a project...</option>
              {projects.filter((p) => p.status === 'active').map((p) => (
                <option key={p.id} value={p.id}>
                  {p.emoji} {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Task Name */}
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
              Task Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="What needs to be done?"
              className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff] transition-all"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Task details..."
              rows={2}
              className="w-full bg-[#0f111a] border border-white/10 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff] transition-all resize-none"
            />
          </div>

          {/* Impact & Effort Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                Impact (1-10)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={form.impactScore}
                onChange={(e) => setForm({ ...form, impactScore: parseInt(e.target.value) || 5 })}
                className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                Effort (1-10)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={form.effortScore}
                onChange={(e) => setForm({ ...form, effortScore: parseInt(e.target.value) || 5 })}
                className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                ROI Score
              </label>
              <div className="h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 flex items-center">
                <span className={`text-sm font-bold ${parseFloat(calculatedROI) >= 2 ? 'text-green-400' : parseFloat(calculatedROI) >= 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {calculatedROI}
                </span>
              </div>
            </div>
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff]"
              >
                <option value="critical">🔴 Critical</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">⚪ Low</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-white/5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg text-gray-300 border border-white/10 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.name.trim() || !form.projectId}
            className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-[#2979ff] hover:bg-[#2264d1] transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus size={14} />
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN TASK MANAGER COMPONENT ---

export const TaskManager: React.FC = () => {
  const tasks = useProductivityStore((s) => s.tasks);
  const projects = useProductivityStore((s) => s.projects);
  const { startTask, completeTask, deleteTask, getHighROITasks } = useProductivityStore((s) => s.actions);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'blocked' | 'completed'>('all');
  const [groupBy, setGroupBy] = useState<'none' | 'project' | 'priority'>('none');
  const [sortBy, setSortBy] = useState<'roi' | 'priority' | 'due_date' | 'created'>('roi');
  const [showHighROI, setShowHighROI] = useState(true);

  // Get project by ID helper
  const getProject = (projectId: string) => projects.find((p) => p.id === projectId);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => filter === 'all' || t.status === filter)
      .sort((a, b) => {
        switch (sortBy) {
          case 'roi':
            return b.roiScore - a.roiScore;
          case 'priority':
            const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          case 'due_date':
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          default:
            return b.createdAt - a.createdAt;
        }
      });
  }, [tasks, filter, sortBy]);

  // Group tasks
  const groupedTasks = useMemo(() => {
    if (groupBy === 'none') return { '': filteredTasks };
    
    return filteredTasks.reduce((acc, task) => {
      let key: string;
      if (groupBy === 'project') {
        const project = getProject(task.projectId);
        key = project ? `${project.emoji} ${project.name}` : 'No Project';
      } else {
        key = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
      }
      
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [filteredTasks, groupBy]);

  // High ROI tasks
  const highROITasks = getHighROITasks(5);

  // Stats
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const blockedCount = tasks.filter((t) => t.status === 'blocked').length;
  const completedToday = tasks.filter(
    (t) => t.completedAt && new Date(t.completedAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="h-full flex flex-col bg-[#0f111a] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Stats */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-gray-400" />
              <span className="text-gray-400">Pending:</span>
              <span className="text-white font-medium">{pendingCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Play size={12} className="text-[#2979ff]" />
              <span className="text-gray-400">Active:</span>
              <span className="text-white font-medium">{inProgressCount}</span>
            </div>
            {blockedCount > 0 && (
              <div className="flex items-center gap-1.5">
                <AlertTriangle size={12} className="text-red-400" />
                <span className="text-gray-400">Blocked:</span>
                <span className="text-red-400 font-medium">{blockedCount}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-green-400" />
              <span className="text-gray-400">Done today:</span>
              <span className="text-green-400 font-medium">{completedToday}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="h-8 bg-[#1e2330] border border-white/10 rounded-lg px-3 text-xs text-gray-300 focus:outline-none focus:border-[#2979ff]"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="completed">Completed</option>
          </select>

          {/* Group By */}
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)}
            className="h-8 bg-[#1e2330] border border-white/10 rounded-lg px-3 text-xs text-gray-300 focus:outline-none focus:border-[#2979ff]"
          >
            <option value="none">No Grouping</option>
            <option value="project">By Project</option>
            <option value="priority">By Priority</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-8 bg-[#1e2330] border border-white/10 rounded-lg px-3 text-xs text-gray-300 focus:outline-none focus:border-[#2979ff]"
          >
            <option value="roi">By ROI</option>
            <option value="priority">By Priority</option>
            <option value="due_date">By Due Date</option>
            <option value="created">By Created</option>
          </select>

          {/* Create Button */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="h-8 px-4 bg-[#2979ff] hover:bg-[#2264d1] text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
          >
            <Plus size={14} />
            New Task
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Task List */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {Object.entries(groupedTasks).map(([group, groupTasks]) => (
            <div key={group} className="mb-6">
              {group && (
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  {group}
                  <span className="text-[10px] font-normal text-gray-500">({groupTasks.length})</span>
                </h3>
              )}
              <div className="space-y-2">
                {groupTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    project={getProject(task.projectId)}
                    onStart={() => startTask(task.id)}
                    onComplete={() => completeTask(task.id)}
                    onEdit={() => {}}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))}
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ListTodo size={48} className="text-gray-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-400 mb-2">No tasks found</h3>
              <p className="text-xs text-gray-500 mb-4">
                Create your first task to start executing
              </p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-4 py-2 bg-[#2979ff] hover:bg-[#2264d1] text-white text-xs font-bold rounded-lg transition-all"
              >
                Create Task
              </button>
            </div>
          )}
        </div>

        {/* High ROI Sidebar */}
        {showHighROI && highROITasks.length > 0 && (
          <div className="w-80 border-l border-white/5 p-4 overflow-y-auto custom-scrollbar bg-[#13161c]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Zap size={14} className="text-yellow-400" />
                High ROI Tasks
              </h3>
              <button
                onClick={() => setShowHighROI(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                Hide
              </button>
            </div>

            <div className="space-y-2">
              {highROITasks.map((task, index) => {
                const project = getProject(task.projectId);
                return (
                  <div
                    key={task.id}
                    className="bg-[#1e2330] border border-white/5 rounded-lg p-3 hover:border-yellow-500/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-yellow-400 shrink-0">
                        #{index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-white truncate">
                          {task.name}
                        </h4>
                        {project && (
                          <span className="text-[10px] text-gray-500">
                            {project.emoji} {project.name}
                          </span>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-green-400 font-bold">
                            ROI: {task.roiScore.toFixed(1)}
                          </span>
                          <span className={`text-[10px] ${
                            task.priority === 'critical' ? 'text-red-400' :
                            task.priority === 'high' ? 'text-orange-400' :
                            task.priority === 'medium' ? 'text-yellow-400' : 'text-gray-400'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-[10px] text-yellow-400">
                💡 <strong>ENTJ Tip:</strong> Execute high ROI tasks first for maximum velocity and impact.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateTaskModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};

export default TaskManager;
