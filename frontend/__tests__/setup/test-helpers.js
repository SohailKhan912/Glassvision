/**
 * Test Helpers for GlassVision Test Suite
 * Provides utilities for testing authentication, API calls, and components
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'
export const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000'

/**
 * Create a mock user object
 */
export const createMockUser = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439011',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  ...overrides,
})

/**
 * Create a mock admin user
 */
export const createMockAdmin = () => createMockUser({
  email: 'admin@glassvision.com',
  role: 'admin',
})

/**
 * Create a mock JWT token
 */
export const createMockToken = (payload = {}) => {
  const defaultPayload = {
    id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    role: 'user',
    ...payload,
  }
  // In a real scenario, this would be a properly signed JWT
  return `mock.jwt.token.${btoa(JSON.stringify(defaultPayload))}`
}

/**
 * Mock fetch response
 */
export const mockFetch = (data, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    headers: new Headers(),
  })
}

/**
 * Mock fetch error
 */
export const mockFetchError = (message = 'Network error') => {
  return Promise.reject(new Error(message))
}

/**
 * Wait for async operations
 */
export const waitFor = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Create mock product
 */
export const createMockProduct = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439012',
  name: 'Frameless Glass Door',
  description: 'Modern frameless glass door',
  price: 15000,
  image: '/frameless-glass-door-modern.jpg',
  category: 'frameless',
  inStock: true,
  ...overrides,
})

/**
 * Create mock cart item
 */
export const createMockCartItem = (overrides = {}) => ({
  id: 'cart-item-1',
  width: 900,
  height: 2100,
  material: 'tempered-glass',
  frame: 'aluminum',
  finish: 'matte',
  features: [],
  price: 15000,
  quantity: 1,
  modelName: 'Frameless Minimalist',
  ...overrides,
})

/**
 * Create mock order
 */
export const createMockOrder = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439013',
  user: '507f1f77bcf86cd799439011',
  items: [createMockCartItem()],
  total: 15000,
  status: 'pending',
  shippingAddress: {
    name: 'Test User',
    address: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    zip: '12345',
    phone: '1234567890',
  },
  paymentId: 'pay_test123',
  createdAt: new Date().toISOString(),
  ...overrides,
})

/**
 * Setup authenticated state in localStorage
 */
export const setupAuthState = (user = createMockUser(), token = createMockToken()) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

/**
 * Setup admin authenticated state
 */
export const setupAdminAuthState = () => {
  const admin = createMockAdmin()
  const token = createMockToken({ role: 'admin' })
  localStorage.setItem('adminToken', token)
  localStorage.setItem('admin', JSON.stringify(admin))
}

/**
 * Clear all auth state
 */
export const clearAuthState = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('adminToken')
  localStorage.removeItem('admin')
}

/**
 * Mock API response for authentication
 */
export const mockAuthResponse = {
  success: {
    token: createMockToken(),
    user: createMockUser(),
  },
  error: {
    message: 'Invalid credentials',
  },
}

/**
 * Test environment check
 */
export const isTestEnvironment = () => {
  return process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined
}

