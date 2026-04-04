"use client"

import { useEffect } from "react"
import { CartProvider } from "./cart-context"
import { Toaster } from "./ui/sonner"
import { AuthProvider } from "./auth-provider"

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inject Razorpay script client-side only (keeps layout server-safe)
    const id = "razorpay-script"
    if (!document.getElementById(id)) {
      const s = document.createElement("script")
      s.id = id
      s.src = "https://checkout.razorpay.com/v1/checkout.js"
      s.async = true
      document.head.appendChild(s)
    }
  }, [])

  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster position="top-right" />
      </CartProvider>
    </AuthProvider>
  )
}
