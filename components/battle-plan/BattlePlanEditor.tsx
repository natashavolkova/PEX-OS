'use client';

// ============================================================================
// BATTLE PLAN EDITOR - Hybrid Engine Container
// ATHENA Architecture | Split View: Document + Visual Map + Code Panel
// ============================================================================

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
    FileText,
    Map,
    Code2,
    Save,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Minimize2,
    RefreshCw,
} from 'lucide-react';

// Lazy load heavy components
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

type ViewMode = 'split' | 'document' | 'map' | 'code';
type ActiveTab = 'document' | 'map' | 'code';

export default function BattlePlanEditor({ battlePlan, projectId, onSave }: BattlePlanEditorProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('split');
    const [activeTab, setActiveTab] = useState<ActiveTab>('document');
    const [isSaving, setIsSaving] = useState(false);
    const [showCodePanel, setShowCodePanel] = useState(false);

    // Content state
    const [markdown, setMarkdown] = useState(battlePlan?.contentMarkdown || '');
    const [diagramData, setDiagramData] = useState<string>(battlePlan?.diagramData || '{}');
    const [mermaidCode, setMermaidCode] = useState('graph TD\n  A[Start] --> B{Decision}\n  B --> C[Option 1]\n  B --> D[Option 2]');

    // Auto-save handler
    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            await onSave({
                contentMarkdown: markdown,
                diagramData: diagramData,
            });
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setIsSaving(false);
        }
    }, [markdown, diagramData, onSave]);

    // Tabs config
    const tabs = [
        { id: 'document', label: 'Tactic', icon: FileText },
        { id: 'map', label: 'Visual Map', icon: Map },
        { id: 'code', label: 'Code', icon: Code2 },
    ] as const;

    return (
        <div className="h-full flex flex-col bg-[#0f111a] overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#1e2330]">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-[#0f111a] rounded-lg p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                if (viewMode !== 'split') setViewMode(tab.id as ViewMode);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all ${activeTab === tab.id
                                    ? 'bg-[#2979ff] text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={12} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Split Toggle */}
                    <button
                        onClick={() => setViewMode(viewMode === 'split' ? activeTab : 'split')}
                        className={`p-2 rounded text-xs ${viewMode === 'split'
                                ? 'bg-[#2979ff]/20 text-[#2979ff]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        title={viewMode === 'split' ? 'Single View' : 'Split View'}
                    >
                        {viewMode === 'split' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>

                    {/* Code Panel Toggle */}
                    <button
                        onClick={() => setShowCodePanel(!showCodePanel)}
                        className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs ${showCodePanel
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Code2 size={12} />
                        Mermaid
                    </button>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2979ff] hover:bg-[#2264d1] text-white text-xs font-bold rounded transition-all disabled:opacity-50"
                    >
                        {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Main Content */}
                <div className={`flex-1 flex ${viewMode === 'split' ? 'divide-x divide-white/5' : ''}`}>
                    {/* Document Panel */}
                    {(viewMode === 'split' || viewMode === 'document' || activeTab === 'document') && (
                        <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} h-full overflow-hidden`}>
                            <TacticEditor
                                content={markdown}
                                onChange={setMarkdown}
                                onSave={handleSave}
                            />
                        </div>
                    )}

                    {/* Visual Map Panel */}
                    {(viewMode === 'split' || viewMode === 'map' || activeTab === 'map') && (
                        <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} h-full overflow-hidden`}>
                            <VisualMap
                                data={diagramData}
                                onChange={setDiagramData}
                            />
                        </div>
                    )}
                </div>

                {/* Code Panel (Floating) */}
                {showCodePanel && (
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
                                // TODO: Convert mermaid to tldraw nodes
                                console.log('Apply mermaid:', parsedData);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
