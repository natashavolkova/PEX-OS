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
      activeView: 'sequential',
      slideDirection: 'none',
      toast: null,
      isLocked: false,
      selectedFolder: null,
      data: [],
      actions: {
        setSearchQuery: jest.fn(),
        setIsLocked: jest.fn(),
        showToast: jest.fn(),
        setActiveView: jest.fn(),
      },
    }
    return selector(state)
  }),
}))

// Mock the child components to simplify testing
jest.mock('@/components/prompt-manager/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}))

jest.mock('@/components/prompt-manager/ActionsToolbar', () => ({
  ActionsToolbar: () => <div data-testid="actions-toolbar">ActionsToolbar</div>,
  FloatingActionButton: () => <div data-testid="fab">FAB</div>,
}))

jest.mock('@/components/prompt-manager/SequentialView', () => ({
  SequentialView: () => <div data-testid="sequential-view">SequentialView</div>,
}))

jest.mock('@/components/prompt-manager/MillerColumns', () => ({
  MillerColumns: () => <div data-testid="miller-columns">MillerColumns</div>,
}))

jest.mock('@/components/prompt-manager/views/HierarchyView', () => ({
  HierarchyView: () => <div data-testid="hierarchy-view">HierarchyView</div>,
}))

jest.mock('@/components/prompt-manager/SharedView', () => ({
  SharedView: () => <div data-testid="shared-view">SharedView</div>,
}))

jest.mock('@/components/prompt-manager/TagBar', () => ({
  TagBar: () => <div data-testid="tag-bar">TagBar</div>,
}))

jest.mock('@/components/prompt-manager/Toast', () => ({
  Toast: () => <div data-testid="toast">Toast</div>,
}))

jest.mock('@/components/prompt-manager/modals/ModalEdit', () => ({
  ModalEdit: () => <div data-testid="modal-edit">ModalEdit</div>,
}))

jest.mock('@/components/prompt-manager/modals/PromptViewer', () => ({
  PromptViewer: () => <div data-testid="prompt-viewer">PromptViewer</div>,
}))

jest.mock('@/components/prompt-manager/modals/SettingsModal', () => ({
  SettingsModal: () => <div data-testid="settings-modal">SettingsModal</div>,
}))

jest.mock('@/components/prompt-manager/modals/NotificationsModal', () => ({
  NotificationsModal: () => <div data-testid="notifications-modal">NotificationsModal</div>,
}))

jest.mock('@/components/prompt-manager/modals/MasterKeyModal', () => ({
  MasterKeyModal: () => <div data-testid="master-key-modal">MasterKeyModal</div>,
}))

jest.mock('@/components/prompt-manager/modals/MoveSelectorModal', () => ({
  MoveSelectorModal: () => <div data-testid="move-selector-modal">MoveSelectorModal</div>,
}))

jest.mock('@/components/prompt-manager/modals/CreateModal', () => ({
  CreateModal: () => <div data-testid="create-modal">CreateModal</div>,
  useCreateModal: () => ({
    isOpen: false,
    type: 'folder',
    parentId: null,
    openCreateModal: jest.fn(),
    closeCreateModal: jest.fn(),
  }),
}))

jest.mock('@/components/prompt-manager/modals/DeleteModal', () => ({
  DeleteModal: () => <div data-testid="delete-modal">DeleteModal</div>,
  useDeleteModal: () => ({
    isOpen: false,
    item: null,
    openDeleteModal: jest.fn(),
    closeDeleteModal: jest.fn(),
  }),
}))

// Mock CSS import
jest.mock('@/styles/animations.css', () => ({}))

// Import after mocks
import { PromptManager } from '@/components/prompt-manager/PromptManager'

describe('PromptManager - Smoke Tests', () => {
  it('renders without crashing', () => {
    render(<PromptManager />)
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('renders the header component', () => {
    render(<PromptManager />)
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('renders the actions toolbar', () => {
    render(<PromptManager />)
    expect(screen.getByTestId('actions-toolbar')).toBeInTheDocument()
  })

  it('renders the floating action button', () => {
    render(<PromptManager />)
    expect(screen.getByTestId('fab')).toBeInTheDocument()
  })

  it('renders the sequential view by default', () => {
    render(<PromptManager />)
    expect(screen.getByTestId('sequential-view')).toBeInTheDocument()
  })

  it('has correct ATHENA theme background color class', () => {
    const { container } = render(<PromptManager />)
    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv.classList.contains('bg-[#0f111a]')).toBe(true)
  })
})
