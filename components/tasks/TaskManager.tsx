'use client';

// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - TASK MANAGER
// ATHENA Architecture | Premium Dark Theme | ENTJ Task Execution
// Refactored: Uses extracted TaskRow and CreateTaskModal components
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Plus,
  ListTodo,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
} from 'lucide-react';
import { useProductivityStore } from '@/stores';
import type { Task, Project } from '@/types';
import { TaskRow } from './TaskRow';
import { CreateTaskModal } from './CreateTaskModal';

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
            onChange={(e) => setFilter(e.target.value as typeof filter)}
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
            onChange={(e) => setGroupBy(e.target.value as typeof groupBy)}
            className="h-8 bg-[#1e2330] border border-white/10 rounded-lg px-3 text-xs text-gray-300 focus:outline-none focus:border-[#2979ff]"
          >
            <option value="none">No Grouping</option>
            <option value="project">By Project</option>
            <option value="priority">By Priority</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
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
                    onEdit={() => { }}
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
              {highROITasks.map((task: Task, index: number) => {
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
                          <span className={`text-[10px] ${task.priority === 'critical' ? 'text-red-400' :
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
