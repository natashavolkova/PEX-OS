'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';

interface DiagramData {
    nodes: Array<{ id: string; nodeType?: string; label: string; shape?: string; color?: string; x?: number; y?: number }>;
    edges: Array<{ source: string; target: string; label?: string }>;
}

interface ParseResult {
    nodes: Node[];
    edges: Edge[];
    isValid: boolean;
    error: string | null;
    isSyncing: boolean;
}

const DEFAULT_NODE_SPACING = 130;

function parseDiagramBlock(markdown: string): DiagramData | null {
    const regex = /```json-diagram\s*([\s\S]*?)```/;
    const match = markdown.match(regex);

    if (!match || !match[1]) return null;

    try {
        const json = JSON.parse(match[1].trim());
        if (json.nodes && Array.isArray(json.nodes)) {
            return json as DiagramData;
        }
        return null;
    } catch {
        return null;
    }
}

function convertToReactFlow(data: DiagramData): { nodes: Node[]; edges: Edge[] } {
    const nodes: Node[] = data.nodes.map((node, index) => ({
        id: node.id,
        type: node.nodeType || 'shape',
        position: {
            x: node.x ?? 250,
            y: node.y ?? index * DEFAULT_NODE_SPACING + 50
        },
        data: {
            label: node.label,
            shape: node.shape || 'rectangle',
            color: node.color || 'indigo',
        },
    }));

    const edges: Edge[] = (data.edges || []).map((edge, index) => ({
        id: `e${edge.source}-${edge.target}-${index}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        type: 'default',
        style: { stroke: '#64748b', strokeWidth: 2 },
    }));

    return { nodes, edges };
}

export function useParseDiagramFromText(
    markdownContent: string,
    debounceMs: number = 500
): ParseResult {
    const [result, setResult] = useState<ParseResult>({
        nodes: [],
        edges: [],
        isValid: true,
        error: null,
        isSyncing: false,
    });

    const lastValidRef = useRef<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setResult(prev => ({ ...prev, isSyncing: true }));

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            const diagramData = parseDiagramBlock(markdownContent);

            if (diagramData) {
                try {
                    const converted = convertToReactFlow(diagramData);
                    lastValidRef.current = converted;
                    setResult({
                        nodes: converted.nodes,
                        edges: converted.edges,
                        isValid: true,
                        error: null,
                        isSyncing: false,
                    });
                } catch (e) {
                    setResult({
                        ...lastValidRef.current,
                        isValid: false,
                        error: 'Erro ao converter diagrama',
                        isSyncing: false,
                    });
                }
            } else if (markdownContent.includes('```json-diagram')) {
                // Block exists but JSON is invalid - keep last valid
                setResult({
                    ...lastValidRef.current,
                    isValid: false,
                    error: 'JSON inválido - mantendo último estado',
                    isSyncing: false,
                });
            } else {
                // No diagram block - use empty or last valid
                setResult({
                    nodes: lastValidRef.current.nodes,
                    edges: lastValidRef.current.edges,
                    isValid: true,
                    error: null,
                    isSyncing: false,
                });
            }
        }, debounceMs);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [markdownContent, debounceMs]);

    return result;
}
