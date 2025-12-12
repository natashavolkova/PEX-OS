'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
    Square, Diamond, Circle, StickyNote, Trash2, Sparkles,
    ChevronDown, ArrowDown, ArrowRight
} from 'lucide-react';
import dagre from 'dagre';
import CustomNode, { type NodeShape, type NodeStyle } from './CustomNode';

// Node types registration
const nodeTypes: NodeTypes = {
    custom: CustomNode,
};

// Default edge options
const defaultEdgeOptions = {
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
};

// Shape definitions for toolbar
const shapes: { id: NodeShape; icon: typeof Square; label: string; color: string }[] = [
    { id: 'process', icon: Square, label: 'Processo', color: 'text-indigo-400' },
    { id: 'decision', icon: Diamond, label: 'Decisão', color: 'text-amber-400' },
    { id: 'terminal', icon: Circle, label: 'Terminal', color: 'text-emerald-400' },
    { id: 'note', icon: StickyNote, label: 'Nota', color: 'text-yellow-400' },
];

// Dagre layout
function getLayoutedElements(nodes: Node[], edges: Edge[], direction: 'TB' | 'LR') {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 60 });

    nodes.forEach((node) => {
        const width = node.data?.shape === 'decision' ? 100 : 160;
        const height = node.data?.shape === 'decision' ? 100 : 60;
        dagreGraph.setNode(node.id, { width, height });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return {
        nodes: nodes.map((node) => {
            const pos = dagreGraph.node(node.id);
            const width = node.data?.shape === 'decision' ? 100 : 160;
            const height = node.data?.shape === 'decision' ? 100 : 60;
            return { ...node, position: { x: pos.x - width / 2, y: pos.y - height / 2 } };
        }),
        edges,
    };
}

// Initial demo data
const initialNodes: Node[] = [
    { id: '1', type: 'custom', position: { x: 250, y: 50 }, data: { label: 'Início', shape: 'terminal', style: 'success' } },
    { id: '2', type: 'custom', position: { x: 250, y: 180 }, data: { label: 'Processar', shape: 'process', style: 'default' } },
    { id: '3', type: 'custom', position: { x: 250, y: 310 }, data: { label: 'Válido?', shape: 'decision', style: 'warning' } },
    { id: '4', type: 'custom', position: { x: 100, y: 450 }, data: { label: 'Fim', shape: 'terminal', style: 'danger' } },
    { id: '5', type: 'custom', position: { x: 400, y: 450 }, data: { label: 'Sucesso', shape: 'terminal', style: 'success' } },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', ...defaultEdgeOptions },
    { id: 'e2-3', source: '2', target: '3', ...defaultEdgeOptions },
    { id: 'e3-4', source: '3', target: '4', label: 'Não', ...defaultEdgeOptions },
    { id: 'e3-5', source: '3', target: '5', label: 'Sim', ...defaultEdgeOptions },
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
    const hasExternalData = externalNodes && externalNodes.length > 0;

    const [nodes, setNodes, onNodesChange] = useNodesState(
        hasExternalData ? externalNodes : initialNodes
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState(
        hasExternalData && externalEdges ? externalEdges : initialEdges
    );
    const [showLayoutMenu, setShowLayoutMenu] = useState(false);

    const isExternalUpdateRef = useRef(false);
    const prevExternalSigRef = useRef<string>('');
    const nodeIdCounter = useRef(100);

    // Emit changes
    const emitChange = useCallback((n: Node[], e: Edge[]) => {
        if (!isExternalUpdateRef.current && onGraphChange) {
            onGraphChange(n, e);
        }
    }, [onGraphChange]);

    // Label change
    const handleLabelChange = useCallback((nodeId: string, newLabel: string) => {
        setNodes((nds) => {
            const updated = nds.map((n) =>
                n.id === nodeId ? { ...n, data: { ...n.data, label: newLabel } } : n
            );
            if (onGraphChange) onGraphChange(updated, edges);
            return updated;
        });
    }, [setNodes, edges, onGraphChange]);

    // Style change
    const handleStyleChange = useCallback((nodeId: string, style: NodeStyle) => {
        setNodes((nds) => {
            const updated = nds.map((n) =>
                n.id === nodeId ? { ...n, data: { ...n.data, style } } : n
            );
            if (onGraphChange) onGraphChange(updated, edges);
            return updated;
        });
    }, [setNodes, edges, onGraphChange]);

    // Inject handlers
    const nodesWithHandlers = nodes.map((node) => ({
        ...node,
        data: { ...node.data, onLabelChange: handleLabelChange, onStyleChange: handleStyleChange },
    }));

    // External sync
    useEffect(() => {
        if (externalNodes && externalNodes.length > 0) {
            const sig = JSON.stringify(externalNodes.map(n => ({ id: n.id, label: n.data?.label, shape: n.data?.shape, style: n.data?.style })));
            if (sig !== prevExternalSigRef.current) {
                prevExternalSigRef.current = sig;
                isExternalUpdateRef.current = true;
                setNodes(externalNodes);
                setEdges(externalEdges || []);
                requestAnimationFrame(() => { isExternalUpdateRef.current = false; });
            }
        }
    }, [externalNodes, externalEdges, setNodes, setEdges]);

    // Add node
    const handleAddNode = useCallback((shape: NodeShape) => {
        const viewport = reactFlowInstance.getViewport();
        const x = (-viewport.x + 400) / viewport.zoom;
        const y = (-viewport.y + 200) / viewport.zoom;

        const newId = `node-${++nodeIdCounter.current}`;
        const labels: Record<NodeShape, string> = {
            process: 'Novo Processo',
            decision: 'Condição?',
            terminal: 'Terminal',
            note: 'Nota aqui...',
        };

        const newNode: Node = {
            id: newId,
            type: 'custom',
            position: { x, y },
            data: { label: labels[shape], shape, style: 'default' },
        };

        setNodes((nds) => {
            const updated = [...nds, newNode];
            emitChange(updated, edges);
            return updated;
        });
    }, [reactFlowInstance, setNodes, edges, emitChange]);

    // Layout
    const handleLayout = useCallback((direction: 'TB' | 'LR') => {
        const { nodes: ln, edges: le } = getLayoutedElements(nodes, edges, direction);
        setNodes(ln);
        setEdges(le);
        emitChange(ln, le);
        setShowLayoutMenu(false);
        requestAnimationFrame(() => { reactFlowInstance.fitView({ padding: 0.3 }); });
    }, [nodes, edges, setNodes, setEdges, emitChange, reactFlowInstance]);

    // Node changes
    const handleNodesChange = useCallback((changes: NodeChange<Node>[]) => {
        onNodesChange(changes);
        if (!isExternalUpdateRef.current) {
            const hasPositionChange = changes.some(c => c.type === 'position' && c.dragging === false);
            if (hasPositionChange) {
                setNodes((curr) => { emitChange(curr, edges); return curr; });
            }
        }
    }, [onNodesChange, edges, emitChange, setNodes]);

    // Edge changes
    const handleEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => {
        onEdgesChange(changes);
        if (!isExternalUpdateRef.current) {
            setEdges((curr) => { emitChange(nodes, curr); return curr; });
        }
    }, [onEdgesChange, nodes, emitChange, setEdges]);

    // Connect
    const onConnect = useCallback((params: Connection) => {
        setEdges((eds) => {
            const newEdges = addEdge({ ...params, ...defaultEdgeOptions }, eds);
            emitChange(nodes, newEdges);
            return newEdges;
        });
    }, [setEdges, nodes, emitChange]);

    // Delete
    const handleDelete = useCallback(() => {
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
    }, [nodes, edges, setNodes, setEdges, emitChange]);

    // Keyboard
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
            if (e.key === 'Delete' || e.key === 'Backspace') handleDelete();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [handleDelete]);

    return (
        <div className="w-full h-full bg-slate-950 relative">
            {/* Status */}
            {(isSyncing || syncError) && (
                <div className="absolute top-3 left-16 z-50">
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

            <ReactFlow
                nodes={nodesWithHandlers}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onConnect={onConnect}
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
                <Background color="#334155" gap={20} size={1} />
                <Controls className="!bg-slate-900 !border-slate-700 !rounded-lg !shadow-xl [&>button]:!bg-slate-800 [&>button]:!border-slate-600 [&>button]:!text-slate-300 [&>button:hover]:!bg-slate-700" />
                <MiniMap
                    nodeColor={(n) => {
                        const style = n.data?.style as NodeStyle || 'default';
                        return { default: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444' }[style];
                    }}
                    maskColor="rgba(0, 0, 0, 0.8)"
                    className="!bg-slate-900 !border-slate-700 !rounded-lg"
                />

                {/* Left Toolbar - Miro Style */}
                <Panel position="top-left" className="!left-2 !top-2">
                    <div className="bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl p-2 flex flex-col gap-1">
                        {shapes.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => handleAddNode(s.id)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors group"
                                title={s.label}
                            >
                                <s.icon size={18} className={s.color} />
                                <span className="text-xs text-slate-400 group-hover:text-slate-200">{s.label}</span>
                            </button>
                        ))}
                        <hr className="border-slate-700 my-1" />
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-900/50 transition-colors group"
                            title="Excluir selecionados"
                        >
                            <Trash2 size={18} className="text-red-400" />
                            <span className="text-xs text-slate-400 group-hover:text-red-300">Excluir</span>
                        </button>
                    </div>
                </Panel>

                {/* Top Right - Layout Dropdown */}
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
    );
}

export default function StrategicMap(props: StrategicMapProps) {
    return (
        <ReactFlowProvider>
            <StrategicMapInner {...props} />
        </ReactFlowProvider>
    );
}
