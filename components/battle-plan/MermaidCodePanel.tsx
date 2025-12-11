'use client';

// ============================================================================
// MERMAID CODE PANEL - Diagram as Code
// ATHENA Architecture | Keyboard-First Visual Editing
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import mermaid from 'mermaid';
import { Play, AlertCircle, CheckCircle2, Copy, Trash2 } from 'lucide-react';

interface MermaidCodePanelProps {
    code: string;
    onChange: (code: string) => void;
    onApply: (parsedData: MermaidParsedData) => void;
}

interface MermaidParsedData {
    nodes: Array<{ id: string; label: string }>;
    edges: Array<{ from: string; to: string; label?: string }>;
}

// Initialize mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
        primaryColor: '#2979ff',
        primaryTextColor: '#fff',
        primaryBorderColor: '#1e2330',
        lineColor: '#64748b',
        secondaryColor: '#1e2330',
        tertiaryColor: '#0f111a',
    },
});

export default function MermaidCodePanel({ code, onChange, onApply }: MermaidCodePanelProps) {
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string>('');

    // Validate and render mermaid
    const validateAndRender = useCallback(async (mermaidCode: string) => {
        if (!mermaidCode.trim()) {
            setIsValid(true);
            setError(null);
            setPreview('');
            return;
        }

        try {
            // Validate syntax
            const isValidSyntax = await mermaid.parse(mermaidCode);

            if (isValidSyntax) {
                // Render to SVG
                const { svg } = await mermaid.render('mermaid-preview', mermaidCode);
                setPreview(svg);
                setIsValid(true);
                setError(null);
            }
        } catch (err: any) {
            setIsValid(false);
            setError(err.message || 'Invalid Mermaid syntax');
            setPreview('');
        }
    }, []);

    // Debounced validation
    useEffect(() => {
        const timeout = setTimeout(() => {
            validateAndRender(code);
        }, 300);
        return () => clearTimeout(timeout);
    }, [code, validateAndRender]);

    // Parse mermaid to nodes/edges
    const parseMermaid = useCallback((mermaidCode: string): MermaidParsedData => {
        const nodes: MermaidParsedData['nodes'] = [];
        const edges: MermaidParsedData['edges'] = [];

        // Simple parser for graph TD syntax
        const lines = mermaidCode.split('\n');
        const nodeMap = new Map<string, string>();

        for (const line of lines) {
            // Match node definitions: A[Label] or A{Label} or A((Label))
            const nodeMatches = line.matchAll(/([A-Za-z0-9_]+)[\[\{\(]+([^\]\}\)]+)[\]\}\)]+/g);
            for (const match of nodeMatches) {
                const [, id, label] = match;
                if (!nodeMap.has(id)) {
                    nodeMap.set(id, label);
                    nodes.push({ id, label });
                }
            }

            // Match edges: A --> B or A --> |label| B
            const edgeMatch = line.match(/([A-Za-z0-9_]+)\s*--[>]*\s*(?:\|([^|]*)\|)?\s*([A-Za-z0-9_]+)/);
            if (edgeMatch) {
                const [, from, label, to] = edgeMatch;
                edges.push({ from, to, label: label || undefined });
            }
        }

        return { nodes, edges };
    }, []);

    const handleApply = () => {
        if (!isValid) return;
        const parsed = parseMermaid(code);
        onApply(parsed);
    };

    // Example templates
    const templates = [
        { name: 'Flowchart', code: 'graph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action 1]\n    B -->|No| D[Action 2]\n    C --> E[End]\n    D --> E' },
        { name: 'Sequence', code: 'sequenceDiagram\n    User->>App: Request\n    App->>API: Fetch\n    API-->>App: Response\n    App-->>User: Display' },
        { name: 'Mindmap', code: 'mindmap\n    root((Central Idea))\n        Branch 1\n            Leaf 1\n            Leaf 2\n        Branch 2\n            Leaf 3' },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Templates */}
            <div className="flex items-center gap-1 px-3 py-2 border-b border-white/5 overflow-x-auto">
                {templates.map((template) => (
                    <button
                        key={template.name}
                        onClick={() => onChange(template.code)}
                        className="px-2 py-1 text-[10px] bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded transition-colors whitespace-nowrap"
                    >
                        {template.name}
                    </button>
                ))}
            </div>

            {/* Code Editor */}
            <div className="flex-1 flex flex-col min-h-0">
                <textarea
                    value={code}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="graph TD&#10;    A[Start] --> B[End]"
                    className="flex-1 w-full bg-[#0f111a] text-gray-200 font-mono text-xs p-3 resize-none focus:outline-none border-b border-white/5"
                    spellCheck={false}
                />

                {/* Status */}
                <div className="flex items-center justify-between px-3 py-2 bg-[#0f111a]">
                    <div className="flex items-center gap-1.5 text-xs">
                        {isValid ? (
                            <>
                                <CheckCircle2 size={12} className="text-green-400" />
                                <span className="text-green-400">Valid</span>
                            </>
                        ) : (
                            <>
                                <AlertCircle size={12} className="text-red-400" />
                                <span className="text-red-400 truncate max-w-[150px]" title={error || ''}>
                                    {error}
                                </span>
                            </>
                        )}
                    </div>
                    <button
                        onClick={handleApply}
                        disabled={!isValid}
                        className="flex items-center gap-1 px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Play size={10} />
                        Apply
                    </button>
                </div>
            </div>

            {/* Preview */}
            {preview && (
                <div className="h-40 border-t border-white/5 overflow-auto bg-[#0f111a] p-2">
                    <div
                        className="mermaid-preview flex items-center justify-center h-full"
                        dangerouslySetInnerHTML={{ __html: preview }}
                    />
                </div>
            )}

            <style jsx>{`
        .mermaid-preview svg {
          max-width: 100%;
          max-height: 100%;
        }
      `}</style>
        </div>
    );
}
