export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    await prisma.notification.updateMany({
        where: {
            userId: session.user.id
        },
        data: {
            isRead: true
        }
    })

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("[NOTIFICATIONS_READ_ALL]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

