import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Add Section
export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    const { title } = await req.json()

    const course = await prisma.course.findFirst({
        where: {
            id: params.courseId,
            instructorId: session.user.id
        }
    })

    if (!course) return new NextResponse("Unauthorized", { status: 401 })

    // Get last sort order
    const lastSection = await prisma.section.findFirst({
        where: {
            courseId: params.courseId
        },
        orderBy: {
            sortOrder: 'desc'
        }
    })

    const newSortOrder = lastSection ? lastSection.sortOrder + 1 : 1

    const newSection = await prisma.section.create({
        data: {
            courseId: params.courseId,
            title,
            sortOrder: newSortOrder
        }
    })

    return NextResponse.json(newSection)
  } catch (error) {
    console.error("[SECTION_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
