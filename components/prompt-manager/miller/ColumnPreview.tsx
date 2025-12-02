'use client';

// ============================================================================
// MILLER COLUMNS - PREVIEW PANEL COMPONENT
// Fourth column showing detailed prompt preview with actions
// ============================================================================

import React, { useState } from 'react';
import {
  Eye,
  Edit2,
  Copy,
  CheckCircle2,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { Tooltip } from '../TooltipWrapper';
import { usePromptManagerStore } from '@/stores/promptManager';
import type { Prompt } from '@/types/prompt-manager';

interface ColumnPreviewProps {
  prompt: Prompt | null;
  onEdit: () => void;
  onOpenFull: () => void;
  isLocked: boolean;
}

export const ColumnPreview: React.FC<ColumnPreviewProps> = ({
  prompt,
  onEdit,
  onOpenFull,
  isLocked,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const { showToast } = usePromptManagerStore((s) => s.actions);

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.content || '');
      setIsCopied(true);
      showToast('Copiado!', 'success');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!prompt) {
    return (
      <div className="flex-1 min-w-[350px] flex flex-col items-center justify-center bg-[#13161c] border-l border-white/5 text-gray-500/50 p-6">
        <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center mb-4">
          <Eye size={28} className="opacity-40" />
        </div>
        <p className="text-sm font-medium text-gray-400">Preview</p>
        <p className="text-xs mt-1 text-gray-500 text-center max-w-[200px]">
          Selecione um prompt para visualizar
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-[350px] flex flex-col bg-[#13161c] border-l border-white/5">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-[#181b24]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2979ff]/20 to-purple-500/20 flex items-center justify-center text-2xl shadow-lg">
            {prompt.emoji || '📄'}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white truncate">{prompt.name}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                {prompt.category || 'Geral'}
              </span>
              <span>•</span>
              <span>{prompt.date}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {prompt.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#2979ff]/10 text-[#2979ff] border border-[#2979ff]/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFull}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#2979ff] hover:bg-[#2264d1] text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20"
          >
            <ExternalLink size={14} />
            Abrir Completo
          </button>
          <Tooltip content="Editar" position="bottom">
            <button
              onClick={onEdit}
              disabled={isLocked}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <Edit2 size={16} />
            </button>
          </Tooltip>
          <Tooltip content={isCopied ? 'Copiado!' : 'Copiar'} position="bottom">
            <button
              onClick={handleCopy}
              className={`p-2 rounded-lg transition-colors ${
                isCopied
                  ? 'text-green-400 bg-green-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {isCopied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            </button>
          </Tooltip>
          <Tooltip content="Compartilhar" position="bottom">
            <button
              onClick={() => showToast('Compartilhando...', 'info')}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Share2 size={16} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Content Preview */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <div className="bg-[#0f111a] border border-white/5 rounded-lg p-4 shadow-inner min-h-[200px]">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
            {prompt.content || 'Sem conteúdo'}
          </pre>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-white/5 bg-[#0f111a]/50">
        <div className="flex items-center justify-between text-[10px] text-gray-400">
          <span>{prompt.content?.length || 0} caracteres</span>
          <span>Atualizado: {prompt.date}</span>
        </div>
      </div>
    </div>
  );
};
