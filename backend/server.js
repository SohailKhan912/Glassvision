// ===============================
// GlassVision Backend Server
// ===============================
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dns from "node:dns";
import productRoutes from "./routes/productRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import authRoutes from "./routes/authRoutes.js";


// Fix DNS issues with Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

// ✅ Load environment variables
dotenv.config();

const app = express();

// ✅ Fix CORS issue for frontend (localhost:3000)
const corsOriginsEnv = process.env.CORS_ORIGINS || process.env.NEXT_PUBLIC_CLIENT_URL || process.env.CLIENT_URL || "http://localhost:3000"
const corsOrigins = corsOriginsEnv.split(",").map((s) => s.trim()).filter(Boolean)
app.use(
  cors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  })
);

app.use(express.json());

// ✅ Check ENV values
console.log("🔑 Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("🧩 MONGO_URI:", process.env.MONGO_URI);

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    tlsAllowInvalidCertificates: true
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.get("/", (req, res) => {
  res.send("✅ GlassVision Backend is running smoothly!");
});

// ✅ Start Server
const PORT = process.env.PORT || 3002;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
