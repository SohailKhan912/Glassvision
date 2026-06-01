"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_id");
  const paymentId = searchParams.get("payment_id");
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const amount = searchParams.get("amount");

  // ✅ Automatically send confirmation email
  useEffect(() => {
    if (email && orderId && paymentId && amount) {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3003";
      fetch(`${apiBase}/api/email/send-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, amount, orderId, paymentId }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("📧 Email sent:", data);
        })
        .catch((err) => {
          console.error("❌ Email send failed (non-critical):", err);
        });
    }
  }, [email, orderId, paymentId, amount]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-white px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-100">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="text-green-500 w-16 h-16 animate-bounce" />
        </div>

        <h1 className="text-2xl font-bold text-green-600 mb-2">
          Payment Successful
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you, <strong>{name || "Customer"}</strong>! Your payment of{" "}
          <strong>₹{amount}</strong> has been successfully processed.
        </p>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-700 text-left mb-6 shadow-inner">
          <p className="mb-1">
            <strong>Order ID:</strong>{" "}
            <span className="text-gray-900">{orderId || "Not available"}</span>
          </p>
          <p className="mb-1">
            <strong>Payment ID:</strong>{" "}
            <span className="text-gray-900">{paymentId || "Not available"}</span>
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-600 font-semibold">Success ✅</span>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push("/")}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Go to Home
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/catalog")}
            className="border-teal-500 text-teal-600 hover:bg-teal-50"
          >
            Continue Shopping
          </Button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          A confirmation email has been sent to your registered address.
        </p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
