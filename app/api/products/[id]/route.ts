import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import mongoose from "mongoose"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const db = await getDatabase()
    const productsCollection = db.collection("products")

    const product = await productsCollection.findOne({ _id: new (mongoose as any).Types.ObjectId(id) })

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const updates = await request.json()
    const { id } = await context.params
    const db = await getDatabase()
    const productsCollection = db.collection("products")

    const result = await productsCollection.updateOne(
      { _id: new (mongoose as any).Types.ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating product:", error)
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const db = await getDatabase()
    const productsCollection = db.collection("products")

    const result = await productsCollection.deleteOne({ _id: new (mongoose as any).Types.ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting product:", error)
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 })
  }
}
