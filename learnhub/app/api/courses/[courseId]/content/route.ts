import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/courses/[courseId]/content — full course content for enrolled students
// courseId param can be either the UUID id OR the slug
export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Try by slug first, then by id
    const course = await prisma.course.findFirst({
      where: {
        OR: [{ slug: params.courseId }, { id: params.courseId }]
      },
      include: {
        instructor: { select: { name: true, image: true } },
        sections: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lectures: {
              orderBy: { sortOrder: 'asc' },
              select: {
                id: true,
                title: true,
                type: true,
                durationSeconds: true,
                videoUrl: true,
                articleContent: true,
                isFreePreview: true,
              }
            }
          }
        }
      }
    })

    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: session.user.id, courseId: course.id }
    })

    if (!enrollment) return NextResponse.json({ error: 'Not enrolled' }, { status: 403 })

    return NextResponse.json({
      id: course.id,
      title: course.title,
      slug: course.slug,
      instructor: course.instructor,
      sections: course.sections,
    })
  } catch (err: any) {
    console.error('[COURSE_CONTENT_GET]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
