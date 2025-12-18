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
      selectedFolder: null,
      selectedSubfolder: null,
      isLocked: false,
      dragState: { draggedItemId: null, draggedItemType: null },
      justDroppedId: null,
      actions: {
        setSelectedFolder: jest.fn(),
        setSelectedSubfolder: jest.fn(),
        setSelectedPrompt: jest.fn(),
        setPromptViewerOpen: jest.fn(),
        setDragState: jest.fn(),
        openEditModal: jest.fn(),
        showToast: jest.fn(),
        moveItem: jest.fn(),
        getValidMoveTargets: jest.fn(() => []),
        setMoveSelector: jest.fn(),
        findItem: jest.fn(),
        isDescendant: jest.fn(() => false),
      },
    }
    return selector(state)
  }),
}))

// Mock child components
jest.mock('@/components/prompt-manager/ContextMenu', () => ({
  ContextMenu: () => null,
  useContextMenu: () => ({
    contextMenu: null,
    openContextMenu: jest.fn(),
    closeContextMenu: jest.fn(),
  }),
}))

jest.mock('@/components/prompt-manager/miller/ColumnWrapper', () => ({
  ColumnWrapper: ({ title }: { title: string }) => (
    <div data-testid={`column-${title.toLowerCase()}`}>{title}</div>
  ),
}))

jest.mock('@/components/prompt-manager/miller/ColumnPreview', () => ({
  ColumnPreview: () => <div data-testid="column-preview">Preview</div>,
}))

// Import after mocks
import { MillerColumns } from '@/components/prompt-manager/MillerColumns'

describe('MillerColumns - Smoke Tests', () => {
  it('renders without crashing', () => {
    render(<MillerColumns />)
    // Should render all 4 columns
    expect(screen.getByTestId('column-pastas')).toBeInTheDocument()
  })

  it('renders all four columns', () => {
    render(<MillerColumns />)
    expect(screen.getByTestId('column-pastas')).toBeInTheDocument()
    expect(screen.getByTestId('column-subpastas')).toBeInTheDocument()
    expect(screen.getByTestId('column-prompts')).toBeInTheDocument()
    expect(screen.getByTestId('column-preview')).toBeInTheDocument()
  })

  it('has flex layout for horizontal columns', () => {
    const { container } = render(<MillerColumns />)
    const mainDiv = container.querySelector('.flex')
    expect(mainDiv).toBeInTheDocument()
  })
})
