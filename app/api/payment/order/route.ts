import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || `http://localhost:5000`

    // Forward the request to the backend payment endpoint
    const resp = await fetch(`${backendUrl}/api/payment/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!resp.ok) {
      const errorText = await resp.text().catch(() => 'Unknown error')
      console.error('Backend payment error:', resp.status, errorText)
      return NextResponse.json(
        { success: false, message: `Backend error: ${errorText}` },
        { status: resp.status }
      )
    }

    const data = await resp.json()
    // Ensure response has the expected format
    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    console.error('Proxy /api/payment/order error:', err)
    return NextResponse.json(
      { success: false, message: err.message || 'Proxy error' },
      { status: 500 }
    )
  }
}
