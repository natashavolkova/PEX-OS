'use client';

import { useCallback, useMemo } from 'react';
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
    Handle,
    Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom Node Component
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

// Initial mock data
const initialNodes: Node[] = [
    {
        id: 'node-1',
        type: 'tactical',
        position: { x: 250, y: 50 },
        data: { label: '📹 Entrada (Vídeo)', type: 'input' },
    },
    {
        id: 'node-2',
        type: 'tactical',
        position: { x: 250, y: 180 },
        data: { label: '🧠 Fara-7B Analysis', type: 'process' },
    },
    {
        id: 'node-3',
        type: 'tactical',
        position: { x: 250, y: 310 },
        data: { label: '⚡ Ação Tática', type: 'output' },
    },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true, style: { stroke: '#6366f1' } },
    { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true, style: { stroke: '#6366f1' } },
];

interface StrategicMapProps {
    diagramData?: string;
    onChange?: (data: string) => void;
}

export default function StrategicMap({ diagramData, onChange }: StrategicMapProps) {
    // Parse initial state from props or use defaults
    const parsedData = useMemo(() => {
        if (diagramData && diagramData !== '{}') {
            try {
                const parsed = JSON.parse(diagramData);
                if (parsed.nodes && parsed.edges) {
                    return { nodes: parsed.nodes, edges: parsed.edges };
                }
            } catch (e) {
                console.warn('[StrategicMap] Failed to parse data:', e);
            }
        }
        return { nodes: initialNodes, edges: initialEdges };
    }, [diagramData]);

    const [nodes, setNodes, onNodesChange] = useNodesState(parsedData.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(parsedData.edges);

    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#6366f1' } }, eds));
        },
        [setEdges]
    );

    // Persist state on changes
    const handleChange = useCallback(() => {
        if (onChange) {
            const data = JSON.stringify({ nodes, edges, timestamp: Date.now() });
            onChange(data);
        }
    }, [nodes, edges, onChange]);

    return (
        <div className="w-full h-full bg-slate-950">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={(changes) => {
                    onNodesChange(changes);
                    handleChange();
                }}
                onEdgesChange={(changes) => {
                    onEdgesChange(changes);
                    handleChange();
                }}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                className="bg-slate-950"
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#334155" gap={20} size={1} />
                <Controls
                    className="!bg-slate-900 !border-slate-700 !rounded-lg !shadow-xl [&>button]:!bg-slate-800 [&>button]:!border-slate-600 [&>button]:!text-slate-300 [&>button:hover]:!bg-slate-700"
                />
                <MiniMap
                    nodeColor={() => '#6366f1'}
                    maskColor="rgba(0, 0, 0, 0.8)"
                    className="!bg-slate-900 !border-slate-700 !rounded-lg"
                />
            </ReactFlow>
        </div>
    );
}
