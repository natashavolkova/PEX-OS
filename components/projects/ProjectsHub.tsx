'use client';

// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - PROJECTS HUB
// ATHENA Architecture | Premium Dark Theme | ENTJ Project Management
// ============================================================================

import React, { useState } from 'react';
import {
  Plus,
  FolderKanban,
  Clock,
  Target,
  TrendingUp,
  Archive,
  MoreVertical,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Pause,
  Play,
  Trash2,
  Edit3,
  ExternalLink,
  Filter,
  SortAsc,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useProductivityStore } from '@/stores';
import type { Project } from '@/types';

// --- PROJECT CARD COMPONENT ---

interface ProjectCardProps {
  project: Project;
  onSelect: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  onEdit,
  onArchive,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const progress = project.tasksCount > 0
    ? Math.round((project.completedTasksCount / project.tasksCount) * 100)
    : 0;

  const statusColors = {
    active: 'bg-green-500/10 text-green-400 border-green-500/20',
    archived: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    on_hold: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };

  const priorityColors = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-yellow-400',
    low: 'text-gray-400',
  };

  return (
    <div
      className="group bg-[#1e2330] border border-white/5 rounded-xl p-4 hover:border-[#2979ff]/30 transition-all cursor-pointer animate-slide-up-fade relative"
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{project.emoji || '📁'}</span>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-[#2979ff] transition-colors line-clamp-1">
              {project.name}
            </h3>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${statusColors[project.status]}`}>
              {project.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded opacity-0 group-hover:opacity-100 transition-all"
          >
            <MoreVertical size={14} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-[#252b3b] border border-white/10 rounded-lg shadow-xl z-20 py-1 min-w-[120px] animate-pop-in-menu">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
              >
                <Edit3 size={12} /> Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
              >
                <Archive size={12} /> Archive
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 line-clamp-2 mb-3">
        {project.description}
      </p>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="text-gray-400">{progress}%</span>
        </div>
        <div className="h-1.5 bg-[#0f111a] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2979ff] to-[#5b4eff] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-[#0f111a] rounded-lg p-2 text-center">
          <div className="text-[10px] text-gray-500 mb-0.5">Tasks</div>
          <div className="text-xs font-bold text-white">
            {project.completedTasksCount}/{project.tasksCount}
          </div>
        </div>
        <div className="bg-[#0f111a] rounded-lg p-2 text-center">
          <div className="text-[10px] text-gray-500 mb-0.5">Impact</div>
          <div className={`text-xs font-bold ${priorityColors[project.priority]}`}>
            {project.impactScore}/10
          </div>
        </div>
        <div className="bg-[#0f111a] rounded-lg p-2 text-center">
          <div className="text-[10px] text-gray-500 mb-0.5">ROI</div>
          <div className="text-xs font-bold text-green-400">
            {project.roiScore.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <Calendar size={10} />
          <span>{project.deadline ? `Due: ${project.deadline}` : 'No deadline'}</span>
        </div>
        <div className="flex -space-x-1">
          {project.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[9px] px-1.5 py-0.5 bg-[#2979ff]/10 text-[#2979ff] rounded-full border border-[#2979ff]/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- CREATE PROJECT MODAL ---

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { addProject } = useProductivityStore((s) => s.actions);
  const [form, setForm] = useState({
    name: '',
    description: '',
    emoji: '📁',
    priority: 'medium' as Project['priority'],
    impactScore: 5,
    deadline: '',
    tags: '',
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    addProject({
      name: form.name,
      description: form.description,
      emoji: form.emoji,
      status: 'active',
      priority: form.priority,
      impactScore: form.impactScore,
      roiScore: 0,
      owner: 'Natasha (ENTJ)',
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      startDate: new Date().toISOString().split('T')[0],
      deadline: form.deadline || undefined,
      linkedPrompts: [],
      linkedYoutubeRefs: [],
    });

    setForm({
      name: '',
      description: '',
      emoji: '📁',
      priority: 'medium',
      impactScore: 5,
      deadline: '',
      tags: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1e2330] border border-white/10 rounded-xl shadow-2xl w-full max-w-md p-0 animate-modal-bounce">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FolderKanban size={18} className="text-[#2979ff]" />
            Create Project
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
              Project Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter project name"
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
              placeholder="What is this project about?"
              rows={3}
              className="w-full bg-[#0f111a] border border-white/10 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff] transition-all resize-none"
            />
          </div>

          {/* Priority & Impact */}
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
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                Impact Score (1-10)
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
          </div>

          {/* Deadline & Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                Deadline
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="dev, core, urgent"
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
            disabled={!form.name.trim()}
            className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-[#2979ff] hover:bg-[#2264d1] transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus size={14} />
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PROJECTS HUB COMPONENT ---

export const ProjectsHub: React.FC = () => {
  const projects = useProductivityStore((s) => s.projects);
  const { setSelectedProject, archiveProject, deleteProject } = useProductivityStore((s) => s.actions);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'archived' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'priority' | 'roi'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort projects
  const filteredProjects = projects
    .filter((p) => filter === 'all' || p.status === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'roi':
          return b.roiScore - a.roiScore;
        default:
          return b.updatedAt - a.updatedAt;
      }
    });

  // Stats
  const activeCount = projects.filter((p) => p.status === 'active').length;
  const completedCount = projects.filter((p) => p.status === 'completed').length;
  const avgROI = projects.length > 0
    ? (projects.reduce((sum, p) => sum + p.roiScore, 0) / projects.length).toFixed(1)
    : '0';

  return (
    <div className="h-full flex flex-col bg-[#0f111a] overflow-hidden">
      {/* Header Actions */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Stats */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-400">Active:</span>
              <span className="text-white font-medium">{activeCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-gray-400">Completed:</span>
              <span className="text-white font-medium">{completedCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={12} className="text-green-400" />
              <span className="text-gray-400">Avg ROI:</span>
              <span className="text-green-400 font-medium">{avgROI}</span>
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
            <option value="all">All Projects</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="completed">Completed</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-8 bg-[#1e2330] border border-white/10 rounded-lg px-3 text-xs text-gray-300 focus:outline-none focus:border-[#2979ff]"
          >
            <option value="updated">Recently Updated</option>
            <option value="priority">Priority</option>
            <option value="roi">ROI Score</option>
          </select>

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-[#1e2330] border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-[#2979ff] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-[#2979ff] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List size={14} />
            </button>
          </div>

          {/* Create Button */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="h-8 px-4 bg-[#2979ff] hover:bg-[#2264d1] text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
          >
            <Plus size={14} />
            New Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FolderKanban size={48} className="text-gray-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-400 mb-2">No projects yet</h3>
            <p className="text-xs text-gray-500 mb-4">
              Create your first project to start tracking your work
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 bg-[#2979ff] hover:bg-[#2264d1] text-white text-xs font-bold rounded-lg transition-all"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-3'
            }
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={() => setSelectedProject(project.id)}
                onEdit={() => { }}
                onArchive={() => archiveProject(project.id)}
                onDelete={() => deleteProject(project.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateProjectModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};

export default ProjectsHub;
