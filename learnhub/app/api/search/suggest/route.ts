export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")

  if (!q) return NextResponse.json([])

  try {
    const [matchingCourses, matchingProfile, matchingCats] = await Promise.all([
        prisma.course.findMany({
            where: {
                title: { contains: q, mode: 'insensitive' },
                isPublished: true
            },
            select: { title: true, slug: true },
            take: 5
        }),
            
        prisma.user.findMany({
            where: {
                name: { contains: q, mode: 'insensitive' },
                isInstructor: true
            },
            select: { name: true, id: true },
            take: 2
        }),

        prisma.category.findMany({
            where: {
                name: { contains: q, mode: 'insensitive' }
            },
            select: { name: true, slug: true },
            take: 2
        })
    ])

    const results = [
        ...matchingCourses.map(c => ({ title: c.title, slug: c.slug, type: "course" })),
        ...matchingProfile.map(p => ({ title: p.name, slug: p.id, type: "instructor" })),
        ...matchingCats.map(cat => ({ title: cat.name, slug: cat.slug, type: "category" }))
    ]

    return NextResponse.json(results.slice(0, 8))
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}

