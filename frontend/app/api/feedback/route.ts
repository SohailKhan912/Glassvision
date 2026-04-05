import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"

// Use dynamic import for CommonJS models
let Feedback: any
async function getFeedbackModel() {
  if (!Feedback) {
    const FeedbackModule = await import('../../../models/Feedback')
    Feedback = FeedbackModule.default
  }
  return Feedback
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    const { name, email, rating, comment } = body

    if (!rating || !comment) {
      return NextResponse.json({ error: "Rating and comment are required" }, { status: 400 })
    }

    // Save to database
    const db = await (await import('@/lib/mongodb')).getDatabase()
    const result = await db.collection("feedbacks").insertOne({
      name,
      email,
      rating,
      comment,
      createdAt: new Date()
    })

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 })
  } catch (error: any) {
    console.error("❌ Error submitting feedback:", error)
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const db = await (await import('@/lib/mongodb')).getDatabase()
    const feedbacks = await db.collection("feedbacks").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ success: true, feedbacks })
  } catch (error: any) {
    console.error("❌ Error fetching feedbacks:", error)
    return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 })
  }
}
