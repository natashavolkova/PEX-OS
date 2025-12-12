'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function TacticalNode({ data }: { data: { label: string; type?: 'input' | 'process' | 'output' } }) {
    const bgColor = {
        input: 'bg-emerald-950 border-emerald-700',
        process: 'bg-indigo-950 border-indigo-700',
        output: 'bg-amber-950 border-amber-700',
    }[data.type || 'process'];

    return (
        <div className={`px-4 py-3 rounded-lg border ${bgColor} shadow-xl min-w-[160px]`}>
            <Handle type="target" position={Position.Top} className="!bg-slate-500 !border-slate-400" />
            <div className="text-sm font-medium text-slate-200 text-center">{data.label}</div>
            <Handle type="source" position={Position.Bottom} className="!bg-slate-500 !border-slate-400" />
        </div>
    );
}

const nodeTypes: NodeTypes = {
    tactical: TacticalNode,
};

const defaultNodes: Node[] = [
    { id: 'demo-1', type: 'tactical', position: { x: 250, y: 50 }, data: { label: '📹 Entrada (Vídeo)', type: 'input' } },
    { id: 'demo-2', type: 'tactical', position: { x: 250, y: 180 }, data: { label: '🧠 Fara-7B Analysis', type: 'process' } },
    { id: 'demo-3', type: 'tactical', position: { x: 250, y: 310 }, data: { label: '⚡ Ação Tática', type: 'output' } },
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

export default function StrategicMap({
    externalNodes,
    externalEdges,
    isSyncing = false,
    syncError = null,
    onGraphChange,
}: StrategicMapProps) {
    const hasExternalData = externalNodes && externalNodes.length > 0;

    const [nodes, setNodes, onNodesChange] = useNodesState(
        hasExternalData ? externalNodes : defaultNodes
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState(
        hasExternalData && externalEdges ? externalEdges : defaultEdges
    );

    const isExternalUpdateRef = useRef(false);
    const prevExternalSigRef = useRef<string>('');

    // Sync external data when it changes (Text → Graph)
    useEffect(() => {
        if (externalNodes && externalNodes.length > 0) {
            const sig = JSON.stringify({ n: externalNodes.map(n => n.id), e: externalEdges?.map(e => e.id) });
            if (sig !== prevExternalSigRef.current) {
                prevExternalSigRef.current = sig;
                isExternalUpdateRef.current = true;
                setNodes(externalNodes);
                setEdges(externalEdges || []);
                // Reset flag after update
                requestAnimationFrame(() => {
                    isExternalUpdateRef.current = false;
                });
            }
        }
    }, [externalNodes, externalEdges, setNodes, setEdges]);

    // Handle node changes (drag, etc) - emit for reverse sync
    const handleNodesChange = useCallback(
        (changes: NodeChange<Node>[]) => {
            onNodesChange(changes);

            // Only emit if this is a user action (not external update)
            if (!isExternalUpdateRef.current && onGraphChange) {
                // Get updated nodes after changes applied
                setNodes((currentNodes) => {
                    // Emit change after state update
                    requestAnimationFrame(() => {
                        onGraphChange(currentNodes, edges);
                    });
                    return currentNodes;
                });
            }
        },
        [onNodesChange, onGraphChange, edges, setNodes]
    );

    // Handle edge changes
    const handleEdgesChange = useCallback(
        (changes: EdgeChange<Edge>[]) => {
            onEdgesChange(changes);

            if (!isExternalUpdateRef.current && onGraphChange) {
                setEdges((currentEdges) => {
                    requestAnimationFrame(() => {
                        onGraphChange(nodes, currentEdges);
                    });
                    return currentEdges;
                });
            }
        },
        [onEdgesChange, onGraphChange, nodes, setEdges]
    );

    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) => {
                const newEdges = addEdge({ ...params, animated: true, style: { stroke: '#6366f1' } }, eds);
                if (onGraphChange) {
                    requestAnimationFrame(() => {
                        onGraphChange(nodes, newEdges);
                    });
                }
                return newEdges;
            });
        },
        [setEdges, onGraphChange, nodes]
    );

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
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                className="bg-slate-950"
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#334155" gap={20} size={1} />
                <Controls className="!bg-slate-900 !border-slate-700 !rounded-lg !shadow-xl [&>button]:!bg-slate-800 [&>button]:!border-slate-600 [&>button]:!text-slate-300 [&>button:hover]:!bg-slate-700" />
                <MiniMap nodeColor={() => '#6366f1'} maskColor="rgba(0, 0, 0, 0.8)" className="!bg-slate-900 !border-slate-700 !rounded-lg" />
            </ReactFlow>
        </div>
    );
}
