'use client';

// ============================================================================
// VISUAL MAP - tldraw Canvas with Persistence
// ATHENA Architecture | localStorage + Auto-save to DB
// ============================================================================

import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Tldraw, Editor } from 'tldraw';
import 'tldraw/tldraw.css';

interface VisualMapProps {
  projectId: string;
  data: string;
  onChange: (data: string) => void;
}

const STORAGE_KEY_PREFIX = 'battleplan-diagram-';

export default function VisualMap({ projectId, data, onChange }: VisualMapProps) {
  const editorRef = useRef<Editor | null>(null);
  const [isReady, setIsReady] = useState(false);
  const hasLoadedRef = useRef(false);
  const storageKey = `${STORAGE_KEY_PREFIX}${projectId}`;

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !hasLoadedRef.current) {
      const savedData = localStorage.getItem(storageKey);
      if (savedData && savedData !== '{}' && savedData !== data) {
        // localStorage has newer data than prop - use it
        console.log('[VisualMap] Restoring from localStorage');
        onChange(savedData);
      }
      hasLoadedRef.current = true;
    }
  }, [storageKey, data, onChange]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (typeof window !== 'undefined' && data && data !== '{}') {
      localStorage.setItem(storageKey, data);
    }
  }, [storageKey, data]);

  // Handle editor mount
  const handleMount = useCallback((editor: Editor) => {
    editorRef.current = editor;
    setIsReady(true);

    console.log('[VisualMap] Editor mounted');

    // Track changes and save to parent (with debounce)
    let timeout: NodeJS.Timeout;
    const unsub = editor.store.listen(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        try {
          // Get all shapes as serializable data
          const shapes = editor.getCurrentPageShapes();
          const serialized = JSON.stringify({
            shapes: shapes,
            camera: editor.getCamera(),
            timestamp: Date.now(),
          });

          // Save to localStorage immediately
          if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, serialized);
          }

          // Update parent state (triggers auto-save to DB after 5s inactivity)
          onChange(serialized);
        } catch (err) {
          console.error('[VisualMap] Failed to serialize:', err);
        }
      }, 300); // 300ms debounce for responsiveness
    }, { source: 'user', scope: 'document' });

    return () => {
      clearTimeout(timeout);
      unsub();
    };
  }, [onChange, storageKey]);

  return (
    <div className="h-full w-full relative">
      <Tldraw
        onMount={handleMount}
        inferDarkMode
      />

      {/* Status indicator */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <div className="text-[10px] text-gray-500 bg-black/50 px-2 py-1 rounded pointer-events-none">
          Drag to pan • Scroll to zoom • Press T for text
        </div>
        {isReady && (
          <div className="text-[10px] text-green-400 bg-black/50 px-2 py-1 rounded pointer-events-none flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Auto-save ativo
          </div>
        )}
      </div>

      {/* Custom dark theme overrides */}
      <style jsx global>{`
        .tl-container {
          background: #0f111a !important;
        }
        .tlui-layout {
          background: transparent !important;
        }
        .tlui-toolbar {
          background: #1e2330 !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .tlui-button {
          color: #94a3b8 !important;
        }
        .tlui-button:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          color: white !important;
        }
        .tlui-button[data-state="selected"] {
          background: #2979ff !important;
          color: white !important;
        }
        .tlui-menu,
        .tlui-popover__content {
          background: #1e2330 !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .tlui-menu__item {
          color: #e2e8f0 !important;
        }
        .tlui-menu__item:hover {
          background: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>
    </div>
  );
}
