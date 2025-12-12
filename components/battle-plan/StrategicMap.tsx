'use client';

import { useCallback, useEffect, useRef, useState, memo } from 'react';
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
    Handle,
    Position,
    useReactFlow,
    ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, Trash2, Sparkles, Palette } from 'lucide-react';
import dagre from 'dagre';

// Node style types
type NodeStyle = 'default' | 'success' | 'warning' | 'danger';

const styleColors: Record<NodeStyle, string> = {
    default: 'border-indigo-600 bg-indigo-950',
    success: 'border-emerald-500 bg-emerald-950',
    warning: 'border-amber-500 bg-amber-950',
    danger: 'border-red-500 bg-red-950',
};

const styleLabels: Record<NodeStyle, string> = {
    default: '🔵 Padrão',
    success: '✅ Sucesso',
    warning: '⚠️ Atenção',
    danger: '❌ Risco',
};

// Editable Node Component with Colors
const EditableNode = memo(({ id, data, selected }: {
    id: string;
    data: {
        label: string;
        style?: NodeStyle;
        onLabelChange?: (id: string, label: string) => void;
        onStyleChange?: (id: string, style: NodeStyle) => void;
    };
    selected?: boolean;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(data.label);
    const [showStyleMenu, setShowStyleMenu] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const nodeStyle = data.style || 'default';
    const colorClass = styleColors[nodeStyle];

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    useEffect(() => {
        setEditValue(data.label);
    }, [data.label]);

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditValue(data.label);
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        const trimmed = editValue.trim();
        if (trimmed && trimmed !== data.label && data.onLabelChange) {
            data.onLabelChange(id, trimmed);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditValue(data.label);
        }
    };

    const handleStyleSelect = (style: NodeStyle) => {
        setShowStyleMenu(false);
        if (data.onStyleChange) {
            data.onStyleChange(id, style);
        }
    };

    return (
        <div
            className={`relative px-4 py-3 rounded-lg border-2 ${colorClass} shadow-xl min-w-[160px] ${selected ? 'ring-2 ring-white/50' : ''}`}
            onDoubleClick={handleDoubleClick}
        >
            <Handle type="target" position={Position.Top} className="!bg-slate-400 !border-slate-300 !w-3 !h-3" />

            {isEditing ? (
                <input
                    ref={inputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-slate-800 text-slate-200 text-sm font-medium text-center px-2 py-1 rounded border border-slate-600 outline-none focus:border-indigo-500"
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <div className="text-sm font-medium text-slate-200 text-center cursor-text select-none">
                    {data.label}
                </div>
            )}

            {/* Style selector button */}
            {selected && !isEditing && (
                <button
                    onClick={(e) => { e.stopPropagation(); setShowStyleMenu(!showStyleMenu); }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center shadow-lg border border-slate-500"
                >
                    <Palette size={12} className="text-slate-300" />
                </button>
            )}

            {/* Style menu */}
            {showStyleMenu && (
                <div className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 overflow-hidden">
                    {(Object.keys(styleLabels) as NodeStyle[]).map((style) => (
                        <button
                            key={style}
                            onClick={(e) => { e.stopPropagation(); handleStyleSelect(style); }}
                            className={`w-full px-3 py-2 text-xs text-left hover:bg-slate-700 ${nodeStyle === style ? 'bg-slate-700' : ''}`}
                        >
                            {styleLabels[style]}
                        </button>
                    ))}
                </div>
            )}

            <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !border-slate-300 !w-3 !h-3" />
        </div>
    );
});
EditableNode.displayName = 'EditableNode';

const nodeTypes: NodeTypes = {
    tactical: EditableNode,
};

// Dagre layout function
function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'TB') {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction, ranksep: 80, nodesep: 50 });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 180, height: 60 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - 90,
                y: nodeWithPosition.y - 30,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
}

const defaultNodes: Node[] = [
    { id: 'demo-1', type: 'tactical', position: { x: 250, y: 50 }, data: { label: '📹 Entrada', style: 'default' } },
    { id: 'demo-2', type: 'tactical', position: { x: 250, y: 180 }, data: { label: '🧠 Análise', style: 'default' } },
    { id: 'demo-3', type: 'tactical', position: { x: 250, y: 310 }, data: { label: '⚡ Ação', style: 'success' } },
];

