export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { getCourses } from "@/lib/db/queries"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    
    const q = searchParams.get('q') || undefined
    const category = searchParams.get('category') || undefined
    const rating = Number(searchParams.get('rating')) || 0
    const levels = searchParams.get('levels')?.split(',').filter(Boolean) || []
    const price = (searchParams.get('price') || 'all') as 'all' | 'free' | 'paid'
    const sort = (searchParams.get('sort') || 'highest-rated') as 'highest-rated' | 'most-reviewed' | 'newest'
    const limit = Number(searchParams.get('limit')) || 24

    const courses = await getCourses({
      search: q,
      category,
      rating,
      levels,
      price,
      sort,
      limit
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("[COURSES_SEARCH_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

