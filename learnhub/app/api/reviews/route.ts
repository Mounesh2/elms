export const dynamic = 'force-dynamic'

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    const { rating, comment, courseId } = await req.json()
    
    await prisma.review.create({
        data: {
            userId: session.user.id,
            courseId,
            rating,
            body: comment
        }
    })

    return new Response("Success", { status: 200 })
  } catch (e) {
    console.error("[REVIEWS_POST]", e)
    return new Response("Error", { status: 500 })
  }
}
