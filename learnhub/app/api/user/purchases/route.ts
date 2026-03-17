export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    const userPurchases = await prisma.purchase.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            course: {
                include: {
                    instructor: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const results = userPurchases.map(p => ({
        id: p.id,
        amount: p.amount,
        createdAt: p.createdAt,
        courseTitle: p.course.title,
        instructorName: p.course.instructor.name,
        last4: null 
    }))

    return NextResponse.json(results)
  } catch (error) {
    console.error("[PURCHASES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

