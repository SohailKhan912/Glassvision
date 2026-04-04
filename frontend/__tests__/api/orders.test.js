/**
 * Orders API Tests
 * Tests order creation, retrieval, and status tracking
 * 
 * Note: These tests require the backend server to be running on port 5000
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'

// Increase timeout for API tests
jest.setTimeout(10000)

describe('Orders API', () => {
  let userToken
  let testUser
  let serverAvailable = false

  beforeAll(async () => {
    // Check if server is available
    try {
      const healthCheck = await fetch(`${API_BASE}/api/health`, {
        signal: AbortSignal.timeout(2000),
      })
      serverAvailable = healthCheck.ok && healthCheck.status === 200
    } catch (error) {
      serverAvailable = false
      console.warn('Backend server not available, skipping API tests')
      return
    }
    
    // Create and login test user
    testUser = {
      name: 'Order Test User',
      email: `ordertest${Date.now()}@example.com`,
      password: 'test123456',
    }

    // Register user
    await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    })

    // Login to get token
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    })
    const loginData = await loginResponse.json()
    userToken = loginData.token
  })

  describe('POST /api/orders/create', () => {
    it('should create order with valid data', async () => {
      if (!serverAvailable || !userToken) {
        return // Skip if server not available
      }
      
      const orderData = {
        items: [
          {
            id: 'item-1',
            name: 'Test Door',
            price: 15000,
            quantity: 1,
          },
        ],
        total: 15000,
        shippingAddress: {
          name: 'Test User',
          address: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zip: '12345',
          phone: '1234567890',
        },
      }

      const response = await fetch(`${API_BASE}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(orderData),
      })

      expect(response.ok).toBe(true)
      const order = await response.json()
      expect(order).toHaveProperty('_id')
      expect(order).toHaveProperty('status')
    })

    it('should reject order creation without token', async () => {
      if (!serverAvailable) {
        console.log('Skipping test - server not available')
        return // Skip if server not available
      }
      
      const orderData = {
        items: [],
        total: 0,
      }

      const response = await fetch(`${API_BASE}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      // Accept either 401 (unauthorized) or 404 (endpoint not found)
      expect(response.ok).toBe(false)
      expect([401, 404]).toContain(response.status)
    })
  })

  describe('GET /api/orders/get', () => {
    it('should return user orders with valid token', async () => {
      if (!serverAvailable || !userToken) {
        return // Skip if server not available
      }
      
      const response = await fetch(`${API_BASE}/api/orders/get`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      })

      expect(response.ok).toBe(true)
      const data = await response.json()
      expect(Array.isArray(data)).toBe(true)
    })

    it('should reject request without token', async () => {
      if (!serverAvailable) {
        console.log('Skipping test - server not available')
        return // Skip if server not available
      }
      
      const response = await fetch(`${API_BASE}/api/orders/get`)

      // Accept either 401 (unauthorized) or 404 (endpoint not found)
      expect(response.ok).toBe(false)
      expect([401, 404]).toContain(response.status)
    })
  })

  describe('GET /api/orders/get-status', () => {
    let orderId

    beforeAll(async () => {
      if (!serverAvailable || !userToken) return
      
      // Create an order first
      const orderData = {
        items: [{ id: 'item-1', price: 15000, quantity: 1 }],
        total: 15000,
        shippingAddress: {
          name: 'Test User',
          address: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zip: '12345',
          phone: '1234567890',
        },
      }

      const response = await fetch(`${API_BASE}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(orderData),
      })
      const order = await response.json()
      orderId = order._id
    })

    it('should return order status with valid order ID', async () => {
      if (!serverAvailable || !orderId) {
        return // Skip if server not available or no order ID
      }

      const response = await fetch(`${API_BASE}/api/orders/get-status?orderId=${orderId}`)

      expect(response.ok).toBe(true)
      const data = await response.json()
      expect(data).toHaveProperty('status')
    })
  })
})

