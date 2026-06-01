import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.NEXT_PUBLIC_MONGODB_URI ||
  "mongodb://127.0.0.1:27017/glassvision";

if (!MONGODB_URI) {
  throw new Error("❌ Missing MongoDB connection string");
}

let isConnected = false

export default async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "glassvision",
    })
    isConnected = !!db.connections[0].readyState
    console.log("✅ MongoDB connected:", db.connection.name)
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error)
    throw error
  }
}

/**
 * Get the MongoDB database instance
 */
export async function getDatabase() {
  await connectDB()
  const db = mongoose.connection.db
  if (!db) {
    throw new Error("Database connection failed")
  }
  return db
}
