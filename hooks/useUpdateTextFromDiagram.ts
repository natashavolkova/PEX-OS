'use client';

import { useCallback, useRef } from 'react';
import type { Node, Edge, EdgeMarker } from '@xyflow/react';

// =============================================================================
// COMPLETE DIAGRAM JSON STRUCTURE - Persists ALL visual state
// =============================================================================
interface DiagramNodeJSON {
    id: string;
    type: string;
    position: { x: number; y: number };
    width?: number;
    height?: number;
    data: {
        label: string;
        shape?: string;
        color?: string;
    };
}

interface DiagramEdgeJSON {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;   // CRITICAL: Which side the line exits
    targetHandle?: string;   // CRITICAL: Which side the line enters
    type: string;            // smoothstep, straight (NO 'default' - that's legacy Bezier)
    label?: string;
    markerEnd?: { type: string; color?: string };
    markerStart?: { type: string; color?: string };
    style?: {
        stroke?: string;
        strokeWidth?: number;
        strokeDasharray?: string;
    };
    animated?: boolean;
}

interface DiagramJSON {
    nodes: DiagramNodeJSON[];
    edges: DiagramEdgeJSON[];
}

// =============================================================================
// SERIALIZER - Converts React Flow state to JSON
// =============================================================================
function serializeToJSON(nodes: Node[], edges: Edge[]): string {
    const diagramData: DiagramJSON = {
        nodes: nodes.map(node => {
            const data = node.data as { label?: string; shape?: string; color?: string };
            return {
                id: node.id,
                type: node.type || 'shape',
                position: {
                    x: Math.round(node.position.x),
                    y: Math.round(node.position.y),
                },
                width: node.width,
                height: node.height,
                data: {
                    label: data.label || '',
                    shape: data.shape,
                    color: data.color,
                },
            };
        }),
        edges: edges.map(edge => {
            // Extract style properties
            const style = edge.style as Record<string, unknown> | undefined;

            // Convert markerEnd to serializable format
            const serializeMarker = (marker: EdgeMarker | string | undefined): { type: string; color?: string } | undefined => {
                if (!marker) return undefined;
                if (typeof marker === 'string') {
                    return { type: marker };
                }
                return {
                    type: String(marker.type),
                    color: marker.color ?? undefined,  // Convert null to undefined
                };
            };

            // Type mapping:
            // React Flow uses 'default' for bezier curves
            // We save as: 'bezier', 'smoothstep', or 'straight'
            let edgeType = edge.type || 'smoothstep';
            if (edgeType === 'default') {
                edgeType = 'bezier'; // React Flow 'default' = our 'bezier'
            }

            return {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                sourceHandle: edge.sourceHandle ?? undefined,
                targetHandle: edge.targetHandle ?? undefined,
                type: edgeType,
                label: edge.label ? String(edge.label) : undefined,
                markerEnd: serializeMarker(edge.markerEnd),
                markerStart: serializeMarker(edge.markerStart),
                style: style ? {
                    stroke: style.stroke as string | undefined,
                    strokeWidth: style.strokeWidth as number | undefined,
                    strokeDasharray: style.strokeDasharray as string | undefined,
                } : undefined,
                animated: edge.animated ?? undefined,
            };
        }),
    };

    return JSON.stringify(diagramData, null, 2);
}

// =============================================================================
// MARKDOWN INTEGRATION - Replace or create json-diagram block
// =============================================================================
function replaceJsonDiagramBlock(markdown: string, newJson: string): string {
    const regex = /(```json-diagram\s*)([\s\S]*?)(```)/;
    const match = markdown.match(regex);

    if (match) {
        return markdown.replace(regex, `$1\n${newJson}\n$3`);
    }

    // No existing block - append at end
    return `${markdown}\n\n\`\`\`json-diagram\n${newJson}\n\`\`\``;
}

// =============================================================================
// SIGNATURE - Detects changes (now includes FULL edge data)
// =============================================================================
function computeSignature(nodes: Node[], edges: Edge[]): string {
    // Nodes signature
    const nodesSig = nodes.map(n => {
        const data = n.data as { label?: string; shape?: string; color?: string };
        return `${n.id}:${n.type}:${Math.round(n.position.x)}:${Math.round(n.position.y)}:${data.label || ''}:${data.shape || ''}:${data.color || ''}`;
    }).sort().join('|');

    // Edges signature - NOW INCLUDES ALL PROPERTIES
    const edgesSig = edges.map(e => {
        const style = e.style as Record<string, unknown> | undefined;
        const parts = [
            e.id,
            e.source,
            e.target,
            e.sourceHandle || '',
            e.targetHandle || '',
            e.type || 'smoothstep',
            e.label || '',
            JSON.stringify(e.markerEnd || ''),
            JSON.stringify(e.markerStart || ''),
            style?.strokeDasharray || '',
            e.animated ? '1' : '0',
        ];
        return parts.join(':');
    }).sort().join('|');

    return `${nodesSig}::${edgesSig}`;
}

// =============================================================================
// HOOK - Real-time persistence with 200ms debounce
// =============================================================================
interface UseUpdateTextFromDiagramOptions {
    debounceMs?: number;
}

export function useUpdateTextFromDiagram(
    markdown: string,
    setMarkdown: (value: string) => void,
    options: UseUpdateTextFromDiagramOptions = {}
) {
    // REDUCED from 400ms to 200ms for faster persistence
    const { debounceMs = 200 } = options;

    const lastSignatureRef = useRef<string>('');
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isUpdatingRef = useRef(false);

    const updateTextFromGraph = useCallback(
        (nodes: Node[], edges: Edge[]) => {
            // Skip if currently updating from text → graph (prevents loop)
            if (isUpdatingRef.current) return;

            // Compute signature for change detection
            const newSignature = computeSignature(nodes, edges);

            // Skip if no real change
            if (newSignature === lastSignatureRef.current) return;

            // Clear existing timer
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            // Debounced update
            debounceTimerRef.current = setTimeout(() => {
                lastSignatureRef.current = newSignature;

                const newJson = serializeToJSON(nodes, edges);
                const updatedMarkdown = replaceJsonDiagramBlock(markdown, newJson);

                console.log('[Persistence] Saving diagram state:', {
                    nodes: nodes.length,
                    edges: edges.length,
                    debounceMs,
                });

                // Mark as updating to prevent loop
                isUpdatingRef.current = true;
                setMarkdown(updatedMarkdown);

                // Reset flag after a tick
                requestAnimationFrame(() => {
                    isUpdatingRef.current = false;
                });
            }, debounceMs);
        },
        [markdown, setMarkdown, debounceMs]
    );

    // Method to set the current signature (called when text → graph sync happens)
    const syncSignature = useCallback((nodes: Node[], edges: Edge[]) => {
        lastSignatureRef.current = computeSignature(nodes, edges);
    }, []);

    // Mark as updating (called before text → graph sync)
    const markUpdating = useCallback((updating: boolean) => {
        isUpdatingRef.current = updating;
    }, []);

    return {
        updateTextFromGraph,
        syncSignature,
        markUpdating,
    };
}
