import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    // Note: The original code used params.id which might be a typo for courseId or a mismatched file name.
    // I'll assume it targets a notification by its ID from the courseId param if that's how it was being called.
    await prisma.notification.deleteMany({
        where: {
            id: params.courseId,
            userId: session.user.id
        }
    })

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("[NOTIFICATION_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
