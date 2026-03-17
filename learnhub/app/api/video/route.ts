export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// In a real app, this API would trigger Cloudflare Stream processing
// and poll for status. For now, it updates the lecture with the R2 path.

export async function POST(req: Request) {
  try {
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
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { lectureId, courseId, key } = await req.json()

    // Real world: Verify course ownership + Call Cloudflare Stream API using the R2 Direct Upload URL

    // Update lecture with the video key/url
    // We are mocking this update for the boilerplate
    const { error: updateErr } = await supabase
       .from('lectures')
       .update({ type: 'video', video_url: key, updated_at: new Date().toISOString() })
       .eq('id', lectureId)

    if (updateErr) {
       console.error("Video attach error:", updateErr)
       return NextResponse.json({ error: 'Failed to attach video to lecture' }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Video attached and processing started' })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