const defaultEdges: Edge[] = [
    { id: 'e1-2', source: 'demo-1', target: 'demo-2', animated: true, style: { stroke: '#6366f1' } },
    { id: 'e2-3', source: 'demo-2', target: 'demo-3', animated: true, style: { stroke: '#6366f1' } },
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
        hasExternalData ? externalNodes : defaultNodes
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState(
        hasExternalData && externalEdges ? externalEdges : defaultEdges
    );

    const isExternalUpdateRef = useRef(false);
    const prevExternalSigRef = useRef<string>('');
    const nodeIdCounter = useRef(100);

    // Emit changes to parent (triggers markdown update)
    const emitChange = useCallback((newNodes: Node[], newEdges: Edge[]) => {
        if (!isExternalUpdateRef.current && onGraphChange) {
            onGraphChange(newNodes, newEdges);
        }
    }, [onGraphChange]);

    // Handle label change from double-click edit - FIXED to trigger sync
    const handleLabelChange = useCallback((nodeId: string, newLabel: string) => {
        setNodes((nds) => {
            const updated = nds.map((n) =>
                n.id === nodeId ? { ...n, data: { ...n.data, label: newLabel } } : n
            );
            // Emit immediately for label changes
            if (onGraphChange) {
                onGraphChange(updated, edges);
            }
            return updated;
        });
    }, [setNodes, edges, onGraphChange]);

    // Handle style change
    const handleStyleChange = useCallback((nodeId: string, style: NodeStyle) => {
        setNodes((nds) => {
            const updated = nds.map((n) =>
                n.id === nodeId ? { ...n, data: { ...n.data, style } } : n
            );
            if (onGraphChange) {
                onGraphChange(updated, edges);
            }
            return updated;
        });
    }, [setNodes, edges, onGraphChange]);

    // Inject handlers into node data
    const nodesWithHandlers = nodes.map((node) => ({
        ...node,
        data: {
            ...node.data,
            onLabelChange: handleLabelChange,
            onStyleChange: handleStyleChange,
        },
    }));

    // Sync external data (Text → Graph)
    useEffect(() => {
        if (externalNodes && externalNodes.length > 0) {
            const sig = JSON.stringify(externalNodes.map(n => ({ id: n.id, label: n.data?.label, style: n.data?.style })));
            if (sig !== prevExternalSigRef.current) {
                prevExternalSigRef.current = sig;
                isExternalUpdateRef.current = true;
                setNodes(externalNodes);
                setEdges(externalEdges || []);
                requestAnimationFrame(() => {
                    isExternalUpdateRef.current = false;
                });
            }
        }
    }, [externalNodes, externalEdges, setNodes, setEdges]);

    // Add new node
    const handleAddNode = useCallback(() => {
        const viewport = reactFlowInstance.getViewport();
        const centerX = (-viewport.x + 400) / viewport.zoom;
        const centerY = (-viewport.y + 200) / viewport.zoom;

        const newId = `node-${++nodeIdCounter.current}`;
        const newNode: Node = {
            id: newId,
            type: 'tactical',
            position: { x: centerX, y: centerY },
            data: { label: 'Novo Passo', style: 'default' },
        };

        setNodes((nds) => {
            const updated = [...nds, newNode];
            emitChange(updated, edges);
            return updated;
        });
    }, [reactFlowInstance, setNodes, edges, emitChange]);

    // Auto-layout with Dagre
    const handleAutoLayout = useCallback(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, 'TB');
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        emitChange(layoutedNodes, layoutedEdges);

        // Fit view after layout
        requestAnimationFrame(() => {
            reactFlowInstance.fitView({ padding: 0.3 });
        });
    }, [nodes, edges, setNodes, setEdges, emitChange, reactFlowInstance]);

    // Handle node changes (drag, select, etc)
    const handleNodesChange = useCallback((changes: NodeChange<Node>[]) => {
        onNodesChange(changes);

        if (!isExternalUpdateRef.current) {
            const hasPositionChange = changes.some(c => c.type === 'position' && c.dragging === false);
            if (hasPositionChange) {
                setNodes((currentNodes) => {
                    emitChange(currentNodes, edges);
                    return currentNodes;
                });
            }
        }
    }, [onNodesChange, edges, emitChange, setNodes]);

    // Handle edge changes
    const handleEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => {
        onEdgesChange(changes);

        if (!isExternalUpdateRef.current) {
            setEdges((currentEdges) => {
                emitChange(nodes, currentEdges);
                return currentEdges;
            });
        }
    }, [onEdgesChange, nodes, emitChange, setEdges]);

    // Connect nodes
    const onConnect = useCallback((params: Connection) => {
        setEdges((eds) => {
            const newEdges = addEdge({ ...params, animated: true, style: { stroke: '#6366f1' } }, eds);
            emitChange(nodes, newEdges);
            return newEdges;
        });
    }, [setEdges, nodes, emitChange]);

    // Delete selected
    const handleDelete = useCallback(() => {
        const selectedNodes = nodes.filter(n => n.selected);
        const selectedEdges = edges.filter(e => e.selected);

        if (selectedNodes.length > 0 || selectedEdges.length > 0) {
            const selectedNodeIds = new Set(selectedNodes.map(n => n.id));
            const newNodes = nodes.filter(n => !n.selected);
            const newEdges = edges.filter(e => !e.selected && !selectedNodeIds.has(e.source) && !selectedNodeIds.has(e.target));

            setNodes(newNodes);
            setEdges(newEdges);
            emitChange(newNodes, newEdges);
        }
    }, [nodes, edges, setNodes, setEdges, emitChange]);

    // Keyboard handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT') return;
            if (e.key === 'Delete' || e.key === 'Backspace') {
                handleDelete();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleDelete]);

    return (
        <div className="w-full h-full bg-slate-950 relative">
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

            <ReactFlow
                nodes={nodesWithHandlers}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                className="bg-slate-950"
                proOptions={{ hideAttribution: true }}
                deleteKeyCode={null}
            >
                <Background color="#334155" gap={20} size={1} />
                <Controls className="!bg-slate-900 !border-slate-700 !rounded-lg !shadow-xl [&>button]:!bg-slate-800 [&>button]:!border-slate-600 [&>button]:!text-slate-300 [&>button:hover]:!bg-slate-700" />
                <MiniMap nodeColor={(node) => {
                    const style = node.data?.style as NodeStyle || 'default';
                    return { default: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444' }[style];
                }} maskColor="rgba(0, 0, 0, 0.8)" className="!bg-slate-900 !border-slate-700 !rounded-lg" />

                <Panel position="top-right" className="flex gap-2">
                    <button
                        onClick={handleAutoLayout}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-lg shadow-lg transition-colors"
                    >
                        <Sparkles size={14} />
                        Organizar
                    </button>
                    <button
                        onClick={handleAddNode}
                        className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg shadow-lg transition-colors"
                    >
                        <Plus size={14} />
                        Adicionar
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600/80 hover:bg-red-500 text-white text-xs font-medium rounded-lg shadow-lg transition-colors"
                    >
                        <Trash2 size={14} />
                        Excluir
                    </button>
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
