'use client';

// ============================================================================
// AthenaPeX PROMPT MANAGER - SETTINGS MODAL
// ATHENA Architecture | Premium Dark Theme
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Check,
  Settings,
  Camera,
  List,
  Columns,
  Network,
  Grid3X3,
  LayoutGrid,
} from 'lucide-react';
import { Overlay, ModalAnimation } from '../MotionWrappers';
import { usePromptManagerStore } from '@/stores/promptManager';
import type { ViewType } from '@/types/prompt-manager';

// --- VIEWS CONFIG ---

const VIEWS: { id: ViewType; label: string; icon: any }[] = [
  { id: 'sequential', label: 'Sequencial', icon: List },
  { id: 'miller', label: 'Miller Columns', icon: Columns },
  { id: 'mindmap', label: 'Hierarquia', icon: Network },
];

// --- DENSITY OPTIONS ---

const DENSITY_OPTIONS: { id: 'standard' | 'high'; label: string; description: string; icon: any }[] = [
  { id: 'standard', label: '4 Colunas', description: 'Padrão', icon: Grid3X3 },
  { id: 'high', label: '5 Colunas', description: 'Alta Densidade', icon: LayoutGrid },
];

// --- SETTINGS MODAL ---

export const SettingsModal: React.FC = () => {
  const isOpen = usePromptManagerStore((s) => s.isSettingsOpen);
  const currentUser = usePromptManagerStore((s) => s.currentUser);
  const preferences = usePromptManagerStore((s) => s.preferences);
  const { setSettingsOpen, updatePreferences, setCurrentUser, showToast } =
    usePromptManagerStore((s) => s.actions);

  const [localView, setLocalView] = useState<ViewType>('sequential');
  const [localGridDensity, setLocalGridDensity] = useState<'standard' | 'high'>('standard');
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalView(preferences.defaultView || 'sequential');
      setLocalGridDensity(preferences.gridDensity || 'standard');
      setPreviewAvatar(currentUser.avatar || null);
    }
  }, [isOpen, preferences, currentUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // Update local preferences
    updatePreferences({ defaultView: localView, gridDensity: localGridDensity });
    setCurrentUser({ ...currentUser, avatar: previewAvatar });

    // Persist gridDensity to database
    try {
      await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gridDensity: localGridDensity }),
      });
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }

    showToast('Preferências salvas', 'success');
    setSettingsOpen(false);
  };

  if (!isOpen) return null;

  const getInitials = (name: string) => {
    const cleanName = name.replace(/[^a-zA-Z\s]/g, '').trim();
    const parts = cleanName.split(/\s+/);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <Overlay onClick={() => setSettingsOpen(false)}>
      <ModalAnimation>
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-[#1e2330] rounded-xl border border-white/10 shadow-2xl w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings size={20} className="text-[#2979ff]" />
              Configurações
            </h2>
            <button
              onClick={() => setSettingsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Profile Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">
                Perfil
              </h3>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2a3040] to-[#1e2330] border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-2xl transition-transform hover:scale-105">
                    {previewAvatar ? (
                      <img
                        src={previewAvatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-indigo-400">
                        {getInitials(currentUser.name)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-1.5 bg-[#2979ff] text-white rounded-full shadow-lg hover:bg-[#2264d1] transition-all hover:scale-110 border border-[#1e2330]"
                    title="Alterar Foto"
                  >
                    <Camera size={14} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium mb-1">Sua Foto</p>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Personalize como você aparece para sua equipe.
                  </p>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">
                Experiência
              </h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block">
                  Visualização Inicial
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {VIEWS.map((view) => (
                    <button
                      key={view.id}
                      onClick={() => setLocalView(view.id)}
                      className={`
                        flex flex-col items-center justify-center gap-2 p-3 rounded-lg border 
                        transition-all duration-200 relative
                        ${localView === view.id
                          ? 'bg-[#2979ff]/10 border-[#2979ff] text-[#2979ff] shadow-[0_0_15px_rgba(41,121,255,0.15)] scale-[1.02]'
                          : 'bg-[#0f111a] border-white/5 text-gray-300 hover:border-white/20 hover:text-gray-200'
                        }
                      `}
                    >
                      <view.icon size={20} />
                      <span className="text-xs font-medium">{view.label}</span>
                      {localView === view.id && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-[#2979ff] rounded-full shadow-[0_0_5px_#2979ff]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Density Toggle */}
              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium text-gray-300 block">
                  Densidade do Grid (Prompts)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {DENSITY_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setLocalGridDensity(option.id)}
                      className={`
                        flex items-center gap-3 p-4 rounded-lg border 
                        transition-all duration-200 relative
                        ${localGridDensity === option.id
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : 'bg-[#0f111a] border-white/5 text-gray-300 hover:border-white/20 hover:text-gray-200'
                        }
                      `}
                    >
                      <option.icon size={24} />
                      <div className="text-left">
                        <span className="text-sm font-semibold block">{option.label}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{option.description}</span>
                      </div>
                      {localGridDensity === option.id && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981]" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 italic mt-1">
                  Determina quantos cards de prompts serão exibidos por linha.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 bg-[#13161c] flex justify-end gap-3">
            <button
              onClick={() => setSettingsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm font-bold bg-[#2979ff] hover:bg-[#2264d1] text-white rounded-lg shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Check size={16} /> Salvar
            </button>
          </div>
        </div>
      </ModalAnimation>
    </Overlay>
  );
};

export default SettingsModal;
