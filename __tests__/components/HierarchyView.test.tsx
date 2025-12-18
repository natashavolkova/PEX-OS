/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the store
jest.mock('@/stores/promptManager', () => ({
  usePromptManagerStore: jest.fn((selector) => {
    const state = {
      data: [
        {
          id: 'f1',
          name: 'Test Folder',
          type: 'folder',
          emoji: '📁',
          children: [],
        },
      ],
      selectedPrompt: null,
      isLocked: false,
      actions: {
        setSelectedPrompt: jest.fn(),
        setPromptViewerOpen: jest.fn(),
        openEditModal: jest.fn(),
        showToast: jest.fn(),
      },
    }
    return selector(state)
  }),
}))

// Mock child components
jest.mock('@/components/prompt-manager/TooltipWrapper', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('@/components/prompt-manager/ContextMenu', () => ({
  ContextMenu: () => null,
  useContextMenu: () => ({
    contextMenu: null,
    openContextMenu: jest.fn(),
    closeContextMenu: jest.fn(),
  }),
}))

jest.mock('@/components/prompt-manager/views/hierarchy/SearchBar', () => ({
  SearchBar: () => <div data-testid="search-bar">SearchBar</div>,
}))

jest.mock('@/components/prompt-manager/views/hierarchy/TreeNodeItem', () => ({
  TreeNodeItem: ({ node }: { node: any }) => (
    <div data-testid={`tree-node-${node.id}`}>{node.name}</div>
  ),
}))

// Import after mocks
import { HierarchyView } from '@/components/prompt-manager/views/HierarchyView'

describe('HierarchyView - Smoke Tests', () => {
  it('renders without crashing', () => {
    render(<HierarchyView />)
    expect(screen.getByText('Estrutura Hierárquica')).toBeInTheDocument()
  })

  it('renders the header with correct title', () => {
    render(<HierarchyView />)
    expect(screen.getByText('Estrutura Hierárquica')).toBeInTheDocument()
  })

  it('renders the search bar', () => {
    render(<HierarchyView />)
    expect(screen.getByTestId('search-bar')).toBeInTheDocument()
  })

  it('renders tree nodes for data', () => {
    render(<HierarchyView />)
    expect(screen.getByTestId('tree-node-f1')).toBeInTheDocument()
    expect(screen.getByText('Test Folder')).toBeInTheDocument()
  })

  it('has expand/collapse buttons', () => {
    render(<HierarchyView />)
    // Should have expand/collapse controls
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})
