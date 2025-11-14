"use client";

import { RazorpayCheckoutForm } from "@/components/razorpay-checkout-form";

export default function CheckoutPage() {
  // You can pass total price if needed (example: 4000)
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Booking & Payment</h1>
      <RazorpayCheckoutForm finalTotal={4000} />
    </div>
  );
}
