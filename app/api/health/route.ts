import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || `http://localhost:5000`
    const resp = await fetch(`${backendUrl}/api/health`)
    const text = await resp.text()
    return new NextResponse(text, { status: resp.status, headers: { 'content-type': resp.headers.get('content-type') || 'application/json' } })
  } catch (err) {
    console.error('Proxy /api/health error:', err)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
