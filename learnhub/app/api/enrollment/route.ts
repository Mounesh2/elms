export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/enrollment?courseId=xxx — check if enrolled
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ enrolled: false }, { status: 401 })

  const courseId = req.nextUrl.searchParams.get('courseId')
  if (!courseId) return NextResponse.json({ error: 'Missing courseId' }, { status: 400 })

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id, courseId }
  })

  return NextResponse.json({ enrolled: !!enrollment, enrollment })
}

// POST /api/enrollment — enroll in a course (free or after payment)
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { courseId } = await req.json()
    if (!courseId) return NextResponse.json({ error: 'Missing courseId' }, { status: 400 })

    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    // Prevent duplicate enrollment
    const existing = await prisma.enrollment.findFirst({
      where: { userId: session.user.id, courseId }
    })
    if (existing) return NextResponse.json({ enrolled: true, enrollment: existing })

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
        enrollmentType: course.isFree ? 'free' : 'paid',
        pricePaid: course.isFree ? 0 : course.price,
        progressPercentage: 0,
      }
    })

    // Increment totalStudents on course
    await prisma.course.update({
      where: { id: courseId },
      data: { totalStudents: { increment: 1 } }
    })

    // Increment profile counter
    await prisma.profile.updateMany({
      where: { id: session.user.id },
      data: { totalCoursesEnrolled: { increment: 1 } }
    })

    return NextResponse.json({ enrolled: true, enrollment }, { status: 201 })
  } catch (err: any) {
    console.error('[ENROLLMENT_POST]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

