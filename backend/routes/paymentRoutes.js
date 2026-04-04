import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config(); // ✅ Ensure .env variables are loaded

const router = express.Router();

// ✅ Create Razorpay Order
router.post("/order", async (req, res) => {
  try {
    console.log("🧾 Incoming payment request:", req.body);
    console.log("🔑 RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
    console.log("🔒 RAZORPAY_KEY_SECRET present:", !!process.env.RAZORPAY_KEY_SECRET);

    // ✅ Ensure amount is valid
    if (!req.body.amount || isNaN(req.body.amount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing amount in request body",
      });
    }

    // ✅ Create Razorpay instance
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Number(req.body.amount) * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log("🧩 Creating Razorpay order with options:", options);

    // ✅ Create order
    const order = await instance.orders.create(options);

    console.log("✅ Razorpay Order Created Successfully:", order);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("❌ Razorpay order creation failed:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error details:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
});

// ✅ Verify Razorpay Signature
router.post("/verify", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      res.status(200).json({ success: true, message: "✅ Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "❌ Invalid payment signature" });
    }
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

export default router;
