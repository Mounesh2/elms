export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEnrollmentEmail } from '@/lib/email'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event
  try {
    event = constructWebhookEvent(body, signature)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as { id: string; amount: number; metadata: Record<string, string> }
        const { user_id, course_ids, coupon_code } = pi.metadata
        if (!user_id || !course_ids) break

        const courseIdArr = course_ids.split(',')
        const amountEach = pi.amount / courseIdArr.length / 100

        // Get user email
        const { data: user } = await supabaseAdmin.auth.admin.getUserById(user_id)
        const email = user?.user?.email ?? ''
        const { data: profile } = await supabaseAdmin.from('users').select('full_name').eq('id', user_id).single()

        // Create enrollments
        const enrollments = courseIdArr.map(cid => ({
          user_id,
          course_id: cid,
          status: 'active',
          price_paid: amountEach,
          enrolled_at: new Date().toISOString(),
          payment_id: pi.id,
          coupon_code: coupon_code || null,
        }))

        const { error: enrollErr } = await supabaseAdmin.from('enrollments').insert(enrollments)
        if (enrollErr) { console.error('Enrollment insert error:', enrollErr); break }

        // Increment student counts
        for (const cid of courseIdArr) {
          await supabaseAdmin.rpc('increment_student_count', { course_id: cid })
        }

        // Send enrollment emails
        if (email) {
          for (const cid of courseIdArr) {
            const { data: course } = await supabaseAdmin.from('courses').select('title, slug').eq('id', cid).single()
            if (course) await sendEnrollmentEmail(email, profile?.full_name ?? 'Student', course)
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as { metadata: Record<string, string> }
        console.log('Payment failed for user:', pi.metadata.user_id)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as { payment_intent: string }
        await supabaseAdmin
          .from('enrollments')
          .update({ status: 'refunded' })
          .eq('payment_id', charge.payment_intent)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
