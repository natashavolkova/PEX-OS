'use client';

// ============================================================================
// BATTLE PLAN EDITOR - Hybrid Engine v2
// ATHENA Architecture | Exclusive View Modes (Document XOR Map)
// ============================================================================

import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
    FileText,
    Map,
    Code2,
    Save,
    ChevronRight,
    RefreshCw,
    Check,
} from 'lucide-react';

// Lazy load heavy components - keep mounted to preserve state
const TacticEditor = dynamic(() => import('./TacticEditor'), {
    loading: () => <div className="h-full flex items-center justify-center text-gray-500">Loading editor...</div>,
    ssr: false,
});

const VisualMap = dynamic(() => import('./VisualMap'), {
    loading: () => <div className="h-full flex items-center justify-center text-gray-500">Loading canvas...</div>,
    ssr: false,
});

const MermaidCodePanel = dynamic(() => import('./MermaidCodePanel'), {
    loading: () => <div className="h-full flex items-center justify-center text-gray-500">Loading code panel...</div>,
    ssr: false,
});

// Types
interface BattlePlanData {
    id: string;
    title: string;
    contentMarkdown: string | null;
    diagramData: string | null;
    status: string;
}

interface BattlePlanEditorProps {
    battlePlan: BattlePlanData | null;
    projectId: string;
    onSave: (data: Partial<BattlePlanData>) => Promise<void>;
}

type ViewMode = 'document' | 'map';

export default function BattlePlanEditor({ battlePlan, projectId, onSave }: BattlePlanEditorProps) {
    const [activeView, setActiveView] = useState<ViewMode>('document');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [showCodePanel, setShowCodePanel] = useState(false);

    // Content state
    const [markdown, setMarkdown] = useState(battlePlan?.contentMarkdown || '');
    const [diagramData, setDiagramData] = useState<string>(battlePlan?.diagramData || '{}');
    const [mermaidCode, setMermaidCode] = useState('graph TD\n  A[Start] --> B{Decision}\n  B --> C[Option 1]\n  B --> D[Option 2]');

    // Auto-save timer ref
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Manual save handler
    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            await onSave({
                contentMarkdown: markdown,
                diagramData: diagramData,
            });
            setLastSaved(new Date());
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setIsSaving(false);
        }
    }, [markdown, diagramData, onSave]);

    // Auto-save after 5 seconds of inactivity
    useEffect(() => {
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        autoSaveTimerRef.current = setTimeout(() => {
            // Only auto-save if there's content
            if (markdown || diagramData !== '{}') {
                handleSave();
            }
        }, 5000);

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [markdown, diagramData, handleSave]);

    return (
        <div className="h-full flex flex-col bg-[#0f111a] overflow-hidden">
            {/* Toolbar - Prominent Toggle */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gradient-to-r from-[#1e2330] to-[#252b3d]">
                {/* EXCLUSIVE VIEW TOGGLE */}
                <div className="flex items-center bg-[#0f111a] rounded-xl p-1 shadow-lg border border-white/5">
                    <button
                        onClick={() => setActiveView('document')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeView === 'document'
                                ? 'bg-[#2979ff] text-white shadow-md'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <FileText size={16} />
                        📄 Documento Tático
                    </button>
                    <button
                        onClick={() => setActiveView('map')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeView === 'map'
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Map size={16} />
                        🗺️ Mapa Estratégico
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Auto-save indicator */}
                    {lastSaved && (
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Check size={10} className="text-green-400" />
                            Salvo {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}

                    {/* Code Panel Toggle (only for map view) */}
                    {activeView === 'map' && (
                        <button
                            onClick={() => setShowCodePanel(!showCodePanel)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showCodePanel
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
                                }`}
                        >
                            <Code2 size={12} />
                            Mermaid
                        </button>
                    )}

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#2979ff] hover:bg-[#2264d1] text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 shadow-md"
                    >
                        {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                        {isSaving ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Main Content - EXCLUSIVE VIEWS */}
                <div className="flex-1 h-full overflow-hidden relative">
                    {/* Document View - 100% width when active, hidden when not */}
                    <div
                        className={`absolute inset-0 transition-opacity duration-200 ${activeView === 'document' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                            }`}
                    >
                        <TacticEditor
                            content={markdown}
                            onChange={setMarkdown}
                            onSave={handleSave}
                        />
                    </div>

                    {/* Visual Map View - 100% width when active, hidden when not */}
                    {/* IMPORTANT: Keep mounted to preserve tldraw state */}
                    <div
                        className={`absolute inset-0 transition-opacity duration-200 ${activeView === 'map' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                            }`}
                    >
                        <VisualMap
                            projectId={projectId}
                            data={diagramData}
                            onChange={setDiagramData}
                        />
                    </div>
                </div>

                {/* Code Panel (Floating) - Only visible in map mode */}
                {showCodePanel && activeView === 'map' && (
                    <div className="w-80 border-l border-white/5 bg-[#1e2330] flex flex-col">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                            <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                                <Code2 size={12} />
                                Mermaid Code
                            </span>
                            <button
                                onClick={() => setShowCodePanel(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                        <MermaidCodePanel
                            code={mermaidCode}
                            onChange={setMermaidCode}
                            onApply={(parsedData) => {
                                console.log('Apply mermaid:', parsedData);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
