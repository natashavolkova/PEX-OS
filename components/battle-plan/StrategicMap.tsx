'use client';

import { useCallback, useEffect, useRef, useState, DragEvent, useMemo } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Panel,
    addEdge,
    useNodesState,
    useEdgesState,
    type Node,
    type Edge,
    type Connection,
    type NodeTypes,
    type NodeChange,
    type EdgeChange,
    useReactFlow,
    ReactFlowProvider,
    MarkerType,
    BackgroundVariant,
    ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './strategic-map.css'; // CSS for animated edges
import { Sparkles, ChevronDown, ArrowDown, ArrowRight, AlertTriangle } from 'lucide-react';
import dagre from 'dagre';
import LibrarySidebar, { type EdgeConfig } from './LibrarySidebar';
import StickyNoteNode from './nodes/StickyNoteNode';
import ShapeNode from './nodes/ShapeNode';
import {
    isDiagonalConnection,
    isAlignedConnection,
    getOptimalEdgeType,
    getNodeCenter,
    findCollisions,
    getOptimalHandles,
} from '@/lib/edgePathfinding';

// Node types
const nodeTypes: NodeTypes = {
    stickyNote: StickyNoteNode,
    shape: ShapeNode,
};

// SMART HANDLE CALCULATOR - Shared logic for optimal handle selection based on node positions
export function getSmartHandleIds(sourceNode: Node, targetNode: Node): { source: string; target: string } {
    // Calculate dimensions with failsafe
    const sourceW = sourceNode.measured?.width ?? (sourceNode as unknown as { width?: number }).width ?? 150;
    const sourceH = sourceNode.measured?.height ?? (sourceNode as unknown as { height?: number }).height ?? 128;
    const targetW = targetNode.measured?.width ?? (targetNode as unknown as { width?: number }).width ?? 150;
    const targetH = targetNode.measured?.height ?? (targetNode as unknown as { height?: number }).height ?? 128;

    // Calculate centers
    const sourceCenter = { x: sourceNode.position.x + sourceW / 2, y: sourceNode.position.y + sourceH / 2 };
    const targetCenter = { x: targetNode.position.x + targetW / 2, y: targetNode.position.y + targetH / 2 };

    // Direction vector
    const dx = targetCenter.x - sourceCenter.x;
    const dy = targetCenter.y - sourceCenter.y;

    // Routing decision based on dominant direction
    if (Math.abs(dy) > Math.abs(dx)) {
        // Vertical: target below = b->t, target above = t->b
        return dy > 0 ? { source: 'b', target: 't' } : { source: 't', target: 'b' };
    } else {
        // Horizontal: target right = r->l, target left = l->r
        return dx > 0 ? { source: 'r', target: 'l' } : { source: 'l', target: 'r' };
    }
}

