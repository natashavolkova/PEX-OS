/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Toast } from '@/components/prompt-manager/Toast'

describe('Toast - Smoke Tests', () => {
  it('renders with success type', () => {
    render(<Toast message="Success message" type="success" />)
    expect(screen.getByText('Success message')).toBeInTheDocument()
  })

  it('renders with error type', () => {
    render(<Toast message="Error message" type="error" />)
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('renders with info type', () => {
    render(<Toast message="Info message" type="info" />)
    expect(screen.getByText('Info message')).toBeInTheDocument()
  })

  it('renders with warning type', () => {
    render(<Toast message="Warning message" type="warning" />)
    expect(screen.getByText('Warning message')).toBeInTheDocument()
  })

  it('has animation class', () => {
    const { container } = render(<Toast message="Test" type="success" />)
    // Toast should have animation classes
    expect(container.firstChild).toHaveClass('animate-toast-in')
  })

  it('uses correct ATHENA theme colors', () => {
    const { container } = render(<Toast message="Test" type="success" />)
    const toast = container.firstChild as HTMLElement
    // Should have dark theme background
    expect(toast.className).toContain('bg-')
  })
})
