'use client';

// ============================================================================
// VISUAL MAP - Excalidraw Canvas (Clean Implementation)
// ATHENA Architecture | Standard Excalidraw with minimal overrides
// ============================================================================

import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { Check, RefreshCw, AlertCircle } from 'lucide-react';

interface VisualMapProps {
  projectId: string;
  data: string;
  onChange: (data: string) => void;
  onSaveToDb?: () => Promise<void>;
}

interface SavedData {
  elements: unknown[];
  appState?: Record<string, unknown>;
  timestamp: number;
}

const STORAGE_KEY_PREFIX = 'battleplan-excalidraw-';
const DEBOUNCE_MS = 2000;

export default function VisualMap({ projectId, data, onChange, onSaveToDb }: VisualMapProps) {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [initialData, setInitialData] = useState<SavedData | null>(null);
  const [isReady, setIsReady] = useState(false);
  const hasLoadedRef = useRef(false);
  const storageKey = `${STORAGE_KEY_PREFIX}${projectId}`;

  // Load initial data from props or localStorage
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    let savedData: SavedData | null = null;

    // Try to parse from prop (DB data)
    if (data && data !== '{}') {
      try {
        const parsed = JSON.parse(data);
        if (parsed.elements && Array.isArray(parsed.elements)) {
          savedData = parsed as SavedData;
          console.log('[Excalidraw] Loaded from DB:', savedData.elements.length, 'elements');
        }
      } catch (e) {
        console.warn('[Excalidraw] Failed to parse DB data:', e);
      }
    }

    // Fallback to localStorage
    if (!savedData && typeof window !== 'undefined') {
      const localData = localStorage.getItem(storageKey);
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          if (parsed.elements && Array.isArray(parsed.elements)) {
            savedData = parsed as SavedData;
            console.log('[Excalidraw] Loaded from localStorage:', savedData.elements.length, 'elements');
          }
        } catch (e) {
          console.warn('[Excalidraw] Failed to parse localStorage:', e);
        }
      }
    }

    if (savedData) {
      setInitialData(savedData);
    }
    setIsReady(true);
  }, [data, storageKey]);

  // Handle changes with 2s debounce
  const handleChange = useCallback(
    (elements: readonly unknown[], appState: Record<string, unknown>) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (!elements || elements.length === 0) return;

      setSaveStatus('idle');

      debounceTimerRef.current = setTimeout(async () => {
        try {
          setSaveStatus('saving');

          const dataToSave: SavedData = {
            elements: [...elements],
            appState: {
              viewBackgroundColor: appState.viewBackgroundColor,
              zoom: appState.zoom,
              scrollX: appState.scrollX,
              scrollY: appState.scrollY,
            },
            timestamp: Date.now(),
          };

          const serialized = JSON.stringify(dataToSave);

          if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, serialized);
          }

          onChange(serialized);

          if (onSaveToDb) {
            await onSaveToDb();
          }

          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 3000);
          console.log('[Excalidraw] Saved:', elements.length, 'elements');
        } catch (error) {
          console.error('[Excalidraw] Save failed:', error);
          setSaveStatus('error');
        }
      }, DEBOUNCE_MS);
    },
    [onChange, onSaveToDb, storageKey]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (!isReady) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#0f111a]" style={{ minHeight: '500px' }}>
        <div className="text-gray-400">Carregando editor...</div>
      </div>
    );
  }

  return (
    <div className="excalidraw-wrapper h-full w-full relative" style={{ minHeight: '500px', height: '600px' }}>
      <Excalidraw
        initialData={
          initialData
            ? {
              elements: initialData.elements as never[],
              appState: {
                theme: 'dark',
                viewBackgroundColor: '#0f111a',
                ...initialData.appState,
              },
            }
            : {
              appState: {
                theme: 'dark',
                viewBackgroundColor: '#0f111a',
              },
            }
        }
        onChange={handleChange as never}
        theme="dark"
        UIOptions={{
          canvasActions: {
            loadScene: false,
            export: false,
            saveToActiveFile: false,
            saveAsImage: false,
            clearCanvas: true,
            changeViewBackgroundColor: false,
          },
          tools: {
            image: false,
          },
        }}
        langCode="pt-BR"
      />

      {/* Save Status Toast */}
      <div className="absolute bottom-4 right-4 z-50">
        {saveStatus === 'saving' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-[#1e2330] border border-white/10 rounded-lg text-xs text-gray-300 shadow-lg">
            <RefreshCw size={12} className="animate-spin text-blue-400" />
            Salvando...
          </div>
        )}
        {saveStatus === 'saved' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-xs text-green-400 shadow-lg">
            <Check size={12} />
            Salvo!
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-xs text-red-400 shadow-lg">
            <AlertCircle size={12} />
            Erro ao salvar
          </div>
        )}
      </div>

      {/* Hints */}
      <div className="absolute bottom-4 left-4 text-[10px] text-gray-500 bg-black/50 px-2 py-1 rounded pointer-events-none z-50">
        Arraste para mover • Scroll para zoom • 2s para auto-save
      </div>
    </div>
  );
}
