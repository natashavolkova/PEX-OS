'use client';

// ============================================================================
// BATTLE PLAN EDITOR - Hybrid Engine v3
// ATHENA Architecture | REAL PERSISTENCE | Exclusive View Modes
// ============================================================================

import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useParseDiagramFromText } from '@/hooks/useParseDiagramFromText';
import { useUpdateTextFromDiagram } from '@/hooks/useUpdateTextFromDiagram';
import {
    FileText,
    Map,
    Code2,
    Save,
    ChevronRight,
    RefreshCw,
    Check,
    AlertCircle,
} from 'lucide-react';

// Lazy load heavy components - keep mounted to preserve state
const TacticEditor = dynamic(() => import('./TacticEditor'), {
    loading: () => <div className="h-full flex items-center justify-center text-gray-500">Loading editor...</div>,
    ssr: false,
});

const StrategicMap = dynamic(() => import('./StrategicMap'), {
    loading: () => <div className="h-full flex items-center justify-center text-gray-500">Loading strategic map...</div>,
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
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// =============================================================================
// RETRY LOGIC - 3 attempts before showing error
// =============================================================================
async function saveWithRetry(
    saveFn: () => Promise<void>,
    maxRetries: number = 3
): Promise<{ success: boolean; error?: Error }> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await saveFn();
            return { success: true };
        } catch (error) {
            console.error(`[Save] Attempt ${attempt}/${maxRetries} failed:`, error);
            if (attempt === maxRetries) {
                return { success: false, error: error as Error };
            }
            // Wait before retry (exponential backoff: 200ms, 400ms, 800ms)
            await new Promise(resolve => setTimeout(resolve, 200 * Math.pow(2, attempt - 1)));
        }
    }
    return { success: false };
}

export default function BattlePlanEditor({ battlePlan, projectId, onSave }: BattlePlanEditorProps) {
    const [activeView, setActiveView] = useState<ViewMode>('document');
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [showCodePanel, setShowCodePanel] = useState(false);

    // ==========================================================================
    // SINGLE SOURCE OF TRUTH: markdown contains EVERYTHING
    // The diagram JSON is embedded in the markdown via ```json-diagram block
    // diagramData state is REMOVED - we only use contentMarkdown
    // ==========================================================================
    const [markdown, setMarkdown] = useState(battlePlan?.contentMarkdown || '');
    const [mermaidCode, setMermaidCode] = useState('graph TD\n  A[Start] --> B{Decision}\n  B --> C[Option 1]\n  B --> D[Option 2]');

    // TWO-WAY DATA BINDING:
    // Text → Graph (parse json-diagram from markdown)
    const parsedDiagram = useParseDiagramFromText(markdown, 300);
    // Graph → Text (serialize graph changes back to markdown)
    // Debounce reduced to 200ms for fast feedback
    const { updateTextFromGraph } = useUpdateTextFromDiagram(markdown, setMarkdown, { debounceMs: 200 });

    // Track if content has changed since last save
    const lastSavedMarkdownRef = useRef<string>(markdown);
    const hasUnsavedChanges = markdown !== lastSavedMarkdownRef.current;

    // Auto-save timer ref
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // ==========================================================================
    // SAVE HANDLER - With retry logic and honest feedback
    // ==========================================================================
    const handleSave = useCallback(async () => {
        // Don't save if nothing changed
        if (!hasUnsavedChanges && saveStatus !== 'idle') return;

        setSaveStatus('saving');
        console.log('[Save] Starting save, markdown length:', markdown.length);

        const result = await saveWithRetry(async () => {
            await onSave({
                contentMarkdown: markdown,
                // diagramData is now extracted FROM markdown by the backend if needed
                // or we can extract it here to maintain backwards compatibility:
                diagramData: extractDiagramJson(markdown),
            });
        });

        if (result.success) {
            setSaveStatus('saved');
            setLastSaved(new Date());
            lastSavedMarkdownRef.current = markdown;
            console.log('[Save] Success!');

            // Reset to idle after 3 seconds
            setTimeout(() => setSaveStatus('idle'), 3000);
        } else {
            setSaveStatus('error');
            console.error('[Save] Failed after retries:', result.error);

            // Reset to idle after 5 seconds
            setTimeout(() => setSaveStatus('idle'), 5000);
        }
    }, [markdown, hasUnsavedChanges, onSave, saveStatus]);

    // ==========================================================================
    // AUTO-SAVE - Reduced to 2 seconds for faster persistence
    // ==========================================================================
    useEffect(() => {
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        // Only schedule auto-save if there are unsaved changes
        if (hasUnsavedChanges) {
            autoSaveTimerRef.current = setTimeout(() => {
                console.log('[AutoSave] Triggering...');
                handleSave();
            }, 2000); // Reduced from 5000ms to 2000ms
        }

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [markdown, hasUnsavedChanges, handleSave]);

    // ==========================================================================
    // RENDER
    // ==========================================================================
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
                    {/* HONEST SAVE STATUS INDICATOR */}
                    {saveStatus === 'saving' && (
                        <span className="text-[10px] text-blue-400 flex items-center gap-1 animate-pulse">
                            <RefreshCw size={10} className="animate-spin" />
                            Sincronizando...
                        </span>
                    )}
                    {saveStatus === 'saved' && (
                        <span className="text-[10px] text-green-400 flex items-center gap-1">
                            <Check size={10} />
                            Salvo
                        </span>
                    )}
                    {saveStatus === 'error' && (
                        <span className="text-[10px] text-red-400 flex items-center gap-1">
                            <AlertCircle size={10} />
                            Erro ao salvar
                        </span>
                    )}
                    {saveStatus === 'idle' && lastSaved && (
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Check size={10} className="text-green-400" />
                            {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}

                    {/* Unsaved changes indicator */}
                    {hasUnsavedChanges && saveStatus === 'idle' && (
                        <span className="w-2 h-2 bg-orange-400 rounded-full" title="Alterações não salvas" />
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
                        disabled={saveStatus === 'saving'}
                        className={`flex items-center gap-1.5 px-4 py-2 text-white text-xs font-bold rounded-lg transition-all shadow-md ${saveStatus === 'error'
                                ? 'bg-red-600 hover:bg-red-500'
                                : 'bg-[#2979ff] hover:bg-[#2264d1]'
                            } disabled:opacity-50`}
                    >
                        {saveStatus === 'saving' ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                        {saveStatus === 'saving' ? 'Salvando...' : saveStatus === 'error' ? 'Tentar Novamente' : 'Salvar'}
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

                    {/* Strategic Map View - React Flow (driven by text) */}
                    <div
                        className={`absolute inset-0 ${activeView === 'map' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                    >
                        <StrategicMap
                            externalNodes={parsedDiagram.nodes}
                            externalEdges={parsedDiagram.edges}
                            isSyncing={parsedDiagram.isSyncing}
                            syncError={parsedDiagram.error}
                            onGraphChange={updateTextFromGraph}
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

// =============================================================================
// HELPER: Extract diagram JSON from markdown
// =============================================================================
function extractDiagramJson(markdown: string): string {
    const regex = /```json-diagram\s*([\s\S]*?)```/;
    const match = markdown.match(regex);
    if (match && match[1]) {
        try {
            // Validate it's valid JSON
            JSON.parse(match[1].trim());
            return match[1].trim();
        } catch {
            return '{}';
        }
    }
    return '{}';
}
