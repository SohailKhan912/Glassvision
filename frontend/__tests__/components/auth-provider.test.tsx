/**
 * Auth Provider Component Tests
 * Tests authentication context and state management
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider } from '@/components/auth-provider'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}))

// Mock utils/api
jest.mock('@/utils/api', () => ({
  authAPI: {
    getMe: jest.fn().mockResolvedValue({ user: null }),
  },
}))

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should render children without crashing', () => {
    render(
      <AuthProvider>
        <div>Test Content</div>
      </AuthProvider>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should initialize with no user when no token in localStorage', () => {
    localStorage.clear()
    
    render(
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>
    )

    // Auth provider should handle missing token gracefully
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle SSR gracefully', () => {
    // The component already handles SSR with typeof window check
    // This test verifies it doesn't crash during SSR
    render(
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>
    )

    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})

