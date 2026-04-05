"use client"

import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="text-center max-w-md">
        <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your order. We've received your request and will start processing it right away. 
          A confirmation email has been sent to you.
        </p>
        <div className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link href="/catalog">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/track-order">Track My Order</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