// Dagre layout algorithm
function getLayoutedElements(nodes: Node[], edges: Edge[], direction: 'TB' | 'LR') {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction, ranksep: 80, nodesep: 60 });

    nodes.forEach((node) => {
        const w = node.type === 'stickyNote' ? 128 : 120;
        const h = node.type === 'stickyNote' ? 128 : 100;
        dagreGraph.setNode(node.id, { width: w, height: h });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return {
        nodes: nodes.map((node) => {
            const pos = dagreGraph.node(node.id);
            const w = node.type === 'stickyNote' ? 128 : 120;
            const h = node.type === 'stickyNote' ? 128 : 100;
            return { ...node, position: { x: pos.x - w / 2, y: pos.y - h / 2 } };
        }),
        edges,
    };
}

// Helper: Convert EdgeConfig to React Flow edge properties
// ALL CURVED TYPES NOW USE SMOOTHSTEP - No more wavy bezier!
// - 'bezier' (Curva Suave): smoothstep with high borderRadius (50)
// - 'smoothstep' (Ortogonal): smoothstep with medium borderRadius (15)
// - 'straight' (Reta): straight line
function configToEdgeProps(config: EdgeConfig) {
    // Stroke style
    let strokeDasharray = '0';
    if (config.strokeStyle === 'dashed') strokeDasharray = '8, 4';
    if (config.strokeStyle === 'dotted') strokeDasharray = '2, 2';

    // Marker start - ONLY set if explicitly configured, otherwise UNDEFINED
    let markerStart: { type: MarkerType; color: string } | undefined = undefined;
    if (config.markerStart === 'arrow') {
        markerStart = { type: MarkerType.Arrow, color: '#64748b' };
    } else if (config.markerStart === 'circle') {
        markerStart = { type: MarkerType.ArrowClosed, color: '#64748b' };
    }

    // Marker end - Arrow at DESTINATION (end of line)
    let markerEnd: { type: MarkerType; color: string } | undefined = undefined;
    if (config.markerEnd === 'arrowClosed') {
        markerEnd = { type: MarkerType.ArrowClosed, color: '#64748b' };
    } else if (config.markerEnd === 'arrowOpen') {
        markerEnd = { type: MarkerType.Arrow, color: '#64748b' };
    }

    // 3 EDGE TYPES - ALL USE SMOOTHSTEP EXCEPT STRAIGHT:
    // This gives us: ——╭——╮—— (straight segments with rounded corners)
    // NOT: ~~~~~~~ (wavy bezier)
    let edgeType: string;
    let borderRadius = 0;

    switch (config.type) {
        case 'bezier':
            // "Curva Suave" - smoothstep with VERY rounded corners (looks curved)
            edgeType = 'smoothstep';
            borderRadius = 50; // High radius = very smooth curves
            break;
        case 'smoothstep':
            // "Ortogonal" - smoothstep with slight rounding
            edgeType = 'smoothstep';
            borderRadius = 15; // Lower radius = more angular
            break;
        case 'straight':
        default:
            edgeType = 'straight';
            borderRadius = 0;
            break;
    }

    return {
        type: edgeType,
        style: {
            stroke: '#64748b',
            strokeWidth: 2,
            strokeDasharray,
        },
        pathOptions: { borderRadius },
        markerStart,
        markerEnd,
        animated: config.animated,
        className: config.animated ? 'animated-edge' : '',
        zIndex: 0, // Edges render behind nodes (z-50) for visual masking
    };
}

// Demo data
const initialNodes: Node[] = [
    { id: '1', type: 'stickyNote', position: { x: 100, y: 100 }, data: { label: 'Ideia inicial', color: 'yellow' } },
    { id: '2', type: 'shape', position: { x: 300, y: 100 }, data: { label: 'Processar', shape: 'rectangle', color: 'indigo' } },
    { id: '3', type: 'shape', position: { x: 300, y: 250 }, data: { label: 'Válido?', shape: 'diamond', color: 'amber' } },
    { id: '4', type: 'stickyNote', position: { x: 500, y: 100 }, data: { label: 'Nota importante!', color: 'pink' } },
];

const initialEdges: Edge[] = [
    // e1-2: Horizontal connection (X: 100->300) - smoothstep is appropriate
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' } },
    // e2-3: VERTICAL connection (same X: 300, Y: 100->250) - STRAIGHT is optimal!
    { id: 'e2-3', source: '2', target: '3', type: 'straight', sourceHandle: 'b', targetHandle: 't', style: { stroke: '#64748b', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' } },
];

interface StrategicMapProps {
    externalNodes?: Node[];
    externalEdges?: Edge[];
    isSyncing?: boolean;
    syncError?: string | null;
    onGraphChange?: (nodes: Node[], edges: Edge[]) => void;
}

// Default edge configuration - smoothstep with borderRadius for smart routing
const defaultEdgeConfig: EdgeConfig = {
    type: 'smoothstep',
    strokeStyle: 'solid',
    markerStart: 'none',
    markerEnd: 'arrowClosed',
    animated: false,
};

function StrategicMapInner({
    externalNodes,
    externalEdges,
    isSyncing = false,
    syncError = null,
    onGraphChange,
}: StrategicMapProps) {
    const reactFlowInstance = useReactFlow();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const hasExternalData = externalNodes && externalNodes.length > 0;

    const [nodes, setNodes, onNodesChange] = useNodesState(
        hasExternalData ? externalNodes : initialNodes
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState(
        hasExternalData && externalEdges ? externalEdges : initialEdges
    );
    const [showLayoutMenu, setShowLayoutMenu] = useState(false);

    // Edge configuration state (for new edges and sidebar display)
    const [edgeConfig, setEdgeConfig] = useState<EdgeConfig>(defaultEdgeConfig);

    // Diagonal warning tooltip state
    const [diagonalWarning, setDiagonalWarning] = useState<{
        visible: boolean;
        message: string;
        position: { x: number; y: number };
    }>({ visible: false, message: '', position: { x: 0, y: 0 } });

    const isExternalUpdateRef = useRef(false);
    const prevExternalSigRef = useRef<string>('');
    const nodeIdCounter = useRef(100);

    // Get selected edges from current edges state
    const selectedEdges = useMemo(() => {
        return edges.filter(e => e.selected);
    }, [edges]);

    // Update edgeConfig to reflect selected edge when selection changes
    useEffect(() => {
        if (selectedEdges.length === 1) {
            const edge = selectedEdges[0];
            const style = edge.style as Record<string, unknown> || {};
            const strokeDasharray = String(style.strokeDasharray || '0');

            let strokeStyle: EdgeConfig['strokeStyle'] = 'solid';
            if (strokeDasharray.includes('8') || strokeDasharray.includes('5')) strokeStyle = 'dashed';
            if (strokeDasharray === '2, 2' || strokeDasharray === '2,2') strokeStyle = 'dotted';

            setEdgeConfig({
                type: (edge.type as EdgeConfig['type']) || 'default',
                strokeStyle,
                markerStart: edge.markerStart ? 'arrow' : 'none',
                markerEnd: edge.markerEnd ? 'arrowClosed' : 'none',
                animated: edge.animated || false,
            });
        }
    }, [selectedEdges]);

    // Emit changes to parent
    const emitChange = useCallback((n: Node[], e: Edge[]) => {
        if (!isExternalUpdateRef.current && onGraphChange) {
            onGraphChange(n, e);
        }
    }, [onGraphChange]);

    // Handle edge config change (for defaults)
    const handleEdgeConfigChange = useCallback((updates: Partial<EdgeConfig>) => {
        setEdgeConfig(prev => ({ ...prev, ...updates }));
    }, []);

    // Apply config to selected edges - ONLY applies the properties that changed!
    // Does NOT reset markers when changing geometry, or vice versa
    const handleApplyToSelected = useCallback((updates: Partial<EdgeConfig>) => {
        const selectedIds = new Set(selectedEdges.map(e => e.id));
        if (selectedIds.size === 0) return;

        // Update local config display - merge with existing, not replace
        setEdgeConfig(prev => ({ ...prev, ...updates }));

        // Check if type is being changed - triggers smart re-routing
        const isTypeChange = updates.type !== undefined;

        // Apply properties to selected edges - PRESERVING EXISTING VALUES
        setEdges((eds) => {
            const updatedEdges = eds.map((edge) => {
                if (!selectedIds.has(edge.id)) return edge;

                // CRITICAL: Build config from EXISTING edge state, not edgeConfig preset!
                // This ensures we don't inject markers when user only changed geometry

                // Start with edge's current actual state
                let newType = edge.type || 'straight';
                let newMarkerEnd = edge.markerEnd;
                let newMarkerStart = edge.markerStart;
                let newStyle = edge.style || { stroke: '#64748b', strokeWidth: 2 };
                let newAnimated = edge.animated ?? false;

                // Only override what was EXPLICITLY updated by user
                if (updates.type !== undefined) {
                    // User changed geometry type
                    switch (updates.type) {
                        case 'bezier':
                            newType = 'smoothstep'; // Our bezier = smoothstep with high radius
                            break;
                        case 'smoothstep':
                            newType = 'smoothstep';
                            break;
                        case 'straight':
                        default:
                            newType = 'straight';
                            break;
                    }
                }

                if (updates.markerEnd !== undefined) {
                    // User explicitly changed end marker
                    if (updates.markerEnd === 'arrowClosed') {
                        newMarkerEnd = { type: MarkerType.ArrowClosed, color: '#64748b' };
                    } else if (updates.markerEnd === 'arrowOpen') {
                        newMarkerEnd = { type: MarkerType.Arrow, color: '#64748b' };
                    } else {
                        newMarkerEnd = undefined; // 'none'
                    }
                }

                if (updates.markerStart !== undefined) {
                    // User explicitly changed start marker
                    if (updates.markerStart === 'arrow') {
                        newMarkerStart = { type: MarkerType.Arrow, color: '#64748b' };
                    } else if (updates.markerStart === 'circle') {
                        newMarkerStart = { type: MarkerType.ArrowClosed, color: '#64748b' };
                    } else {
                        newMarkerStart = undefined; // 'none'
                    }
                }

                if (updates.strokeStyle !== undefined) {
                    // User changed stroke style
                    let strokeDasharray = '0';
                    if (updates.strokeStyle === 'dashed') strokeDasharray = '8, 4';
                    if (updates.strokeStyle === 'dotted') strokeDasharray = '2, 2';
                    newStyle = { ...newStyle, strokeDasharray };
                }

                if (updates.animated !== undefined) {
                    newAnimated = updates.animated;
                }

                // Calculate pathOptions based on final type
                let pathOptions = { borderRadius: 0 };
                if (newType === 'smoothstep') {
                    pathOptions = { borderRadius: updates.type === 'bezier' ? 50 : 15 };
                }

                // If type is changing, recalculate optimal handles
                let newSourceHandle = edge.sourceHandle;
                let newTargetHandle = edge.targetHandle;

                if (isTypeChange) {
                    const srcNode = nodes.find(n => n.id === edge.source);
                    const tgtNode = nodes.find(n => n.id === edge.target);

                    if (srcNode && tgtNode) {
                        const smartHandles = getSmartHandleIds(srcNode, tgtNode);
                        newSourceHandle = smartHandles.source;
                        newTargetHandle = smartHandles.target;
                        console.log(`[SmartReroute] Edge ${edge.id}: ${smartHandles.source} -> ${smartHandles.target}`);
                    }
                }

                console.log(`[ApplyToSelected] Edge ${edge.id}: updates=${JSON.stringify(updates)}, finalType=${newType}, markerEnd=${newMarkerEnd ? 'set' : 'none'}`);

                return {
                    ...edge,
                    sourceHandle: newSourceHandle,
                    targetHandle: newTargetHandle,
                    type: newType,
                    style: newStyle,
                    pathOptions,
                    markerStart: newMarkerStart,
                    markerEnd: newMarkerEnd,
                    animated: newAnimated,
                    className: newAnimated ? 'animated-edge' : '',
                };
            });

            emitChange(nodes, updatedEdges);
            return updatedEdges;
        });
    }, [selectedEdges, edgeConfig, setEdges, nodes, emitChange]);

    // Select all edges - for mass editing
    const handleSelectAllEdges = useCallback(() => {
        setEdges((eds) => {
            return eds.map((edge) => ({
                ...edge,
                selected: true,
            }));
        });
    }, [setEdges]);

    // Label change handler
    const handleLabelChange = useCallback((nodeId: string, newLabel: string) => {
        setNodes((nds) => {
            const updated = nds.map((n) =>
                n.id === nodeId ? { ...n, data: { ...n.data, label: newLabel } } : n
            );
            if (onGraphChange) onGraphChange(updated, edges);
            return updated;
        });
    }, [setNodes, edges, onGraphChange]);

    // Color change handler
    const handleColorChange = useCallback((nodeId: string, color: string) => {
        setNodes((nds) => {
            const updated = nds.map((n) =>
                n.id === nodeId ? { ...n, data: { ...n.data, color } } : n
            );
            if (onGraphChange) onGraphChange(updated, edges);
            return updated;
        });
    }, [setNodes, edges, onGraphChange]);

    // Delete node handler
    const handleDeleteNode = useCallback((nodeId: string) => {
        setNodes((nds) => {
            const updated = nds.filter((n) => n.id !== nodeId);
            const updatedEdges = edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
            setEdges(updatedEdges);
            if (onGraphChange) onGraphChange(updated, updatedEdges);
            return updated;
        });
    }, [setNodes, setEdges, edges, onGraphChange]);

    // Inject handlers into nodes
    const nodesWithHandlers = nodes.map((node) => ({
        ...node,
        data: {
            ...node.data,
            onLabelChange: handleLabelChange,
            onColorChange: handleColorChange,
            onDelete: handleDeleteNode,
        },
    }));

    // External data sync
    useEffect(() => {
        if (externalNodes && externalNodes.length > 0) {
            const sig = JSON.stringify(externalNodes.map(n => ({ id: n.id, label: n.data?.label, color: n.data?.color, shape: n.data?.shape })));
            if (sig !== prevExternalSigRef.current) {
                prevExternalSigRef.current = sig;
                isExternalUpdateRef.current = true;
                setNodes(externalNodes);
                setEdges(externalEdges || []);
                requestAnimationFrame(() => { isExternalUpdateRef.current = false; });
            }
        }
    }, [externalNodes, externalEdges, setNodes, setEdges]);

    // Drag and Drop handlers
    const onDragOver = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: DragEvent) => {
        event.preventDefault();

        const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
        const dataStr = event.dataTransfer.getData('application/reactflow');

        if (!dataStr || !reactFlowBounds) return;

        const { nodeType, data } = JSON.parse(dataStr);
        const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        const newId = `node-${++nodeIdCounter.current}`;
        const newNode: Node = {
            id: newId,
            type: nodeType,
            position,
            data: {
                label: nodeType === 'stickyNote' ? 'Nova nota' : 'Label',
                ...data,
            },
        };

        setNodes((nds) => {
            const updated = [...nds, newNode];
            emitChange(updated, edges);
            return updated;
        });
    }, [reactFlowInstance, setNodes, edges, emitChange]);

    // Auto-layout
    const handleLayout = useCallback((direction: 'TB' | 'LR') => {
        const { nodes: ln, edges: le } = getLayoutedElements(nodes, edges, direction);
        setNodes(ln);
        setEdges(le);
        emitChange(ln, le);
        setShowLayoutMenu(false);
        requestAnimationFrame(() => { reactFlowInstance.fitView({ padding: 0.3 }); });
    }, [nodes, edges, setNodes, setEdges, emitChange, reactFlowInstance]);

    // Node changes handler
    const handleNodesChange = useCallback((changes: NodeChange<Node>[]) => {
        onNodesChange(changes);
        if (!isExternalUpdateRef.current) {
            const hasPositionChange = changes.some(c => c.type === 'position' && c.dragging === false);
            if (hasPositionChange) {
                setNodes((curr) => { emitChange(curr, edges); return curr; });
            }
        }
    }, [onNodesChange, edges, emitChange, setNodes]);

    // Edge changes handler
    const handleEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => {
        onEdgesChange(changes);
        if (!isExternalUpdateRef.current) {
            setEdges((curr) => { emitChange(nodes, curr); return curr; });
        }
    }, [onEdgesChange, nodes, emitChange, setEdges]);

    // AUTO-REROUTE ON NODE DRAG - Smart re-routing when nodes are moved
    const onNodeDragStop = useCallback(
        (_event: React.MouseEvent, node: Node) => {
            // 1. Find all edges connected to this node
            const connectedEdges = edges.filter(
                (e) => e.source === node.id || e.target === node.id
            );

            // 2. If no connections, ignore
            if (connectedEdges.length === 0) return;

            // 3. Prepare updates with smart handles
            const updates = connectedEdges.map((edge) => {
                const sourceNode = reactFlowInstance.getNode(edge.source);
                const targetNode = reactFlowInstance.getNode(edge.target);

                if (!sourceNode || !targetNode) return edge;

                // 4. Recalculate smart route
                const smartHandles = getSmartHandleIds(sourceNode, targetNode);

                console.log(`[AutoReroute] Edge ${edge.id}: ${smartHandles.source} -> ${smartHandles.target}`);

                // 5. Return edge with new handles
                return {
                    ...edge,
                    sourceHandle: smartHandles.source,
                    targetHandle: smartHandles.target,
                };
            });

            // 6. Apply changes
            setEdges((eds) => {
                const updatedEdges = eds.map((e) => {
                    const update = updates.find((u) => u.id === e.id);
                    return update ? update : e;
                });
                emitChange(nodes, updatedEdges);
                return updatedEdges;
            });
        },
        [edges, reactFlowInstance, setEdges, nodes, emitChange]
    );

    // SMART AUTO-CONNECT V2 - With failsafe dimension reading and console logging
    const onConnect = useCallback(
        (params: Connection) => {
            // 1. Get complete nodes to access positions
            const sourceNode = reactFlowInstance.getNode(params.source || '');
            const targetNode = reactFlowInstance.getNode(params.target || '');

            if (!sourceNode || !targetNode) {
                // Fallback if something goes wrong - connect normally
                console.log('[SmartConnect] FALLBACK: Source or target node not found');
                setEdges((eds) => {
                    const props = configToEdgeProps(edgeConfig);
                    const newEdges = addEdge({ ...params, ...props }, eds);
                    emitChange(nodes, newEdges);
                    return newEdges;
                });
                return;
            }

            // 2. Calculate Centers with FAILSAFE for width/height (assumes 150x128 if null)
            // React Flow v11+ uses 'width', v12+ may use 'measured'
            const sourceW = sourceNode.measured?.width ?? (sourceNode as unknown as { width?: number }).width ?? 150;
            const sourceH = sourceNode.measured?.height ?? (sourceNode as unknown as { height?: number }).height ?? 128;
            const targetW = targetNode.measured?.width ?? (targetNode as unknown as { width?: number }).width ?? 150;
            const targetH = targetNode.measured?.height ?? (targetNode as unknown as { height?: number }).height ?? 128;

            const sourceCenter = {
                x: sourceNode.position.x + sourceW / 2,
                y: sourceNode.position.y + sourceH / 2,
            };
            const targetCenter = {
                x: targetNode.position.x + targetW / 2,
                y: targetNode.position.y + targetH / 2,
            };

            // 3. Direction Vector
            const dx = targetCenter.x - sourceCenter.x;
            const dy = targetCenter.y - sourceCenter.y;

            // 4. Routing Decision
            let smartSourceHandle = params.sourceHandle;
            let smartTargetHandle = params.targetHandle;

            // Audit log (View in F12)
            console.log(`[SmartConnect] Source: ${params.source} (${sourceW}x${sourceH}) @ ${sourceNode.position.x},${sourceNode.position.y}`);
            console.log(`[SmartConnect] Target: ${params.target} (${targetW}x${targetH}) @ ${targetNode.position.x},${targetNode.position.y}`);
            console.log(`[SmartConnect] DX: ${dx.toFixed(0)}, DY: ${dy.toFixed(0)}`);

            if (Math.abs(dy) > Math.abs(dx)) {
                // VERTICAL
                if (dy > 0) {
                    // Target is BELOW -> Exit from Bottom (b), Enter from Top (t)
                    smartSourceHandle = 'b';
                    smartTargetHandle = 't';
                    console.log('[SmartConnect] -> Route Vertical: BOTTOM -> TOP');
                } else {
                    // Target is ABOVE -> Exit from Top (t), Enter from Bottom (b)
                    smartSourceHandle = 't';
                    smartTargetHandle = 'b';
                    console.log('[SmartConnect] -> Route Vertical: TOP -> BOTTOM');
                }
            } else {
                // HORIZONTAL
                if (dx > 0) {
                    // Target is to the RIGHT -> Exit from Right (r), Enter from Left (l)
                    smartSourceHandle = 'r';
                    smartTargetHandle = 'l';
                    console.log('[SmartConnect] -> Route Horizontal: RIGHT -> LEFT');
                } else {
                    // Target is to the LEFT -> Exit from Left (l), Enter from Right (r)
                    smartSourceHandle = 'l';
                    smartTargetHandle = 'r';
                    console.log('[SmartConnect] -> Route Horizontal: LEFT -> RIGHT');
                }
            }

            // 5. RESPECT USER'S EDGE TYPE CHOICE
            // The user selected the type in LibrarySidebar - we RESPECT that choice
            // ONLY exception: block straight lines on true diagonals (both dx and dy > 50px)

            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);
            const isTrueDiagonal = absDx > 50 && absDy > 50;

            // Start with EXACTLY what the user configured
            let effectiveConfig: EdgeConfig = { ...edgeConfig };

            // ONLY override if user chose straight on a true diagonal
            if (edgeConfig.type === 'straight' && isTrueDiagonal) {
                console.log('[SmartConnect] Blocking straight on true diagonal - forcing smoothstep');
                effectiveConfig = { ...edgeConfig, type: 'smoothstep' };
                setDiagonalWarning({
                    visible: true,
                    message: 'Linhas retas não funcionam em diagonais. Usando linha angular.',
                    position: {
                        x: (sourceCenter.x + targetCenter.x) / 2,
                        y: Math.min(sourceCenter.y, targetCenter.y) - 50,
                    },
                });
                setTimeout(() => {
                    setDiagonalWarning(prev => ({ ...prev, visible: false }));
                }, 3000);
            }

            const props = configToEdgeProps(effectiveConfig);
            const smartEdge = {
                ...params,
                sourceHandle: smartSourceHandle,
                targetHandle: smartTargetHandle,
                ...props,
            };

            console.log(`[SmartConnect] Final: ${smartSourceHandle} -> ${smartTargetHandle}, type: ${props.type}, diagonal: ${isTrueDiagonal}, userType: ${edgeConfig.type}`);

            setEdges((eds) => {
                const newEdges = addEdge(smartEdge, eds);
                emitChange(nodes, newEdges);
                return newEdges;
            });
        },
        [reactFlowInstance, setEdges, nodes, emitChange, edgeConfig]
    );

    // Keyboard delete handler
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const selN = nodes.filter(n => n.selected);
                const selE = edges.filter(e => e.selected);
                if (selN.length || selE.length) {
                    const ids = new Set(selN.map(n => n.id));
                    const newN = nodes.filter(n => !n.selected);
                    const newE = edges.filter(e => !e.selected && !ids.has(e.source) && !ids.has(e.target));
                    setNodes(newN);
                    setEdges(newE);
                    emitChange(newN, newE);
                }
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [nodes, edges, setNodes, setEdges, emitChange]);

    return (
        <div className="w-full h-full flex bg-slate-950">
            {/* Library Sidebar - Master Control Panel */}
            <LibrarySidebar
                edgeConfig={edgeConfig}
                onEdgeConfigChange={handleEdgeConfigChange}
                selectedEdges={selectedEdges}
                onApplyToSelected={handleApplyToSelected}
                onSelectAllEdges={handleSelectAllEdges}
                totalEdgesCount={edges.length}
            />

            {/* Canvas Area */}
            <div ref={reactFlowWrapper} className="flex-1 relative">
                {/* Sync Status */}
                {(isSyncing || syncError) && (
                    <div className="absolute top-3 left-3 z-50">
                        {isSyncing && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-950/80 border border-indigo-700/50 rounded-lg text-xs text-indigo-300">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                                Sincronizando...
                            </div>
                        )}
                        {syncError && !isSyncing && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-950/80 border border-amber-700/50 rounded-lg text-xs text-amber-300">
                                ⚠️ {syncError}
                            </div>
                        )}
                    </div>
                )}

                {/* Diagonal Warning Tooltip */}
                {diagonalWarning.visible && (
                    <div
                        className="absolute z-50 pointer-events-none transform -translate-x-1/2 animate-pulse"
                        style={{
                            left: diagonalWarning.position.x,
                            top: diagonalWarning.position.y + 100, // Offset for canvas transform
                        }}
                    >
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-900/95 border border-amber-500/60 rounded-lg shadow-xl">
                            <AlertTriangle size={16} className="text-amber-400" />
                            <span className="text-xs font-medium text-amber-200">
                                {diagonalWarning.message}
                            </span>
                        </div>
                    </div>
                )}

                <ReactFlow
                    nodes={nodesWithHandlers}
                    edges={edges}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={handleEdgesChange}
                    onConnect={onConnect}
                    onNodeDragStop={onNodeDragStop}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    nodeTypes={nodeTypes}
                    connectionMode={ConnectionMode.Loose}
                    fitView
                    fitViewOptions={{ padding: 0.3 }}
                    className="bg-slate-950"
                    proOptions={{ hideAttribution: true }}
                    deleteKeyCode={null}
                    selectionOnDrag
                    panOnDrag={[1, 2]}
                    defaultEdgeOptions={{
                        type: 'smoothstep',
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
                        style: { strokeWidth: 2, stroke: '#64748b' },
                        animated: false,
                    }}
                >
                    <Background variant={BackgroundVariant.Dots} color="#334155" gap={20} size={1} />
                    <Controls className="!bg-slate-900 !border-slate-700 !rounded-lg !shadow-xl [&>button]:!bg-slate-800 [&>button]:!border-slate-600 [&>button]:!text-slate-300 [&>button:hover]:!bg-slate-700" />
                    <MiniMap
                        nodeColor={(n) => {
                            if (n.type === 'stickyNote') {
                                const c = n.data?.color as string || 'yellow';
                                return { yellow: '#fde047', pink: '#f9a8d4', blue: '#93c5fd', green: '#86efac', orange: '#fdba74', purple: '#d8b4fe' }[c] || '#fde047';
                            }
                            const c = n.data?.color as string || 'indigo';
                            return { slate: '#475569', indigo: '#6366f1', emerald: '#10b981', amber: '#f59e0b', rose: '#f43f5e', cyan: '#06b6d4' }[c] || '#6366f1';
                        }}
                        maskColor="rgba(0, 0, 0, 0.8)"
                        className="!bg-slate-900 !border-slate-700 !rounded-lg"
                    />

                    {/* Layout Dropdown */}
                    <Panel position="top-right" className="!right-2 !top-2">
                        <div className="relative">
                            <button
                                onClick={() => setShowLayoutMenu(!showLayoutMenu)}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-lg shadow-lg transition-colors"
                            >
                                <Sparkles size={14} />
                                Organizar
                                <ChevronDown size={12} />
                            </button>
                            {showLayoutMenu && (
                                <div className="absolute top-full right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl overflow-hidden z-50">
                                    <button
                                        onClick={() => handleLayout('TB')}
                                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-700 text-xs text-slate-200"
                                    >
                                        <ArrowDown size={14} />
                                        Vertical
                                    </button>
                                    <button
                                        onClick={() => handleLayout('LR')}
                                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-700 text-xs text-slate-200"
                                    >
                                        <ArrowRight size={14} />
                                        Horizontal
                                    </button>
                                </div>
                            )}
                        </div>
                    </Panel>
                </ReactFlow>
            </div>
        </div>
    );
}

export default function StrategicMap(props: StrategicMapProps) {
    return (
        <ReactFlowProvider>
            <StrategicMapInner {...props} />
        </ReactFlowProvider>
    );
}
