"use client";

import { RazorpayCheckoutForm } from "@/components/razorpay-checkout-form";
import { useCart } from "@/components/cart-context";

export default function CheckoutPage() {
  const { total } = useCart();

  const subtotal = total;
  const gst = subtotal * 0.18;
  const shipping = subtotal > 50000 ? 0 : 1500;
  const finalTotal = Math.round(subtotal + gst + shipping);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Booking & Payment</h1>
      <RazorpayCheckoutForm finalTotal={finalTotal} />
    </div>
  );
}