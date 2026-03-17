export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    const { courseId, lectureId, completed, lastPositionSeconds } = await req.json()

    // Verify enrollment
    const enrollment = await prisma.enrollment.findFirst({
        where: {
            userId: session.user.id,
            courseId: courseId
        }
    })

    if (!enrollment) return new NextResponse("Forbidden", { status: 403 })

    // Upsert progress
    await prisma.progress.upsert({
        where: {
            id: (await prisma.progress.findFirst({
                where: {
                    userId: session.user.id,
                    lectureId: lectureId
                },
                select: { id: true }
            }))?.id || "00000000-0000-0000-0000-000000000000" // Use a valid UUID format for fallback
        },
        update: {
            completed: completed ?? undefined,
            lastPositionSeconds: lastPositionSeconds ?? undefined,
            updatedAt: new Date()
        },
        create: {
            userId: session.user.id,
            courseId,
            lectureId,
            completed: completed ?? false,
            lastPositionSeconds: lastPositionSeconds ?? 0
        }
    })

    // 4. Recalculate and update progressPercentage on Enrollment
    const totalLectures = await prisma.lecture.count({
        where: { courseId: courseId }
    })

    const completedLectures = await prisma.progress.count({
        where: {
            userId: session.user.id,
            courseId: courseId,
            completed: true
        }
    })

    const progressPercentage = Math.round((completedLectures / (totalLectures || 1)) * 100)

    await prisma.enrollment.updateMany({
        where: {
            userId: session.user.id,
            courseId: courseId
        },
        data: {
            progressPercentage: progressPercentage
        }
    })

    return NextResponse.json({ success: true, progressPercentage })
  } catch (error) {
    console.error("[PROGRESS_UPDATE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

