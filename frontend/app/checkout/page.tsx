"use client";

import { RazorpayCheckoutForm } from "@/components/razorpay-checkout-form";
import { useCart } from "@/components/cart-context";

export default function CheckoutPage() {
  const { totalPrice } = useCart();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">
        Booking & Payment
      </h1>

      <RazorpayCheckoutForm finalTotal={totalPrice} />
    </div>
  );
}