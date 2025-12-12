'use client';

import { useCallback, useRef } from 'react';
import type { Node, Edge } from '@xyflow/react';

interface DiagramJSON {
    nodes: Array<{ id: string; nodeType: string; label: string; shape?: string; color?: string; x?: number; y?: number }>;
    edges: Array<{ source: string; target: string; label?: string }>;
}

function serializeToJSON(nodes: Node[], edges: Edge[]): string {
    const diagramData: DiagramJSON = {
        nodes: nodes.map(node => ({
            id: node.id,
            nodeType: node.type || 'shape',
            label: (node.data as { label: string }).label || '',
            shape: (node.data as { shape?: string }).shape,
            color: (node.data as { color?: string }).color,
            x: Math.round(node.position.x),
            y: Math.round(node.position.y),
        })),
        edges: edges.map(edge => ({
            source: edge.source,
            target: edge.target,
            ...(edge.label ? { label: String(edge.label) } : {}),
        })),
    };
    return JSON.stringify(diagramData, null, 2);
}

function replaceJsonDiagramBlock(markdown: string, newJson: string): string {
    const regex = /(```json-diagram\s*)([\s\S]*?)(```)/;
    const match = markdown.match(regex);

    if (match) {
        return markdown.replace(regex, `$1\n${newJson}\n$3`);
    }

    // No existing block - append at end
    return `${markdown}\n\n\`\`\`json-diagram\n${newJson}\n\`\`\``;
}

function computeSignature(nodes: Node[], edges: Edge[]): string {
    const nodesSig = nodes.map(n => {
        const data = n.data as { label?: string; shape?: string; color?: string };
        return `${n.id}:${n.type}:${Math.round(n.position.x)}:${Math.round(n.position.y)}:${data.label || ''}:${data.shape || ''}:${data.color || ''}`;
    }).sort().join('|');
    const edgesSig = edges.map(e => `${e.source}->${e.target}`).sort().join('|');
    return `${nodesSig}::${edgesSig}`;
}

interface UseUpdateTextFromDiagramOptions {
    debounceMs?: number;
}

export function useUpdateTextFromDiagram(
    markdown: string,
    setMarkdown: (value: string) => void,
    options: UseUpdateTextFromDiagramOptions = {}
) {
    const { debounceMs = 400 } = options;

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
