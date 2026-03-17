import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: { courseId: string, sectionId: string } }) {
  try {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    const { title } = await req.json()

    const lastLecture = await prisma.lecture.findFirst({
        where: {
            sectionId: params.sectionId
        },
        orderBy: {
            sortOrder: 'desc'
        }
    })

    const newSortOrder = lastLecture ? lastLecture.sortOrder + 1 : 1

    const newLecture = await prisma.lecture.create({
        data: {
            courseId: params.courseId,
            sectionId: params.sectionId,
            title,
            sortOrder: newSortOrder
        }
    })

    return NextResponse.json(newLecture)
  } catch (error) {
    console.error("[LECTURE_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
