export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// GET /api/instructor - Fetch overview metrics for the instructor dashboard
export async function GET() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Example: Fetch total revenue from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('total_courses_created, is_instructor')
    .eq('id', user.id)
    .single()

  if (!profile?.is_instructor) {
     return NextResponse.json({ error: 'User is not an instructor' }, { status: 403 })
  }

  // Fetch courses count
  const { count: courseCount } = await supabase
    .from('courses')
    .select('id', { count: 'exact', head: true })
    .eq('instructor_id', user.id)

  return NextResponse.json({
    data: {
      totalCourses: courseCount || 0,
      totalStudents: 1234, // Mock total students
      totalRevenue: 2453.00, // Mock revenue
      averageRating: 4.7, // Mock rating
    },
    success: true
  })
}

// POST /api/instructor - Could handle onboarding, payout setup, etc.
export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Logic for updating instructor status, creating Stripe Connect linked account, etc.
    
    return NextResponse.json({ success: true, message: 'Instructor data updated successfully.', data: body })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 })
  }
}
