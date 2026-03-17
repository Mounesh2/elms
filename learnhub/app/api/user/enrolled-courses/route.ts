export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    const enrolled = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      orderBy: { enrolledAt: 'desc' },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } }
          }
        }
      }
    })

    // Get last accessed lecture per course (most recently updated progress)
    const progressRecords = await prisma.progress.findMany({
      where: {
        userId: session.user.id,
        courseId: { in: enrolled.map(e => e.courseId) }
      },
      orderBy: { updatedAt: 'desc' }
    })

    // Build a map: courseId -> last lectureId
    const lastLectureMap: Record<string, string> = {}
    progressRecords.forEach(p => {
      if (!lastLectureMap[p.courseId]) {
        lastLectureMap[p.courseId] = p.lectureId
      }
    })

    const results = enrolled.map(e => ({
      id: e.course.id,
      title: e.course.title,
      slug: e.course.slug,
      thumbnailUrl: e.course.thumbnailUrl,
      instructor: { name: e.course.instructor.name },
      progress: e.progressPercentage,
      lastLectureId: lastLectureMap[e.courseId] ?? null,
    }))

    return NextResponse.json(results)
  } catch (error) {
    console.error("[ENROLLED_COURSES_GET_ERROR]", error)
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

