"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, AlertCircle, Loader2 } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutFormProps {
  finalTotal?: number;
}

export function RazorpayCheckoutForm({ finalTotal }: RazorpayCheckoutFormProps) {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
  });

  const amount = Math.round(finalTotal || total);

  // ✅ Load Razorpay SDK dynamically
  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (document.getElementById("razorpay-script")) return resolve(true);
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ✅ Handle Payment
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsProcessing(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Failed to load Razorpay SDK. Please check your internet.");
      setIsProcessing(false);
      return;
    }

    try {
      // Determine backend address
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || `${window.location.protocol}//${window.location.hostname}:5000`

      // Try Next.js API route first (proxy), fallback to direct backend
      let res
      try {
        res = await fetch(`/api/payment/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        })
        
        // If proxy fails, try direct backend
        if (!res.ok) {
          res = await fetch(`${API_BASE}/api/payment/order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
          })
        }
      } catch (err) {
        // Fallback to direct backend
        res = await fetch(`${API_BASE}/api/payment/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        })
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "<no body>")
        throw new Error(`Order API returned ${res.status}: ${text}`)
      }

      const data = await res.json()
      if (!data || !data.success) {
        throw new Error(data.message || "Failed to create Razorpay order")
      }

      // Handle both response formats: { success: true, order: {...} } or direct order object
      const orderData = data.order || data
      if (!orderData || !orderData.id) {
        throw new Error("Invalid order response from server")
      }

      // ✅ Configure Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_ReokCLfMpqXrNh",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "GlassVision",
        description: "Glass Door Booking Payment",
        order_id: orderData.id,
        prefill: {
          name: formData.customerName || "Guest User",
          email: formData.email || "guest@example.com",
          contact: formData.phone || "9999999999",
        },
        theme: { color: "#0d9488" },

        // ✅ Redirect to success page on payment
        handler: function (response: any) {
          console.log("Payment successful:", response);
          const { razorpay_order_id, razorpay_payment_id } = response;
          clearCart();

          // Redirect to the new styled success page
          window.location.href = `/order-success?order_id=${razorpay_order_id || orderData.id}&payment_id=${razorpay_payment_id || 'mock'}&name=${encodeURIComponent(
            formData.customerName
          )}&email=${encodeURIComponent(formData.email)}&amount=${amount}`;
        },
        // Handle payment errors
        modal: {
          ondismiss: function() {
            console.log("Payment cancelled by user");
            setIsProcessing(false);
          }
        }
      };

      // Open Razorpay checkout popup
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment init error:", err);
      setError("Something went wrong during payment initialization.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Booking & Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg flex gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="9876543210"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isProcessing || (items.length === 0 && !finalTotal)}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay ₹${amount.toLocaleString()}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
