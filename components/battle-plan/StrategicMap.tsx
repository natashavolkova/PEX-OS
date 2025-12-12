'use client';

import { useCallback, useEffect, useRef, useState, DragEvent } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Sparkles, ChevronDown, ArrowDown, ArrowRight } from 'lucide-react';
import dagre from 'dagre';
import LibrarySidebar from './LibrarySidebar';
import EdgeToolbar from './EdgeToolbar';
import StickyNoteNode from './nodes/StickyNoteNode';
import ShapeNode from './nodes/ShapeNode';

// Node types
const nodeTypes: NodeTypes = {
    stickyNote: StickyNoteNode,
    shape: ShapeNode,
};

// Default edge options - Bezier curves with arrow
const defaultEdgeOptions = {
    type: 'default',
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
};

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

// Demo data
const initialNodes: Node[] = [
    { id: '1', type: 'stickyNote', position: { x: 100, y: 100 }, data: { label: 'Ideia inicial', color: 'yellow' } },
    { id: '2', type: 'shape', position: { x: 300, y: 100 }, data: { label: 'Processar', shape: 'rectangle', color: 'indigo' } },
    { id: '3', type: 'shape', position: { x: 300, y: 250 }, data: { label: 'Válido?', shape: 'diamond', color: 'amber' } },
    { id: '4', type: 'stickyNote', position: { x: 500, y: 100 }, data: { label: 'Nota importante!', color: 'pink' } },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', ...defaultEdgeOptions },
    { id: 'e2-3', source: '2', target: '3', ...defaultEdgeOptions },
];

interface StrategicMapProps {
    externalNodes?: Node[];
    externalEdges?: Edge[];
    isSyncing?: boolean;
    syncError?: string | null;
    onGraphChange?: (nodes: Node[], edges: Edge[]) => void;
}

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

    // Edge toolbar state
    const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
    const [edgeToolbarPosition, setEdgeToolbarPosition] = useState({ x: 0, y: 0 });

    // Edge type from sidebar connector selection
    const [currentEdgeType, setCurrentEdgeType] = useState<string>('default');

    const isExternalUpdateRef = useRef(false);
    const prevExternalSigRef = useRef<string>('');
    const nodeIdCounter = useRef(100);

    // Emit changes to parent
    const emitChange = useCallback((n: Node[], e: Edge[]) => {
        if (!isExternalUpdateRef.current && onGraphChange) {
            onGraphChange(n, e);
        }
    }, [onGraphChange]);

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

    // Connection handler - uses currentEdgeType from sidebar selection
    const onConnect = useCallback((params: Connection) => {
        setEdges((eds) => {
            const newEdge = {
                ...params,
                type: currentEdgeType,
                style: { stroke: '#64748b', strokeWidth: 2 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
            };
            const newEdges = addEdge(newEdge, eds);
            emitChange(nodes, newEdges);
            return newEdges;
        });
    }, [setEdges, nodes, emitChange, currentEdgeType]);

    // Edge click handler - shows EdgeToolbar
    const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
        event.stopPropagation();
        const bounds = reactFlowWrapper.current?.getBoundingClientRect();
        if (bounds) {
            setEdgeToolbarPosition({
                x: event.clientX - bounds.left,
                y: event.clientY - bounds.top,
            });
            setSelectedEdge(edge);
        }
    }, []);

    // Update edge properties (from EdgeToolbar)
    const handleUpdateEdge = useCallback((updates: {
        type?: string;
        style?: Record<string, string>;
        markerEnd?: { type: MarkerType; color: string } | undefined;
    }) => {
        if (!selectedEdge) return;

        setEdges((eds) => {
            const updated = eds.map((e) => {
                if (e.id !== selectedEdge.id) return e;

                return {
                    ...e,
                    type: updates.type ?? e.type,
                    style: updates.style ? { ...e.style, ...updates.style } : e.style,
                    markerEnd: updates.markerEnd !== undefined ? updates.markerEnd : e.markerEnd,
                };
            });

            emitChange(nodes, updated);
            return updated;
        });

        // Update selectedEdge state to reflect changes
        setSelectedEdge((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                type: updates.type ?? prev.type,
                style: updates.style ? { ...prev.style, ...updates.style } : prev.style,
                markerEnd: updates.markerEnd !== undefined ? updates.markerEnd : prev.markerEnd,
            };
        });
    }, [selectedEdge, setEdges, nodes, emitChange]);

    // Pane click - deselect edge
    const onPaneClick = useCallback(() => {
        setSelectedEdge(null);
    }, []);

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
            {/* Library Sidebar - Two-stage navigation */}
            <LibrarySidebar
                onEdgeTypeChange={setCurrentEdgeType}
                currentEdgeType={currentEdgeType}
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

                {/* Edge Toolbar (floating) */}
                {selectedEdge && (
                    <EdgeToolbar
                        selectedEdge={selectedEdge}
                        position={edgeToolbarPosition}
                        onUpdateEdge={handleUpdateEdge}
                        onClose={() => setSelectedEdge(null)}
                    />
                )}

                <ReactFlow
                    nodes={nodesWithHandlers}
                    edges={edges}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={handleEdgesChange}
                    onConnect={onConnect}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onEdgeClick={onEdgeClick}
                    onPaneClick={onPaneClick}
                    nodeTypes={nodeTypes}
                    defaultEdgeOptions={defaultEdgeOptions}
                    fitView
                    fitViewOptions={{ padding: 0.3 }}
                    className="bg-slate-950"
                    proOptions={{ hideAttribution: true }}
                    deleteKeyCode={null}
                    selectionOnDrag
                    panOnDrag={[1, 2]}
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
