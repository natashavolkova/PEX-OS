'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import type { Node, Edge, EdgeMarker } from '@xyflow/react';
import { MarkerType } from '@xyflow/react';
import { normalizeDiagram, type NormalizedEdge } from '@/lib/edgePathfinding';

interface DiagramData {
    nodes: Array<{
        id: string;
        type?: string;
        nodeType?: string;
        label?: string;
        shape?: string;
        color?: string;
        x?: number;
        y?: number;
        position?: { x: number; y: number };
        width?: number;
        height?: number;
        measured?: { width?: number; height?: number };
        data?: { label?: string; shape?: string; color?: string };
    }>;
    edges: Array<{
        id?: string;
        source: string;
        target: string;
        sourceHandle?: string;
        targetHandle?: string;
        type?: string;
        label?: string;
        markerEnd?: { type: string; color?: string } | string;
        markerStart?: { type: string; color?: string } | string;
        style?: Record<string, unknown>;
        animated?: boolean;
    }>;
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
        type: node.type || node.nodeType || 'shape',
        position: {
            // Priority: position object > x/y fields > fallback
            x: node.position?.x ?? node.x ?? 250,
            y: node.position?.y ?? node.y ?? index * DEFAULT_NODE_SPACING + 50
        },
        width: node.width,
        height: node.height,
        measured: node.measured,
        data: {
            // Priority: data object > direct fields
            label: node.data?.label ?? node.label ?? 'Node',
            shape: node.data?.shape ?? node.shape ?? 'rectangle',
            color: node.data?.color ?? node.color ?? 'indigo',
        },
    }));

    const edges: Edge[] = (data.edges || []).map((edge, index) => {
        // Fallback ID if not saved
        const edgeId = edge.id || `e${edge.source}-${edge.target}-${index}`;

        // CRITICAL: Validate and preserve edge type EXACTLY as saved
        // Allowed types: 'straight', 'smoothstep', 'step'
        // Default fallback: 'straight' (NOT smoothstep!)
        const validTypes = ['straight', 'smoothstep', 'step', 'smart'];
        let edgeType: string;

        if (edge.type && validTypes.includes(edge.type)) {
            // User's saved type is valid - USE IT EXACTLY
            edgeType = edge.type;
        } else if (edge.type === 'bezier' || edge.type === 'default') {
            // Legacy types get converted to smoothstep
            edgeType = 'smoothstep';
        } else {
            // Missing or invalid type - use straight as default
            edgeType = 'straight';
        }

        console.log(`[Parser] Edge ${edgeId}: saved type="${edge.type}" -> applied type="${edgeType}"`);

        // Helper to convert marker from JSON to proper EdgeMarker type
        const parseMarker = (marker: typeof edge.markerEnd): EdgeMarker | undefined => {
            if (!marker) return undefined;
            if (typeof marker === 'string') {
                // String format: "arrow" or "arrowclosed"
                return { type: marker === 'arrow' ? MarkerType.Arrow : MarkerType.ArrowClosed, color: '#64748b' };
            }
            // Object format: { type: 'arrowclosed', color: '#64748b' }
            const markerType = marker.type?.toLowerCase();
            return {
                type: markerType === 'arrow' ? MarkerType.Arrow : MarkerType.ArrowClosed,
                color: marker.color ?? '#64748b'
            };
        };

        // Preserve or create markerEnd (default: arrow at destination)
        const markerEnd = parseMarker(edge.markerEnd) ?? { type: MarkerType.ArrowClosed, color: '#64748b' };
        const markerStart = parseMarker(edge.markerStart);

        return {
            id: edgeId,
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle,   // CRITICAL: Preserve handle positions
            targetHandle: edge.targetHandle,   // CRITICAL: Preserve handle positions
            label: edge.label,
            type: edgeType,
            style: edge.style ?? { stroke: '#64748b', strokeWidth: 2 },
            markerEnd,
            markerStart,
            animated: edge.animated ?? false,
        };
    });

    // MANDATORY NORMALIZATION - Run BEFORE returning!
    // This forces correct geometry based on node positions
    console.log(`[convertToReactFlow] Running mandatory normalization on ${edges.length} edges...`);

    const normalizedEdges = normalizeDiagram(
        edges as unknown as NormalizedEdge[],
        nodes
    ) as unknown as Edge[];

    console.log(`[convertToReactFlow] Normalization complete. Returning ${normalizedEdges.length} edges.`);

    return { nodes, edges: normalizedEdges };
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
