"use client"

import { useEffect, useState } from "react"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any
    }
  }
}

export default function ARPage() {
  const [scriptReady, setScriptReady] = useState(false)
  const [hasModel, setHasModel] = useState(false)
  const MV: any = 'model-viewer'

  useEffect(() => {
    let cancelled = false
    fetch("/models/sample.glb", { method: "HEAD" })
      .then((res) => !cancelled && setHasModel(res.ok))
      .catch(() => !cancelled && setHasModel(false))

    const existing = customElements.get("model-viewer")
    if (existing) {
      setScriptReady(true)
      return
    }
    const s = document.createElement("script")
    s.type = "module"
    s.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
    s.onload = () => !cancelled && setScriptReady(true)
    document.head.appendChild(s)
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="min-h-screen pt-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">AR Viewer</h1>
        {!scriptReady ? (
          <div className="p-6 border rounded">Loading AR viewer…</div>
        ) : hasModel ? (
          <MV
            style={{ width: "100%", height: 640, background: "#f8fafc" }}
            src="/models/sample.glb"
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            poster="/premium-modern-glass-door-entrance-with-ar-visuali.jpg"
            exposure="1.1"
            shadow-intensity="0.4"
          ></MV>
        ) : (
          <div className="p-6 border rounded text-sm">
            No AR model found at <code>/models/sample.glb</code>. Place a GLB there to enable AR.
          </div>
        )}
      </div>
    </main>
  )
}