'use client';

// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - ENTJ BATTLE PLAN GENERATOR
// ATHENA Architecture | Premium Dark Theme | Aggressive Sprint Planning
// ============================================================================

import React, { useState } from 'react';
import {
  Swords,
  Plus,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Flag,
  ChevronRight,
  MoreVertical,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Edit3,
  Calendar,
} from 'lucide-react';
import { useProductivityStore } from '@/stores/productivityStore';
import type { BattlePlan, BattleObjective } from '@/types';

// --- OBJECTIVE ITEM COMPONENT ---

interface ObjectiveItemProps {
  objective: BattleObjective;
  onStatusChange: (status: BattleObjective['status']) => void;
}

const ObjectiveItem: React.FC<ObjectiveItemProps> = ({ objective, onStatusChange }) => {
  const statusColors = {
    pending: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
    in_progress: 'text-[#2979ff] bg-[#2979ff]/10 border-[#2979ff]/20',
    completed: 'text-green-400 bg-green-500/10 border-green-500/20',
    blocked: 'text-red-400 bg-red-500/10 border-red-500/20',
    pivoted: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  };

  const statusIcons = {
    pending: <Clock size={12} />,
    in_progress: <Play size={12} />,
    completed: <CheckCircle2 size={12} />,
    blocked: <AlertTriangle size={12} />,
    pivoted: <RotateCcw size={12} />,
  };

  return (
    <div className="bg-[#0f111a] border border-white/5 rounded-lg p-3 hover:border-white/10 transition-all group">
      <div className="flex items-start gap-3">
        <div className={`shrink-0 p-1.5 rounded border ${statusColors[objective.status]}`}>
          {statusIcons[objective.status]}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-white truncate">{objective.name}</h4>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${
              objective.priority === 'critical' ? 'text-red-400 border-red-500/20' :
              objective.priority === 'high' ? 'text-orange-400 border-orange-500/20' :
              'text-yellow-400 border-yellow-500/20'
            }`}>
              {objective.priority}
            </span>
          </div>
          
          <p className="text-[10px] text-gray-400 line-clamp-2 mb-2">
            {objective.description}
          </p>
          
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-gray-500">
              Impact: <span className="text-green-400 font-bold">{objective.impactScore}/10</span>
            </span>
            <span className="text-[9px] text-gray-500">
              Tasks: <span className="text-white font-medium">{objective.linkedTasks.length}</span>
            </span>
          </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <select
            value={objective.status}
            onChange={(e) => onStatusChange(e.target.value as BattleObjective['status'])}
            className="h-7 bg-[#1e2330] border border-white/10 rounded px-2 text-[10px] text-gray-300 focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
            <option value="pivoted">Pivoted</option>
          </select>
        </div>
      </div>

      {objective.blockers.length > 0 && (
        <div className="mt-2 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1 text-[9px] text-red-400">
            <AlertTriangle size={10} />
            Blockers: {objective.blockers.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};

// --- BATTLE PLAN CARD COMPONENT ---

interface BattlePlanCardProps {
  plan: BattlePlan;
  onSelect: () => void;
  onDelete: () => void;
}

const BattlePlanCard: React.FC<BattlePlanCardProps> = ({ plan, onSelect, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const statusColors = {
    planning: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    active: 'bg-green-500/10 text-green-400 border-green-500/20',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    abandoned: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const typeIcons = {
    daily: '📅',
    weekly: '📆',
    sprint: '⚡',
    quarterly: '🎯',
  };

  return (
    <div
      className="bg-[#1e2330] border border-white/5 rounded-xl p-4 hover:border-[#2979ff]/30 transition-all cursor-pointer group"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeIcons[plan.type]}</span>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-[#2979ff] transition-colors">
              {plan.name}
            </h3>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${statusColors[plan.status]}`}>
              {plan.status}
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
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
              <div className="absolute right-0 top-full mt-1 bg-[#252b3b] border border-white/10 rounded-lg shadow-xl z-20 py-1 min-w-[100px] animate-pop-in-menu">
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
            </>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 line-clamp-2 mb-3">{plan.description}</p>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="text-gray-400">{plan.metrics.progressPercentage}%</span>
        </div>
        <div className="h-1.5 bg-[#0f111a] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2979ff] to-[#5b4eff] rounded-full transition-all"
            style={{ width: `${plan.metrics.progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-[#0f111a] rounded-lg p-2 text-center">
          <div className="text-[9px] text-gray-500">Objectives</div>
          <div className="text-xs font-bold text-white">
            {plan.metrics.objectivesCompleted}/{plan.metrics.objectivesTotal}
          </div>
        </div>
        <div className="bg-[#0f111a] rounded-lg p-2 text-center">
          <div className="text-[9px] text-gray-500">Velocity</div>
          <div className="text-xs font-bold text-green-400">
            {plan.metrics.velocityScore.toFixed(1)}
          </div>
        </div>
        <div className="bg-[#0f111a] rounded-lg p-2 text-center">
          <div className="text-[9px] text-gray-500">Pivots</div>
          <div className="text-xs font-bold text-yellow-400">
            {plan.metrics.pivotsExecuted}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar size={10} />
          {plan.startDate} → {plan.endDate}
        </div>
        {plan.metrics.blockerCount > 0 && (
          <div className="flex items-center gap-1 text-red-400">
            <AlertTriangle size={10} />
            {plan.metrics.blockerCount} blocker(s)
          </div>
        )}
      </div>
    </div>
  );
};

// --- CREATE BATTLE PLAN MODAL ---

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePlanModal: React.FC<CreatePlanModalProps> = ({ isOpen, onClose }) => {
  const { addBattlePlan } = useProductivityStore((s) => s.actions);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'sprint' as BattlePlan['type'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.name.trim() || !form.endDate) return;

    addBattlePlan({
      name: form.name,
      description: form.description,
      type: form.type,
      status: 'planning',
      startDate: form.startDate,
      endDate: form.endDate,
      objectives: [],
      blockers: [],
      pivotTriggers: [],
      metrics: {
        objectivesTotal: 0,
        objectivesCompleted: 0,
        blockerCount: 0,
        pivotsExecuted: 0,
        progressPercentage: 0,
        velocityScore: 0,
      },
    });

    setForm({
      name: '',
      description: '',
      type: 'sprint',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1e2330] border border-white/10 rounded-xl shadow-2xl w-full max-w-md p-0 animate-modal-bounce">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Swords size={18} className="text-[#2979ff]" />
            Create Battle Plan
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">Plan Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Q1 Velocity Sprint"
              className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff]"
              autoFocus
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What's the mission?"
              rows={3}
              className="w-full bg-[#0f111a] border border-white/10 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff] resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff]"
              >
                <option value="daily">📅 Daily</option>
                <option value="weekly">📆 Weekly</option>
                <option value="sprint">⚡ Sprint</option>
                <option value="quarterly">🎯 Quarterly</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">Start</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">End</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-5 py-4 border-t border-white/5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg text-gray-300 border border-white/10 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.name.trim() || !form.endDate}
            className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-[#2979ff] hover:bg-[#2264d1] disabled:opacity-50 flex items-center gap-2"
          >
            <Swords size={14} />
            Create Plan
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN BATTLE PLAN VIEW ---

export const BattlePlanView: React.FC = () => {
  const battlePlans = useProductivityStore((s) => s.battlePlans);
  const { deleteBattlePlan, updateBattlePlan } = useProductivityStore((s) => s.actions);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<BattlePlan | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'planning' | 'completed'>('all');

  const filteredPlans = battlePlans.filter(
    (p) => filter === 'all' || p.status === filter
  );

  const activePlans = battlePlans.filter((p) => p.status === 'active').length;

  return (
    <div className="h-full flex bg-[#0f111a] overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <Swords size={12} className="text-[#2979ff]" />
                <span className="text-gray-400">Active Plans:</span>
                <span className="text-white font-medium">{activePlans}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="h-8 bg-[#1e2330] border border-white/10 rounded-lg px-3 text-xs text-gray-300 focus:outline-none focus:border-[#2979ff]"
            >
              <option value="all">All Plans</option>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="completed">Completed</option>
            </select>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="h-8 px-4 bg-[#2979ff] hover:bg-[#2264d1] text-white text-xs font-bold rounded-lg flex items-center gap-2"
            >
              <Plus size={14} />
              New Battle Plan
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {filteredPlans.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Swords size={48} className="text-gray-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-400 mb-2">No battle plans yet</h3>
              <p className="text-xs text-gray-500 mb-4">
                Create an aggressive sprint plan to maximize your productivity
              </p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-4 py-2 bg-[#2979ff] hover:bg-[#2264d1] text-white text-xs font-bold rounded-lg"
              >
                Create Battle Plan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlans.map((plan) => (
                <BattlePlanCard
                  key={plan.id}
                  plan={plan}
                  onSelect={() => setSelectedPlan(plan)}
                  onDelete={() => deleteBattlePlan(plan.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedPlan && (
        <div className="w-96 border-l border-white/5 bg-[#13161c] p-4 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">{selectedPlan.name}</h3>
            <button
              onClick={() => setSelectedPlan(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Status Update */}
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">Status</label>
              <select
                value={selectedPlan.status}
                onChange={(e) => {
                  updateBattlePlan(selectedPlan.id, { status: e.target.value as any });
                  setSelectedPlan({ ...selectedPlan, status: e.target.value as any });
                }}
                className="w-full h-8 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-xs text-gray-200"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>

            {/* Objectives */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] uppercase font-bold text-gray-400">Objectives</label>
                <button className="text-[10px] text-[#2979ff] hover:text-[#2264d1]">+ Add</button>
              </div>
              
              {selectedPlan.objectives.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No objectives defined</p>
              ) : (
                <div className="space-y-2">
                  {selectedPlan.objectives.map((obj) => (
                    <ObjectiveItem
                      key={obj.id}
                      objective={obj}
                      onStatusChange={(status) => {
                        const updatedObjectives = selectedPlan.objectives.map((o) =>
                          o.id === obj.id ? { ...o, status } : o
                        );
                        updateBattlePlan(selectedPlan.id, { objectives: updatedObjectives });
                        setSelectedPlan({ ...selectedPlan, objectives: updatedObjectives });
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pivot Triggers */}
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">Pivot Triggers</label>
              {selectedPlan.pivotTriggers.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No pivot triggers defined</p>
              ) : (
                <div className="space-y-2">
                  {selectedPlan.pivotTriggers.map((trigger) => (
                    <div
                      key={trigger.id}
                      className={`p-2 rounded-lg border text-xs ${
                        trigger.triggered
                          ? 'bg-yellow-500/10 border-yellow-500/20'
                          : 'bg-[#0f111a] border-white/5'
                      }`}
                    >
                      <div className="text-gray-300">If: {trigger.condition}</div>
                      <div className="text-gray-500 mt-1">Then: {trigger.action}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ENTJ Tips */}
            <div className="p-3 bg-[#2979ff]/10 border border-[#2979ff]/20 rounded-lg">
              <h4 className="text-xs font-bold text-[#2979ff] mb-2 flex items-center gap-1">
                <Zap size={12} />
                ENTJ Battle Rules
              </h4>
              <ul className="text-[10px] text-gray-300 space-y-1">
                <li>• Prioritize high-ROI objectives</li>
                <li>• Execute blockers within 24h</li>
                <li>• Pivot fast if velocity drops</li>
                <li>• Ship daily, iterate constantly</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <CreatePlanModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};

export default BattlePlanView;
