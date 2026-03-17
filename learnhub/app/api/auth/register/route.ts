export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["student", "instructor"]),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { fullName, email, password, role } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user using Prisma
    await prisma.user.create({
      data: {
        name: fullName,
        email: email,
        password: hashedPassword,
        role: role as "student" | "instructor",
        isInstructor: role === "instructor",
      }
    })

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    )
  } catch (error) {
    console.error("REGISTRATION_ERROR", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

