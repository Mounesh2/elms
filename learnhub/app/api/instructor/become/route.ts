export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    // Upgrade user role to instructor
    await prisma.user.update({
        where: { id: session.user.id },
        data: { 
            role: "instructor", 
            isInstructor: true
        }
    })

    // Ensure profile is expanded
    await prisma.profile.upsert({
        where: { id: session.user.id },
        update: {},
        create: {
            id: session.user.id,
            email: session.user.email!,
            fullName: session.user.name,
            totalCoursesCreated: 0,
        }
    })

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("[BECOME_INSTRUCTOR_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

