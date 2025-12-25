/**
 * EDGE ROUTING DIAGNOSTIC SCRIPT
 * 
 * Cole este código no Console do DevTools (F12) para capturar dados reais
 * sobre o comportamento do sistema de routing de edges.
 * 
 * INSTRUÇÕES:
 * 1. Abra o diagrama no browser
 * 2. Abra DevTools (F12) > Console
 * 3. Cole este código e pressione Enter
 * 4. Interaja com o diagrama (mova cards, crie edges)
 * 5. Execute window.EDGE_DIAG.report() para ver os dados
 */

(function () {
    'use strict';

    const DIAG = {
        captures: [],
        edgeRenderLogs: [],
        nodePositions: {},
        startTime: Date.now(),
    };

    // =========================================================================
    // PATCH: Intercept CustomSmartEdge rendering
    // =========================================================================

    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = function (...args) {
        const msg = args[0];
        if (typeof msg === 'string') {
            // Capture EDGE logs
            if (msg.includes('[EDGE]') || msg.includes('[ROUTING]') ||
                msg.includes('[COLLISION]') || msg.includes('[STRAIGHT]')) {
                DIAG.edgeRenderLogs.push({
                    time: Date.now() - DIAG.startTime,
                    level: 'log',
                    message: args.join(' '),
                });
            }
        }
        originalLog.apply(console, args);
    };

    console.warn = function (...args) {
        DIAG.edgeRenderLogs.push({
            time: Date.now() - DIAG.startTime,
            level: 'warn',
            message: args.join(' '),
        });
        originalWarn.apply(console, args);
    };

    console.error = function (...args) {
        DIAG.edgeRenderLogs.push({
            time: Date.now() - DIAG.startTime,
            level: 'error',
            message: args.join(' '),
        });
        originalError.apply(console, args);
    };

    // =========================================================================
    // CAPTURE: React Flow state
    // =========================================================================

    function captureReactFlowState() {
        // Try to find React Flow internal state
        const reactFlowWrapper = document.querySelector('.react-flow');
        if (!reactFlowWrapper) {
            return { error: 'ReactFlow wrapper not found' };
        }

        // Get all edge paths
        const edgePaths = document.querySelectorAll('.react-flow__edge-path');
        const edgeData = [];

        edgePaths.forEach((path, i) => {
            const parent = path.closest('.react-flow__edge');
            edgeData.push({
                index: i,
                id: parent?.getAttribute('data-id') || parent?.id || `unknown-${i}`,
                d: path.getAttribute('d'),
                stroke: path.style.stroke || getComputedStyle(path).stroke,
                strokeWidth: path.style.strokeWidth || getComputedStyle(path).strokeWidth,
                computedLength: path.getTotalLength?.() || 'N/A',
            });
        });

        // Get all nodes
        const nodeElements = document.querySelectorAll('.react-flow__node');
        const nodeData = [];

        nodeElements.forEach((node) => {
            const id = node.getAttribute('data-id');
            const transform = node.style.transform;
            const rect = node.getBoundingClientRect();

            // Parse transform: translate(Xpx, Ypx)
            const match = transform.match(/translate\(([\d.-]+)px,\s*([\d.-]+)px\)/);

            nodeData.push({
                id,
                transformX: match ? parseFloat(match[1]) : null,
                transformY: match ? parseFloat(match[2]) : null,
                boundingRect: {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height,
                },
                zIndex: getComputedStyle(node).zIndex,
            });
        });

        return {
            timestamp: Date.now(),
            edges: edgeData,
            nodes: nodeData,
        };
    }

    // =========================================================================
    // CAPTURE: Edge coordinates from SVG
    // =========================================================================

    function parsePathD(d) {
        if (!d) return [];

        const points = [];
        const commands = d.match(/[MLQCZmlqcz][^MLQCZmlqcz]*/g) || [];

        for (const cmd of commands) {
            const type = cmd[0];
            const coords = cmd.slice(1).trim().split(/[\s,]+/).map(parseFloat);

            if (type === 'M' || type === 'L') {
                points.push({ x: coords[0], y: coords[1], type });
            } else if (type === 'Q') {
                // Quadratic: control point + end point
                points.push({ x: coords[2], y: coords[3], type: 'Q-end' });
            }
        }

        return points;
    }

    function analyzeCollisions(capture) {
        const results = [];

        for (const edge of capture.edges) {
            const pathPoints = parsePathD(edge.d);
            const edgeId = edge.id;

            // Check if any segment passes through any node
            for (let i = 0; i < pathPoints.length - 1; i++) {
                const p1 = pathPoints[i];
                const p2 = pathPoints[i + 1];

                for (const node of capture.nodes) {
                    // Skip source and target (we'd need edge data to know which)
                    const box = node.boundingRect;

                    // Simple check: does segment cross the bounding rect?
                    const crosses = lineIntersectsRect(
                        p1.x, p1.y, p2.x, p2.y,
                        box.x, box.y, box.width, box.height
                    );

                    if (crosses) {
                        results.push({
                            edgeId,
                            segmentIndex: i,
                            segment: { p1, p2 },
                            collidingNode: node.id,
                            nodeBox: box,
                        });
                    }
                }
            }
        }

        return results;
    }

    function lineIntersectsRect(x1, y1, x2, y2, rx, ry, rw, rh) {
        // Simple AABB check for line segment
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);

        // Quick rejection
        if (maxX < rx || minX > rx + rw) return false;
        if (maxY < ry || minY > ry + rh) return false;

        // More detailed check would go here
        // For now, if bounding boxes overlap, flag as potential collision
        return true;
    }

    // =========================================================================
    // PUBLIC API
    // =========================================================================

    window.EDGE_DIAG = {
        // Capture current state
        capture: function () {
            const state = captureReactFlowState();
            DIAG.captures.push(state);
            console.log('[DIAG] State captured:', state);
            return state;
        },

        // Analyze all captures for collisions
        analyze: function () {
            const lastCapture = DIAG.captures[DIAG.captures.length - 1];
            if (!lastCapture) {
                console.log('[DIAG] No captures yet. Run EDGE_DIAG.capture() first.');
                return;
            }

            const collisions = analyzeCollisions(lastCapture);
            console.log('[DIAG] Collision analysis:', collisions);
            return collisions;
        },

        // Get all logs
        logs: function () {
            console.table(DIAG.edgeRenderLogs);
            return DIAG.edgeRenderLogs;
        },

        // Full report
        report: function () {
            console.group('=== EDGE ROUTING DIAGNOSTIC REPORT ===');

            console.log('\n📊 CAPTURES:', DIAG.captures.length);

            const lastCapture = this.capture();

            console.log('\n🔗 EDGES:');
            console.table(lastCapture.edges);

            console.log('\n📦 NODES:');
            console.table(lastCapture.nodes);

            console.log('\n💥 POTENTIAL COLLISIONS:');
            const collisions = this.analyze();
            if (collisions.length === 0) {
                console.log('   No visual collisions detected');
            } else {
                console.table(collisions);
            }

            console.log('\n📝 RENDER LOGS (last 20):');
            console.table(DIAG.edgeRenderLogs.slice(-20));

            console.groupEnd();

            return {
                capture: lastCapture,
                collisions,
                logs: DIAG.edgeRenderLogs,
            };
        },

        // Clear data
        clear: function () {
            DIAG.captures = [];
            DIAG.edgeRenderLogs = [];
            console.log('[DIAG] Data cleared');
        },

        // Verify EdgeProps received by CustomSmartEdge
        // This requires modifying the component, so we log instructions
        verifyEdgeProps: function () {
            console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  PARA VERIFICAR EdgeProps, adicione este código temporário no    ║
║  CustomSmartEdge.tsx, LOGO APÓS a linha "function CustomSmartEdge":     ║
╠══════════════════════════════════════════════════════════════════╣

    function CustomSmartEdge(props: EdgeProps) {
        // DEBUG: Log all props received from React Flow
        console.log('[EDGE_PROPS]', props.id, {
            sourceX: props.sourceX,
            sourceY: props.sourceY,
            targetX: props.targetX,
            targetY: props.targetY,
            sourcePosition: props.sourcePosition,
            targetPosition: props.targetPosition,
            sourceHandleId: props.sourceHandleId,
            targetHandleId: props.targetHandleId,
            data: props.data,
        });
        
        const { id, source, target, style, markerEnd, markerStart } = props;
        // ... rest of component

╚══════════════════════════════════════════════════════════════════╝
            `);
        },

        // Check if handles are source-only
        checkHandles: function () {
            const handles = document.querySelectorAll('.react-flow__handle');
            const results = { source: 0, target: 0, both: 0 };

            handles.forEach(h => {
                if (h.classList.contains('source') && h.classList.contains('target')) {
                    results.both++;
                } else if (h.classList.contains('source')) {
                    results.source++;
                } else if (h.classList.contains('target')) {
                    results.target++;
                }
            });

            console.log('[DIAG] Handle types:', results);

            if (results.target === 0 && results.both === 0) {
                console.warn('[DIAG] ⚠️ NO TARGET HANDLES FOUND! This may cause React Flow to not calculate edge target coordinates correctly.');
            }

            return results;
        },
    };

    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║           EDGE ROUTING DIAGNOSTICS LOADED                       ║
╠══════════════════════════════════════════════════════════════════╣
║  Commands:                                                       ║
║    EDGE_DIAG.report()        - Full diagnostic report            ║
║    EDGE_DIAG.capture()       - Capture current state             ║
║    EDGE_DIAG.analyze()       - Find visual collisions            ║
║    EDGE_DIAG.logs()          - Show render logs                  ║
║    EDGE_DIAG.checkHandles()  - Verify handle types               ║
║    EDGE_DIAG.verifyEdgeProps() - Instructions for EdgeProps test ║
║    EDGE_DIAG.clear()         - Clear captured data               ║
╚══════════════════════════════════════════════════════════════════╝
    `);

    // Auto-check handles on load
    setTimeout(() => {
        EDGE_DIAG.checkHandles();
    }, 2000);

})();
