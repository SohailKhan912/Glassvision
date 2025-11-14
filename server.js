const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

dotenv.config()
const app = express()

app.use(cors({ 
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true 
}))
app.use(express.json())

// Load User model dynamically
let User
let dbConnected = false

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running", dbConnected })
})

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/glassvision"
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production"

mongoose
  .connect(MONGO_URI, {
    dbName: "glassvision",
  })
  .then(async () => {
    console.log("✅ MongoDB connected")
    dbConnected = true
    
    // Import User model
    User = require("./models/User")

    // Seed default admin user if not exists
    const adminEmail = "admin@glassvision.com"
    const adminPassword = "admin123"
    
    try {
      let admin = await User.findOne({ email: adminEmail })
      if (!admin) {
        // Create admin with raw password; the User model's pre-save hook will hash it.
        admin = await User.create({
          name: "Admin",
          email: adminEmail,
          password: adminPassword,
          role: "admin",
        })
        console.log("👑 Default admin user created:", adminEmail, "/", adminPassword)
      } else {
        // Always update admin password to ensure it's correct. Assign raw password so
        // the model's pre-save hook hashes it exactly once.
        admin.password = adminPassword
        admin.role = "admin" // Ensure role is admin
        await admin.save()
        console.log("🔐 Admin user updated:", adminEmail, "/", adminPassword)

        // Verify password works
        const testMatch = await bcrypt.compare(adminPassword, admin.password)
        console.log("🧪 Password verification test:", testMatch ? "✅ Pass" : "❌ Fail")
      }
    } catch (err) {
      console.error("❌ Error setting up admin user:", err)
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err)
    dbConnected = false
  })

// Simple auth routes for backend compatibility
app.post("/api/auth/login", async (req, res) => {
  try {
    if (!dbConnected || !User) {
      return res.status(503).json({ message: "Database not connected. Please wait..." })
    }

    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password")
    
    if (!user) {
      console.log("❌ Login failed: User not found for email:", email.toLowerCase())
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
      console.log("❌ Login failed: Password mismatch for email:", email.toLowerCase())
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    })

    console.log("✅ Login successful for:", user.email, "Role:", user.role)

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error: " + error.message })
  }
})

app.post("/api/auth/register", async (req, res) => {
  try {
    if (!dbConnected || !User) {
      return res.status(503).json({ message: "Database not connected. Please wait..." })
    }

    const { name, email, password } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
    })

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    })

    console.log("✅ User registered:", user.email)

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({ message: "Server error: " + error.message })
  }
})

app.get("/api/auth/me", (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(503).json({ message: "Database not connected" })
    }

    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    res.json({
      user: {
        _id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
    })
  } catch (error) {
    console.error("Auth error:", error)
    res.status(401).json({ message: "Invalid token" })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

// --- Payment endpoints (Razorpay) ---
// POST /api/payment/order
// Expects { amount } in request body (amount in rupees)
try {
  const Razorpay = require("razorpay")
  const razorpayClient = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })

  app.post("/api/payment/order", async (req, res) => {
    try {
      console.log("💳 Payment order request received:", req.body)
      const { amount } = req.body
      
      if (!amount || isNaN(Number(amount))) {
        return res.status(400).json({ success: false, message: "Amount is required and must be a number" })
      }

      // Razorpay expects amount in the smallest currency unit (paise)
      const amountPaise = Math.round(Number(amount) * 100)

      // If API keys are not configured, return a mock order for local dev
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.log("⚠️ Razorpay keys not configured, returning mock order")
        const mockOrder = {
          id: `order_mock_${Date.now()}`,
          amount: amountPaise,
          currency: "INR",
        }
        return res.json({ success: true, order: mockOrder })
      }

      const options = {
        amount: amountPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        payment_capture: 1,
      }

      console.log("📦 Creating Razorpay order with options:", options)
      const order = await razorpayClient.orders.create(options)
      console.log("✅ Razorpay order created:", order.id)
      return res.json({ success: true, order })
    } catch (err) {
      console.error("❌ Payment order error:", err)
      return res.status(500).json({ success: false, message: "Failed to create order: " + err.message })
    }
  })
} catch (e) {
  console.log("⚠️ Razorpay package not available, using mock payment endpoint")
  // If razorpay package is missing or fails to load, provide a fallback mock endpoint
  app.post("/api/payment/order", (req, res) => {
    try {
      console.log("💳 Mock payment order request:", req.body)
      const { amount } = req.body || {}
      const amountPaise = Math.round(Number(amount || 0) * 100)
      const mockOrder = { 
        id: `order_mock_${Date.now()}`, 
        amount: amountPaise, 
        currency: "INR" 
      }
      console.log("✅ Mock order created:", mockOrder.id)
      res.json({ success: true, order: mockOrder })
    } catch (err) {
      console.error("❌ Mock payment error:", err)
      res.status(500).json({ success: false, message: "Mock payment error: " + err.message })
    }
  })
}
