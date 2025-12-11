'use client';

// ============================================================================
// VISUAL MAP - tldraw Canvas
// ATHENA Architecture | Infinite Canvas with Shapes, Arrows, Freehand
// ============================================================================

import React, { useCallback, useRef } from 'react';
import { Tldraw, Editor } from 'tldraw';
import 'tldraw/tldraw.css';

interface VisualMapProps {
    data: string;
    onChange: (data: string) => void;
}

export default function VisualMap({ data, onChange }: VisualMapProps) {
    const editorRef = useRef<Editor | null>(null);
    const initialDataRef = useRef<string>(data);

    // Handle editor mount
    const handleMount = useCallback((editor: Editor) => {
        editorRef.current = editor;

        // Track changes and save to parent
        let timeout: NodeJS.Timeout;
        const unsub = editor.store.listen(() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                // Get all shapes as serializable data
                const shapes = editor.getCurrentPageShapes();
                const serialized = JSON.stringify(shapes);
                onChange(serialized);
            }, 500);
        }, { source: 'user', scope: 'document' });

        return () => {
            clearTimeout(timeout);
            unsub();
        };
    }, [onChange]);

    return (
        <div className="h-full w-full relative">
            <Tldraw
                onMount={handleMount}
                inferDarkMode
            />

            {/* Overlay hint */}
            <div className="absolute bottom-4 left-4 text-[10px] text-gray-500 bg-black/50 px-2 py-1 rounded pointer-events-none">
                Drag to pan • Scroll to zoom • Press T for text
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
