export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "20")

    const [userNotifications, unreadCount] = await Promise.all([
        prisma.notification.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        }),
        prisma.notification.count({
            where: {
                userId: session.user.id,
                isRead: false
            }
        })
    ])

    return NextResponse.json({
        notifications: userNotifications,
        unreadCount: unreadCount
    })
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

