'use client';

// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - YOUTUBE REFERENCE MANAGER
// ATHENA Architecture | Premium Dark Theme | Video Reference Tracking
// ============================================================================

import React, { useState } from 'react';
import {
  Youtube,
  Plus,
  ExternalLink,
  Lightbulb,
  Link,
  Tag,
  MoreVertical,
  Trash2,
  Edit3,
  Clock,
  Star,
  FileText,
  Search,
  Filter,
  Grid,
  List,
  ChevronRight,
} from 'lucide-react';
import { useProductivityStore } from '@/stores';
import type { YouTubeReference, YouTubeInsight } from '@/types';

// --- YOUTUBE CARD COMPONENT ---

interface YouTubeCardProps {
  reference: YouTubeReference;
  onSelect: () => void;
  onDelete: () => void;
}

const YouTubeCard: React.FC<YouTubeCardProps> = ({ reference, onSelect, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className="bg-[#1e2330] border border-white/5 rounded-xl overflow-hidden hover:border-red-500/30 transition-all cursor-pointer group"
      onClick={onSelect}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-[#0f111a]">
        {reference.thumbnailUrl ? (
          <img
            src={reference.thumbnailUrl}
            alt={reference.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Youtube size={48} className="text-red-500/50" />
          </div>
        )}

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">
          {reference.duration}
        </div>

        {/* Output Generated Badge */}
        {reference.outputGenerated && (
          <div className="absolute top-2 left-2 bg-green-500/90 text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1">
            <Lightbulb size={10} />
            Output Generated
          </div>
        )}

        {/* Menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 bg-black/60 text-white hover:bg-black/80 rounded-lg"
          >
            <MoreVertical size={14} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
              <div className="absolute right-0 top-full mt-1 bg-[#252b3b] border border-white/10 rounded-lg shadow-xl z-20 py-1 min-w-[100px] animate-pop-in-menu">
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                >
                  <ExternalLink size={12} /> Open
                </a>
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

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-white line-clamp-2 mb-1 group-hover:text-red-400 transition-colors">
          {reference.title}
        </h3>

        <div className="text-[10px] text-gray-500 mb-2">{reference.channelName}</div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {reference.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[9px] px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 flex items-center gap-1">
              <Lightbulb size={10} />
              {reference.insights.length} insights
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Star size={10} className={reference.impactScore >= 7 ? 'text-yellow-400 fill-yellow-400' : ''} />
            {reference.impactScore}/10
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ADD YOUTUBE MODAL ---

interface AddYouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddYouTubeModal: React.FC<AddYouTubeModalProps> = ({ isOpen, onClose }) => {
  const { addYoutubeRef } = useProductivityStore((s) => s.actions);

  const [form, setForm] = useState({
    url: '',
    title: '',
    channelName: '',
    duration: '',
    description: '',
    tags: '',
    impactScore: 5,
  });

  if (!isOpen) return null;

  // Extract video ID from URL
  const extractVideoId = (url: string): string => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : '';
  };

  const handleSubmit = () => {
    if (!form.url.trim() || !form.title.trim()) return;

    const videoId = extractVideoId(form.url);

    addYoutubeRef({
      url: form.url,
      videoId,
      title: form.title,
      channelName: form.channelName || 'Unknown Channel',
      thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '',
      duration: form.duration || '00:00',
      description: form.description,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      insights: [],
      linkedProjects: [],
      linkedPrompts: [],
      impactScore: form.impactScore,
      outputGenerated: false,
    });

    setForm({
      url: '',
      title: '',
      channelName: '',
      duration: '',
      description: '',
      tags: '',
      impactScore: 5,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1e2330] border border-white/10 rounded-xl shadow-2xl w-full max-w-md p-0 animate-modal-bounce">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Youtube size={18} className="text-red-500" />
            Add YouTube Reference
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">YouTube URL</label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-red-500"
              autoFocus
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">Video Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Video title"
              className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">Channel</label>
              <input
                type="text"
                value={form.channelName}
                onChange={(e) => setForm({ ...form, channelName: e.target.value })}
                placeholder="Channel name"
                className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">Duration</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="12:34"
                className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="productivity, coding, tutorial"
              className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-red-500"
            />
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
              className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-red-500"
            />
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
            disabled={!form.url.trim() || !form.title.trim()}
            className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
          >
            <Plus size={14} />
            Add Reference
          </button>
        </div>
      </div>
    </div>
  );
};

// --- INSIGHT PANEL ---

interface InsightPanelProps {
  reference: YouTubeReference;
  onClose: () => void;
  onAddInsight: (insight: Omit<YouTubeInsight, 'id' | 'referenceId' | 'createdAt'>) => void;
}

const InsightPanel: React.FC<InsightPanelProps> = ({ reference, onClose, onAddInsight }) => {
  const [newInsight, setNewInsight] = useState({
    content: '',
    timestamp: '',
    category: 'key_point' as YouTubeInsight['category'],
  });

  const handleAddInsight = () => {
    if (!newInsight.content.trim()) return;

    onAddInsight({
      content: newInsight.content,
      timestamp: newInsight.timestamp || undefined,
      category: newInsight.category,
    });

    setNewInsight({ content: '', timestamp: '', category: 'key_point' });
  };

  const categoryIcons = {
    key_point: '📌',
    action_item: '✅',
    quote: '💬',
    resource: '🔗',
    idea: '💡',
  };

  return (
    <div className="w-96 border-l border-white/5 bg-[#13161c] p-4 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">Video Insights</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      {/* Video Info */}
      <div className="bg-[#1e2330] border border-white/5 rounded-lg p-3 mb-4">
        <h4 className="text-xs font-medium text-white line-clamp-2 mb-1">{reference.title}</h4>
        <div className="text-[10px] text-gray-500">{reference.channelName}</div>
        <a
          href={reference.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 mt-2"
        >
          <ExternalLink size={10} />
          Watch on YouTube
        </a>
      </div>

      {/* Add Insight Form */}
      <div className="bg-[#1e2330] border border-white/5 rounded-lg p-3 mb-4">
        <h4 className="text-xs font-bold text-gray-400 mb-2">Add New Insight</h4>

        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newInsight.timestamp}
              onChange={(e) => setNewInsight({ ...newInsight, timestamp: e.target.value })}
              placeholder="12:34"
              className="w-16 h-8 bg-[#0f111a] border border-white/10 rounded px-2 text-xs text-gray-200 focus:outline-none"
            />
            <select
              value={newInsight.category}
              onChange={(e) => setNewInsight({ ...newInsight, category: e.target.value as any })}
              className="flex-1 h-8 bg-[#0f111a] border border-white/10 rounded px-2 text-xs text-gray-200 focus:outline-none"
            >
              <option value="key_point">📌 Key Point</option>
              <option value="action_item">✅ Action Item</option>
              <option value="quote">💬 Quote</option>
              <option value="resource">🔗 Resource</option>
              <option value="idea">💡 Idea</option>
            </select>
          </div>

          <textarea
            value={newInsight.content}
            onChange={(e) => setNewInsight({ ...newInsight, content: e.target.value })}
            placeholder="What did you learn?"
            rows={3}
            className="w-full bg-[#0f111a] border border-white/10 rounded p-2 text-xs text-gray-200 focus:outline-none resize-none"
          />

          <button
            onClick={handleAddInsight}
            disabled={!newInsight.content.trim()}
            className="w-full h-8 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-medium rounded transition-colors"
          >
            Add Insight
          </button>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-2">
        {reference.insights.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">No insights yet. Start adding what you learned!</p>
        ) : (
          reference.insights.map((insight) => (
            <div key={insight.id} className="bg-[#1e2330] border border-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span>{categoryIcons[insight.category]}</span>
                {insight.timestamp && (
                  <span className="text-[9px] text-red-400 font-mono">{insight.timestamp}</span>
                )}
              </div>
              <p className="text-xs text-gray-300">{insight.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- MAIN YOUTUBE MANAGER ---

export const YouTubeManager: React.FC = () => {
  const youtubeRefs = useProductivityStore((s) => s.youtubeRefs);
  const { deleteYoutubeRef, addYoutubeInsight } = useProductivityStore((s) => s.actions);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedRef, setSelectedRef] = useState<YouTubeReference | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredRefs = youtubeRefs.filter(
    (ref) =>
      ref.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalInsights = youtubeRefs.reduce((sum, r) => sum + r.insights.length, 0);
  const outputGeneratedCount = youtubeRefs.filter((r) => r.outputGenerated).length;

  return (
    <div className="h-full flex bg-[#0f111a] overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <Youtube size={12} className="text-red-500" />
                <span className="text-gray-400">Videos:</span>
                <span className="text-white font-medium">{youtubeRefs.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lightbulb size={12} className="text-yellow-400" />
                <span className="text-gray-400">Insights:</span>
                <span className="text-white font-medium">{totalInsights}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText size={12} className="text-green-400" />
                <span className="text-gray-400">Generated Output:</span>
                <span className="text-green-400 font-medium">{outputGeneratedCount}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="h-8 w-48 bg-[#1e2330] border border-white/10 rounded-lg pl-9 pr-3 text-xs text-gray-300 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-[#1e2330] border border-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List size={14} />
              </button>
            </div>

            <button
              onClick={() => setIsAddOpen(true)}
              className="h-8 px-4 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg flex items-center gap-2"
            >
              <Plus size={14} />
              Add Video
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {filteredRefs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Youtube size={48} className="text-gray-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-400 mb-2">No video references yet</h3>
              <p className="text-xs text-gray-500 mb-4">
                Add YouTube videos to track insights and generate ideas
              </p>
              <button
                onClick={() => setIsAddOpen(true)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg"
              >
                Add Video
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-3'
            }>
              {filteredRefs.map((ref) => (
                <YouTubeCard
                  key={ref.id}
                  reference={ref}
                  onSelect={() => setSelectedRef(ref)}
                  onDelete={() => deleteYoutubeRef(ref.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Insight Panel */}
      {selectedRef && (
        <InsightPanel
          reference={selectedRef}
          onClose={() => setSelectedRef(null)}
          onAddInsight={(insight) => addYoutubeInsight(selectedRef.id, insight)}
        />
      )}

      <AddYouTubeModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};

export default YouTubeManager;
