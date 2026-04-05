import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"

// Dynamic import for User model
let User: any
async function getUserModel() {
  if (!User) {
    const UserModule = await import('../../../../models/User')
    User = UserModule.default
  }
  return User
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const User = await getUserModel()

    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user"
    })

    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error("❌ Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
