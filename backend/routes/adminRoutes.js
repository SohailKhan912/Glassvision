import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Admin login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📩 Incoming admin login email:", email);

    const admin = await Admin.findOne({ email });
    console.log("🔍 Admin found in DB:", !!admin);
    if (!admin) {
      console.warn("❌ Admin not found:", email);
      const response = { success: false, message: "Invalid email or password" };
      console.log("📤 Returning response:", response);
      return res.status(401).json(response);
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("🧩 Password match result:", isMatch);

    if (!isMatch) {
      const response = { success: false, message: "Invalid email or password" };
      console.log("📤 Returning response:", response);
      return res.status(401).json(response);
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    console.log("✅ Login success:", email);

    const response = {
      success: true,
      token,
      user: { 
        id: admin._id, 
        name: admin.name, 
        email: admin.email, 
        role: "admin" 
      },
    };
    console.log("📤 Returning response:", response);
    return res.status(200).json(response);
  } catch (error) {
    console.error("💥 Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Admin get stats
router.get("/stats", async (req, res) => {
  try {
    console.log("📊 Getting admin stats");

    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Add monthly revenue for chart
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const stats = {
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue,
    };

    console.log("📤 Stats response:", stats);
    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("💥 Stats error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Admin get orders
router.get("/orders", async (req, res) => {
  try {
    console.log("📦 Getting admin orders");

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
      ...order,
      orderId: order._id,
      customerInfo: {
        name: order.name,
        email: order.email,
        phone: order.phone,
      },
      total: order.amount,
    }));

    console.log(`📤 Sending ${formattedOrders.length} orders`);
    return res.status(200).json({
      success: true,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("💥 Orders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
