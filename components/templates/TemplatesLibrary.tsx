'use client';

// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - STRATEGIC TEMPLATES LIBRARY
// ATHENA Architecture | Premium Dark Theme | ENTJ Templates
// ============================================================================

import React, { useState } from 'react';
import {
  BookTemplate,
  Plus,
  Copy,
  Star,
  Edit3,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  Play,
  FileCode,
  Mail,
  Target,
  Zap,
  ChevronRight,
  X,
} from 'lucide-react';
import { useProductivityStore } from '@/stores';
import type { StrategicTemplate, TemplateVariable } from '@/types';

// --- TEMPLATE CARD COMPONENT ---

interface TemplateCardProps {
  template: StrategicTemplate;
  onUse: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onUse, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const categoryIcons = {
    mvp: '⚡',
    landing_page: '🎯',
    cold_email: '📧',
    pitch: '🎤',
    validation: '✅',
    matrix: '📊',
    blueprint: '📐',
  };

  const categoryColors = {
    mvp: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    landing_page: 'bg-green-500/10 text-green-400 border-green-500/20',
    cold_email: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    pitch: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    validation: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    matrix: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    blueprint: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  };

  return (
    <div className="bg-[#1e2330] border border-white/5 rounded-xl p-4 hover:border-[#2979ff]/30 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{template.emoji}</span>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-[#2979ff] transition-colors line-clamp-1">
              {template.name}
            </h3>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${categoryColors[template.category]}`}>
              {categoryIcons[template.category]} {template.category.replace('_', ' ')}
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
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 bg-[#252b3b] border border-white/10 rounded-lg shadow-xl z-20 py-1 min-w-[100px] animate-pop-in-menu">
                <button
                  onClick={() => { onEdit(); setShowMenu(false); }}
                  className="w-full px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                >
                  <Edit3 size={12} /> Edit
                </button>
                {template.isCustom && (
                  <button
                    onClick={() => { onDelete(); setShowMenu(false); }}
                    className="w-full px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 line-clamp-2 mb-3">{template.description}</p>

      {/* Variables Preview */}
      <div className="mb-3">
        <div className="text-[9px] text-gray-500 mb-1">Variables:</div>
        <div className="flex flex-wrap gap-1">
          {template.variables.slice(0, 4).map((v) => (
            <span key={v.name} className="text-[9px] px-1.5 py-0.5 bg-[#0f111a] text-gray-400 rounded">
              {`{{${v.name}}}`}
            </span>
          ))}
          {template.variables.length > 4 && (
            <span className="text-[9px] text-gray-500">+{template.variables.length - 4} more</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          <span>Used {template.usageCount}x</span>
          {template.avgRating > 0 && (
            <span className="flex items-center gap-0.5">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              {template.avgRating.toFixed(1)}
            </span>
          )}
        </div>
        <button
          onClick={onUse}
          className="px-3 py-1.5 bg-[#2979ff] hover:bg-[#2264d1] text-white text-[10px] font-bold rounded-lg flex items-center gap-1 transition-colors"
        >
          <Play size={10} />
          Use
        </button>
      </div>
    </div>
  );
};

// --- USE TEMPLATE MODAL ---

interface UseTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: StrategicTemplate | null;
}

const UseTemplateModal: React.FC<UseTemplateModalProps> = ({ isOpen, onClose, template }) => {
  const { useTemplate } = useProductivityStore((s) => s.actions);
  const [values, setValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<string>('');
  const [showOutput, setShowOutput] = useState(false);

  React.useEffect(() => {
    if (template) {
      const initialValues: Record<string, string> = {};
      template.variables.forEach((v) => {
        initialValues[v.name] = v.defaultValue || '';
      });
      setValues(initialValues);
      setOutput('');
      setShowOutput(false);
    }
  }, [template]);

  if (!isOpen || !template) return null;

  const handleGenerate = () => {
    let result = template.content;

    Object.entries(values).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value || `[${key}]`);
    });

    setOutput(result);
    setShowOutput(true);
    useTemplate(template.id);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const requiredMissing = template.variables
    .filter((v) => v.required)
    .some((v) => !values[v.name]?.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1e2330] border border-white/10 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] p-0 animate-modal-bounce flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>{template.emoji}</span>
            {template.name}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Variables Form */}
          <div className="w-1/2 p-5 overflow-y-auto border-r border-white/5 custom-scrollbar">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Fill Variables</h4>
            <div className="space-y-3">
              {template.variables.map((variable) => (
                <div key={variable.name}>
                  <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block flex items-center gap-1">
                    {variable.name.replace(/_/g, ' ')}
                    {variable.required && <span className="text-red-400">*</span>}
                  </label>
                  <p className="text-[9px] text-gray-500 mb-1">{variable.description}</p>

                  {variable.type === 'textarea' ? (
                    <textarea
                      value={values[variable.name] || ''}
                      onChange={(e) => setValues({ ...values, [variable.name]: e.target.value })}
                      rows={3}
                      className="w-full bg-[#0f111a] border border-white/10 rounded-lg p-2 text-xs text-gray-200 focus:outline-none focus:border-[#2979ff] resize-none"
                    />
                  ) : variable.type === 'select' ? (
                    <select
                      value={values[variable.name] || ''}
                      onChange={(e) => setValues({ ...values, [variable.name]: e.target.value })}
                      className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-xs text-gray-200 focus:outline-none focus:border-[#2979ff]"
                    >
                      <option value="">Select...</option>
                      {variable.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : variable.type === 'number' ? (
                    <input
                      type="number"
                      value={values[variable.name] || ''}
                      onChange={(e) => setValues({ ...values, [variable.name]: e.target.value })}
                      className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-xs text-gray-200 focus:outline-none focus:border-[#2979ff]"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[variable.name] || ''}
                      onChange={(e) => setValues({ ...values, [variable.name]: e.target.value })}
                      className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-xs text-gray-200 focus:outline-none focus:border-[#2979ff]"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Output */}
          <div className="w-1/2 p-5 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase">Generated Output</h4>
              {showOutput && (
                <button
                  onClick={handleCopy}
                  className="text-[10px] text-[#2979ff] hover:text-[#2264d1] flex items-center gap-1"
                >
                  <Copy size={10} />
                  Copy
                </button>
              )}
            </div>

            {showOutput ? (
              <pre className="flex-1 bg-[#0f111a] border border-white/5 rounded-lg p-3 text-xs text-gray-300 font-mono whitespace-pre-wrap overflow-y-auto">
                {output}
              </pre>
            ) : (
              <div className="flex-1 bg-[#0f111a] border border-white/5 rounded-lg p-3 flex items-center justify-center">
                <p className="text-xs text-gray-500 text-center">
                  Fill in the variables and click "Generate" to see output
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-white/5 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg text-gray-300 border border-white/10 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={requiredMissing}
            className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-[#2979ff] hover:bg-[#2264d1] disabled:opacity-50 flex items-center gap-2"
          >
            <Zap size={14} />
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN TEMPLATES LIBRARY ---

export const TemplatesLibrary: React.FC = () => {
  const templates = useProductivityStore((s) => s.templates);
  const { deleteTemplate } = useProductivityStore((s) => s.actions);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<StrategicTemplate | null>(null);

  const categories = [
    { id: 'all', label: 'All Templates', icon: '📚' },
    { id: 'mvp', label: 'MVP', icon: '⚡' },
    { id: 'landing_page', label: 'Landing Pages', icon: '🎯' },
    { id: 'cold_email', label: 'Cold Emails', icon: '📧' },
    { id: 'pitch', label: 'Pitches', icon: '🎤' },
    { id: 'validation', label: 'Validation', icon: '✅' },
    { id: 'matrix', label: 'Matrices', icon: '📊' },
    { id: 'blueprint', label: 'Blueprints', icon: '📐' },
  ];

  const filteredTemplates = templates.filter(
    (t) =>
      (selectedCategory === 'all' || t.category === selectedCategory) &&
      (t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h-full flex bg-[#0f111a] overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 border-r border-white/5 p-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Categories</h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2 ${selectedCategory === cat.id
                  ? 'bg-[#2979ff] text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="h-8 w-64 bg-[#1e2330] border border-white/10 rounded-lg pl-9 pr-3 text-xs text-gray-300 focus:outline-none focus:border-[#2979ff]"
            />
          </div>

          <button className="h-8 px-4 bg-[#2979ff] hover:bg-[#2264d1] text-white text-xs font-bold rounded-lg flex items-center gap-2">
            <Plus size={14} />
            Create Template
          </button>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <BookTemplate size={48} className="text-gray-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-400 mb-2">No templates found</h3>
              <p className="text-xs text-gray-500">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUse={() => setSelectedTemplate(template)}
                  onEdit={() => { }}
                  onDelete={() => deleteTemplate(template.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Use Template Modal */}
      <UseTemplateModal
        isOpen={selectedTemplate !== null}
        onClose={() => setSelectedTemplate(null)}
        template={selectedTemplate}
      />
    </div>
  );
};

export default TemplatesLibrary;
