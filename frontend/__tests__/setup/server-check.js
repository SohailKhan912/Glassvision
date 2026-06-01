/**
 * Server Availability Check
 * Helper to check if backend server is running before running API tests
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'

export async function checkServerAvailable() {
  try {
    const response = await fetch(`${API_BASE}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000), // 2 second timeout
    })
    return response.ok
  } catch (error) {
    return false
  }
}

export function skipIfServerUnavailable() {
  let serverAvailable = false
  
  beforeAll(async () => {
    serverAvailable = await checkServerAvailable()
    if (!serverAvailable) {
      console.warn('⚠️  Backend server not available. Skipping API tests.')
      console.warn('   Start server with: npm run server')
    }
  })
  
  return () => serverAvailable
}

