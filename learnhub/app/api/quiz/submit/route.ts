export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { lectureId, courseId, score, passed } = body

    if (!lectureId || !courseId || score === undefined || passed === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Record the quiz attempt
    const { error: attemptError } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: user.id,
        lecture_id: lectureId,
        score,
        passed,
        created_at: new Date().toISOString()
      })

    // If table doesn't exist yet, we silently ignore for the prototype
    if (attemptError && !attemptError.message.includes('relation "quiz_attempts" does not exist')) {
       console.error('Quiz attempt recording error:', attemptError)
    }

    // 2. If passed, mark lecture as complete in user_progress
    if (passed) {
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lecture_id: lectureId,
          course_id: courseId,
          is_completed: true,
          completed_at: new Date().toISOString()
        }, { onConflict: 'user_id,lecture_id' })

      if (progressError) {
        console.error('Failed to mark quiz as complete in progress:', progressError)
      }
    }

    return NextResponse.json({ success: true, score, passed })

  } catch (error: any) {
    console.error('Quiz submission error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' }, 
      { status: 500 }
    )
  }
}

