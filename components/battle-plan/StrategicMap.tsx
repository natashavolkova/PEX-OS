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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, Trash2 } from 'lucide-react';

// Editable Node Component
const EditableNode = memo(({ id, data, selected }: {
    id: string;
    data: { label: string; type?: 'input' | 'process' | 'output'; onLabelChange?: (id: string, label: string) => void };
    selected?: boolean;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(data.label);
    const inputRef = useRef<HTMLInputElement>(null);

    const bgColor = {
        input: 'bg-emerald-950 border-emerald-700',
        process: 'bg-indigo-950 border-indigo-700',
        output: 'bg-amber-950 border-amber-700',
    }[data.type || 'process'];

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleDoubleClick = () => {
        setEditValue(data.label);
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        if (editValue.trim() && editValue !== data.label && data.onLabelChange) {
            data.onLabelChange(id, editValue.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditValue(data.label);
        }
    };

    return (
        <div
            className={`px-4 py-3 rounded-lg border ${bgColor} shadow-xl min-w-[160px] ${selected ? 'ring-2 ring-indigo-400' : ''}`}
            onDoubleClick={handleDoubleClick}
        >
            <Handle type="target" position={Position.Top} className="!bg-slate-500 !border-slate-400" />
            {isEditing ? (
                <input
                    ref={inputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-slate-800 text-slate-200 text-sm font-medium text-center px-2 py-1 rounded border border-slate-600 outline-none focus:border-indigo-500"
                />
            ) : (
                <div className="text-sm font-medium text-slate-200 text-center cursor-text">
                    {data.label}
                </div>
            )}
            <Handle type="source" position={Position.Bottom} className="!bg-slate-500 !border-slate-400" />
        </div>
    );
});
EditableNode.displayName = 'EditableNode';

const nodeTypes: NodeTypes = {
    tactical: EditableNode,
};

const defaultNodes: Node[] = [
    { id: 'demo-1', type: 'tactical', position: { x: 250, y: 50 }, data: { label: '📹 Entrada', type: 'input' } },
    { id: 'demo-2', type: 'tactical', position: { x: 250, y: 180 }, data: { label: '🧠 Análise', type: 'process' } },
    { id: 'demo-3', type: 'tactical', position: { x: 250, y: 310 }, data: { label: '⚡ Ação', type: 'output' } },
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

    // Emit changes to parent
    const emitChange = useCallback((newNodes: Node[], newEdges: Edge[]) => {
        if (!isExternalUpdateRef.current && onGraphChange) {
            requestAnimationFrame(() => {
                onGraphChange(newNodes, newEdges);
            });
        }
    }, [onGraphChange]);

    // Handle label change from double-click edit
    const handleLabelChange = useCallback((nodeId: string, newLabel: string) => {
        setNodes((nds) => {
            const updated = nds.map((n) =>
                n.id === nodeId ? { ...n, data: { ...n.data, label: newLabel } } : n
            );
            emitChange(updated, edges);
            return updated;
        });
    }, [setNodes, edges, emitChange]);

    // Inject onLabelChange into node data
    const nodesWithHandlers = nodes.map((node) => ({
        ...node,
        data: { ...node.data, onLabelChange: handleLabelChange },
    }));

    // Sync external data (Text → Graph)
    useEffect(() => {
        if (externalNodes && externalNodes.length > 0) {
            const sig = JSON.stringify({ n: externalNodes.map(n => n.id + n.data?.label), e: externalEdges?.map(e => e.id) });
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
            data: { label: 'Novo Passo', type: 'process' },
        };

        setNodes((nds) => {
            const updated = [...nds, newNode];
            emitChange(updated, edges);
            return updated;
        });
    }, [reactFlowInstance, setNodes, edges, emitChange]);

    // Handle node changes (drag, select, etc)
    const handleNodesChange = useCallback((changes: NodeChange<Node>[]) => {
        onNodesChange(changes);

        if (!isExternalUpdateRef.current) {
            // Check if this is a position change (drag)
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

    // Delete selected nodes/edges
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

    // Keyboard handler for delete
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                // Don't delete if we're in an input
                if ((e.target as HTMLElement).tagName === 'INPUT') return;
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
                <MiniMap nodeColor={() => '#6366f1'} maskColor="rgba(0, 0, 0, 0.8)" className="!bg-slate-900 !border-slate-700 !rounded-lg" />

                {/* Top Right Panel - Add Node */}
                <Panel position="top-right" className="flex gap-2">
                    <button
                        onClick={handleAddNode}
                        className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg shadow-lg transition-colors"
                    >
                        <Plus size={14} />
                        Adicionar Passo
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

// Wrapper to ensure ReactFlowProvider context
import { ReactFlowProvider } from '@xyflow/react';

export default function StrategicMap(props: StrategicMapProps) {
    return (
        <ReactFlowProvider>
            <StrategicMapInner {...props} />
        </ReactFlowProvider>
    );
}
