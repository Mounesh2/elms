import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const supabase = createServerClient()
  const { username } = params

  try {
    // 1. Fetch Instructor Profile
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url, bio, headline, website_url, twitter_url, linkedin_url, total_courses_enrolled, total_courses_created, created_at')
      .eq('username', username)
      .eq('is_instructor', true)
      .single()

    if (profileErr || !profile) {
      return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })
    }

    // 2. Fetch Published Courses
    const { data: courses, error: coursesErr } = await supabase
      .from('courses')
      .select('id, slug, title, short_description, thumbnail_url, level, price, is_free, average_rating, total_reviews, total_students, total_duration_seconds')
      .eq('instructor_id', profile.id)
      .eq('is_published', true)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    // 3. Aggregate Stats (optional, but good for profile header)
    let totalStudents = 0
    let totalReviews = 0
    let totalRating = 0

    if (courses) {
      courses.forEach(c => {
        totalStudents += c.total_students
        totalReviews += c.total_reviews
        totalRating += (c.average_rating * c.total_reviews)
      })
    }
    
    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0

    return NextResponse.json({
      profile,
      stats: {
        totalStudents,
        totalReviews,
        averageRating,
        courseCount: courses?.length || 0,
      },
      courses: courses || [],
    })

  } catch (err: unknown) {
    const error = err as Error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
