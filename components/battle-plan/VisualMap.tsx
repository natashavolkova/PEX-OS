'use client';

// ============================================================================
// VISUAL MAP - Excalidraw Canvas (FIXED Container Sizing)
// ATHENA Architecture | Proper 100% fill with CSS dimensions fix
// ============================================================================

import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { Check, RefreshCw, AlertCircle } from 'lucide-react';

// CRITICAL: Import Excalidraw CSS for proper rendering
import '@excalidraw/excalidraw/index.css';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [initialData, setInitialData] = useState<SavedData | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const hasLoadedRef = useRef(false);
  const storageKey = `${STORAGE_KEY_PREFIX}${projectId}`;

  // CRITICAL: Calculate container dimensions for Excalidraw
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    
    // Re-calculate on resize
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateDimensions);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

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

  // Don't render until container has dimensions
  const canRender = isReady && dimensions.width > 0 && dimensions.height > 0;

  return (
    <>
      {/* CRITICAL: CSS for proper Excalidraw rendering */}
      <style jsx global>{`
        .excalidraw-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
        }
        
        .excalidraw-container .excalidraw {
          width: 100% !important;
          height: 100% !important;
        }
        
        .excalidraw-container .excalidraw .excalidraw-container {
          width: 100% !important;
          height: 100% !important;
        }
        
        /* Force dark theme colors */
        .excalidraw-container .excalidraw {
          --color-primary: #6366f1;
          --color-primary-darker: #4f46e5;
          --color-primary-darkest: #4338ca;
          --color-primary-light: #818cf8;
        }
        
        /* Ensure toolbar is visible and styled */
        .excalidraw-container .excalidraw .Island {
          background: #1e2330 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
        }
        
        /* Fix toolbar button colors */
        .excalidraw-container .excalidraw .ToolIcon_type_button {
          background: transparent !important;
        }
        
        .excalidraw-container .excalidraw .ToolIcon_type_button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }
        
        .excalidraw-container .excalidraw .ToolIcon_type_button.ToolIcon--selected {
          background: #6366f1 !important;
        }
      `}</style>

      <div 
        ref={containerRef}
        className="excalidraw-container"
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#0f111a',
        }}
      >
        {!canRender ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-gray-400">Carregando editor...</div>
          </div>
        ) : (
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
        )}

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
    </>
  );
}
