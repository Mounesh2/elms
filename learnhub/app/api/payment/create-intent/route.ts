export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createPaymentIntent, calculatePlatformFee } from '@/lib/stripe'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const limit = rateLimit(req, { max: 10, windowMs: 60_000 })
  if (limit) return limit

  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { courseIds, couponCode } = await req.json()
    if (!courseIds?.length) return NextResponse.json({ success: false, error: 'No courses specified' }, { status: 400 })

    // Get courses
    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select('id, title, price, slug, instructor_id')
      .in('id', courseIds)
      .eq('status', 'published')

    if (error || !courses?.length) return NextResponse.json({ success: false, error: 'Courses not found' }, { status: 404 })

    // Check not already enrolled
    const { data: enrollments } = await supabaseAdmin
      .from('enrollments')
      .select('course_id')
      .eq('user_id', user.id)
      .in('course_id', courseIds)
      .eq('status', 'active')

    const alreadyEnrolled = enrollments?.map(e => e.course_id) ?? []
    const newCourses = courses.filter(c => !alreadyEnrolled.includes(c.id))
    if (!newCourses.length) return NextResponse.json({ success: false, error: 'Already enrolled in all selected courses' }, { status: 409 })

    let total = newCourses.reduce((sum, c) => sum + c.price, 0)

    // Apply coupon
    if (couponCode) {
      const { data: coupon } = await supabaseAdmin
        .from('coupons')
        .select('*').eq('code', couponCode.toUpperCase()).eq('is_active', true).single()
      if (coupon) {
        const discount = coupon.discount_type === 'percent'
          ? total * (coupon.discount_value / 100)
          : Math.min(coupon.discount_value, total)
        total = Math.max(0, total - discount)
      }
    }

    if (total === 0) {
      // Free enrollment
      const enrollmentData = newCourses.map(c => ({
        user_id: user.id, course_id: c.id, status: 'active', price_paid: 0,
        enrolled_at: new Date().toISOString(), coupon_code: couponCode ?? null,
      }))
      await supabaseAdmin.from('enrollments').insert(enrollmentData)
      return NextResponse.json({ success: true, free: true })
    }

    const paymentIntent = await createPaymentIntent(total, 'usd', {
      user_id: user.id,
      course_ids: courseIds.join(','),
      coupon_code: couponCode ?? '',
    })

    return NextResponse.json({ success: true, client_secret: paymentIntent.client_secret, amount: total })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
