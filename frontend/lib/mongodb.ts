import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  console.warn("⚠️ MONGO_URI is not defined in environment variables");
}

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected (Mongoose)");
  } catch (error) {
    console.error("❌ MongoDB Connection Error (Mongoose):", error);
    throw error;
  }
}

export async function getDatabase() {
  if (cachedDb) return cachedDb;

  if (!cachedClient) {
    cachedClient = new MongoClient(MONGO_URI);
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db();
  return cachedDb;
}

export default connectDB;
