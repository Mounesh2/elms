export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { streamCourseAssistant } from '@/lib/ai'
import { rateLimit } from '@/lib/rateLimit'
import type { AIChatMessage } from '@/types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const limit = rateLimit(req, { max: 30, windowMs: 60_000 })
  if (limit) return limit

  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''))
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { messages, courseId } = await req.json()

    // Get course context
    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('title, description')
      .eq('id', courseId)
      .single()

    if (!course) return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 })

    const stream = await streamCourseAssistant(messages as AIChatMessage[], {
      title: course.title,
      description: course.description ?? '',
    })

    // Return a streaming response
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
