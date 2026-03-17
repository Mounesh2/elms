export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { rateLimit } from '@/lib/rateLimit'
import { searchCourses } from '@/lib/meilisearch'

export async function GET(req: NextRequest) {
  const limit = rateLimit(req, { max: 60, windowMs: 60_000 })
  if (limit) return limit

  const { searchParams } = req.nextUrl
  const q = searchParams.get('q') ?? ''
  const category = searchParams.get('category')
  const level = searchParams.get('level')
  const isFree = searchParams.get('free')
  const sort = searchParams.get('sort') ?? 'relevance'
  const page = Number(searchParams.get('page') ?? 1)
  const pageSize = Number(searchParams.get('limit') ?? 20)

  try {
    const filters: string[] = ['status = "published"']
    if (category) filters.push(`category_id = "${category}"`)
    if (level) filters.push(`level = "${level}"`)
    if (isFree === 'true') filters.push('is_free = true')

    const sortMap: Record<string, string[]> = {
      newest: ['created_at:desc'],
      rating: ['average_rating:desc'],
      popular: ['total_students:desc'],
      'price-asc': ['price:asc'],
      'price-desc': ['price:desc'],
    }

    const results = await searchCourses({
      query: q,
      filters: filters.join(' AND '),
      sort: sortMap[sort],
      page,
      limit: pageSize,
    })

    return NextResponse.json({
      success: true,
      data: results.hits,
      total: (results as unknown as { estimatedTotalHits?: number }).estimatedTotalHits ?? results.hits.length,
      page,
      limit: pageSize,
      processingTimeMs: results.processingTimeMs,
    })
  } catch {
    // Fallback to Supabase if MeiliSearch is not available
    const { data, error, count } = await supabaseAdmin
      .from('courses')
      .select('*, instructor:users!instructor_id(id, name, image, profile:profiles(headline, avatar_url))', { count: 'exact' })
      .eq('status', 'published')
      .ilike('title', `%${q}%`)
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (error) return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
    return NextResponse.json({ success: true, data, total: count ?? 0, page, limit: pageSize })
  }
}
