import connectDB from "./mongodb"
import mongoose from "mongoose"

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

/**
 * Products API calls
 */
export const productsAPI = {
  async getAll() {
    const db = await getDatabase()
    const products = await db.collection("products").find({}).toArray()
    return products
  },

  async getById(id: string) {
    const db = await getDatabase()
    const product = await db.collection("products").findOne({ _id: new mongoose.Types.ObjectId(id) })
    return product
  },

  async create(data: any) {
    const db = await getDatabase()
    const result = await db.collection("products").insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return result
  },

  async update(id: string, data: any) {
    const db = await getDatabase()
    const result = await db.collection("products").updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    )
    return result
  },

  async delete(id: string) {
    const db = await getDatabase()
    const result = await db.collection("products").deleteOne({ _id: new mongoose.Types.ObjectId(id) })
    return result
  },
}
