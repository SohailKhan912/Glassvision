import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, subject, message } = body || {}

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const feedback = {
      firstName,
      lastName,
      email: String(email).toLowerCase(),
      phone: phone || "",
      subject: subject || "",
      message,
      createdAt: new Date(),
    }
    await db.collection("feedback").insertOne(feedback)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("❌ Feedback save error:", error)
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const db = await getDatabase()
    const items = await db.collection("feedback").find({}).sort({ createdAt: -1 }).limit(100).toArray()
    return NextResponse.json({ success: true, items })
  } catch (error: any) {
    console.error("❌ Feedback fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 })
  }
}