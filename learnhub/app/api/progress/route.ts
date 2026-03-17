export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { lectureId, courseId, lastPositionSeconds, completed } = await req.json()
    if (!lectureId || !courseId) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

    // courseId may be UUID or slug — resolve to UUID
    const course = await prisma.course.findFirst({
      where: { OR: [{ id: courseId }, { slug: courseId }] },
      select: { id: true }
    })
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    const existing = await prisma.progress.findFirst({
      where: { userId: session.user.id, lectureId }
    })

    if (existing) {
      await prisma.progress.update({
        where: { id: existing.id },
        data: {
          lastPositionSeconds: lastPositionSeconds ?? existing.lastPositionSeconds,
          completed: completed ?? existing.completed,
          updatedAt: new Date()
        }
      })
    } else {
      await prisma.progress.create({
        data: {
          userId: session.user.id,
          courseId: course.id,
          lectureId,
          lastPositionSeconds: lastPositionSeconds ?? 0,
          completed: completed ?? false,
        }
      })
    }

    // Recalculate enrollment progress %
    const [total, done] = await Promise.all([
      prisma.lecture.count({ where: { courseId: course.id } }),
      prisma.progress.count({ where: { userId: session.user.id, courseId: course.id, completed: true } })
    ])

    const percentage = total > 0 ? Math.round((done / total) * 100) : 0
    await prisma.enrollment.updateMany({
      where: { userId: session.user.id, courseId: course.id },
      data: { progressPercentage: percentage }
    })

    return NextResponse.json({ success: true, progressPercentage: percentage })
  } catch (err: any) {
    console.error('[PROGRESS_POST]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const courseId = req.nextUrl.searchParams.get('courseId')
    if (!courseId) return NextResponse.json({ error: 'Missing courseId' }, { status: 400 })

    // Resolve slug or UUID
    const course = await prisma.course.findFirst({
      where: { OR: [{ id: courseId }, { slug: courseId }] },
      select: { id: true }
    })
    if (!course) return NextResponse.json([])

    const progress = await prisma.progress.findMany({
      where: { userId: session.user.id, courseId: course.id }
    })

    return NextResponse.json(progress)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

