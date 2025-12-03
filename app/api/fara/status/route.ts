// ============================================================================
// PEX-OS API - FARA AGENT STATUS ROUTE
// ATHENA Architecture | Mock Implementation
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import type { AgentStatus, AgentTask } from '@/types';

// Mock agent state
let mockAgentStatus: AgentStatus = {
  connected: false,
  agentName: 'Fara-7B',
  agentVersion: '1.0.0',
  capabilities: [
    'file_generation',
    'code_refactor',
    'macro_execution',
    'prompt_analysis',
    'automation',
  ],
  lastPing: 0,
  queuedTasks: 0,
};

let mockTaskQueue: AgentTask[] = [];

// GET /api/fara/status - Get agent status
export async function GET(request: NextRequest) {
  console.log('[API] GET /api/fara/status');

  // TODO: Replace with real WebSocket connection check
  // This mock simulates agent status

  // Simulate connection state (randomly connected/disconnected for demo)
  const isConnected = mockAgentStatus.connected || Math.random() > 0.3;

  const status: AgentStatus = {
    ...mockAgentStatus,
    connected: isConnected,
    lastPing: isConnected ? Date.now() : mockAgentStatus.lastPing,
    queuedTasks: mockTaskQueue.filter(t => t.status === 'queued' || t.status === 'processing').length,
  };

  return NextResponse.json({
    success: true,
    data: {
      status,
      health: isConnected ? 'healthy' : 'disconnected',
      uptime: isConnected ? Math.floor(Math.random() * 86400) : 0,
      stats: {
        tasksProcessed: Math.floor(Math.random() * 100) + 50,
        avgProcessingTime: 2500,
        successRate: 0.95,
        errorsLast24h: Math.floor(Math.random() * 5),
      },
    },
  });
}

// POST /api/fara/status - Connect/disconnect agent
export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log('[API] POST /api/fara/status', body);

  const { action, endpoint } = body;

  if (!action) {
    return NextResponse.json(
      { success: false, error: 'action is required (connect/disconnect)' },
      { status: 400 }
    );
  }

  // TODO: Replace with real WebSocket connection handling

  if (action === 'connect') {
    const targetEndpoint = endpoint || 'ws://localhost:8765';
    
    // Simulate connection attempt
    const connectionSuccess = Math.random() > 0.2; // 80% success rate for demo

    if (connectionSuccess) {
      mockAgentStatus = {
        ...mockAgentStatus,
        connected: true,
        lastPing: Date.now(),
      };

      return NextResponse.json({
        success: true,
        data: {
          status: mockAgentStatus,
          endpoint: targetEndpoint,
        },
        message: `Connected to agent at ${targetEndpoint}`,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: `Failed to connect to ${targetEndpoint}. Ensure the agent is running.`,
        data: {
          status: mockAgentStatus,
        },
      }, { status: 503 });
    }
  } else if (action === 'disconnect') {
    mockAgentStatus = {
      ...mockAgentStatus,
      connected: false,
    };

    return NextResponse.json({
      success: true,
      data: {
        status: mockAgentStatus,
      },
      message: 'Disconnected from agent',
    });
  } else if (action === 'ping') {
    // Ping test
    if (mockAgentStatus.connected) {
      mockAgentStatus.lastPing = Date.now();
      return NextResponse.json({
        success: true,
        data: {
          pong: true,
          latency: Math.floor(Math.random() * 100) + 10,
          timestamp: Date.now(),
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Agent not connected',
      }, { status: 503 });
    }
  }

  return NextResponse.json(
    { success: false, error: 'Invalid action. Use: connect, disconnect, or ping' },
    { status: 400 }
  );
}

// PATCH /api/fara/status - Update agent settings
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  console.log('[API] PATCH /api/fara/status', body);

  const { settings } = body;

  if (!settings) {
    return NextResponse.json(
      { success: false, error: 'settings object is required' },
      { status: 400 }
    );
  }

  // TODO: Replace with real settings update

  return NextResponse.json({
    success: true,
    data: {
      updated: true,
      settings,
    },
    message: 'Agent settings updated',
  });
}
