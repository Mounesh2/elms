export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getCourses } from "@/lib/db/queries"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined
    const instructorId = searchParams.get('instructorId') || undefined
    const isPublished = searchParams.get('isPublished') === 'true'
    
    // Simple fetch based on common filters
    const courses = await prisma.course.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(instructorId && { instructorId }),
        ...(searchParams.has('isPublished') && { isPublished }),
      },
      include: {
        category: true,
        instructor: {
          select: { name: true, image: true, id: true }
        },
        _count: {
          select: { reviews: true, enrollments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("[COURSES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || !session.user.isInstructor) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { title, categoryId } = await req.json()

    if (!title) return new NextResponse("Title is required", { status: 400 })

    // Generate a simple slug
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "") + "-" + Math.random().toString(36).substring(7)

    const course = await prisma.course.create({
      data: {
        instructorId: session.user.id,
        title,
        categoryId,
        slug,
        status: "draft",
      },
      select: { id: true }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error("[COURSES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
