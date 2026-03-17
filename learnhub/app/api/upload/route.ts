export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { generateUploadUrl } from '@/lib/cloudflare'
import { v4 as uuidv4 } from 'uuid'

// POST /api/upload
// Generates a presigned URL for direct secure upload to Cloudflare R2
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

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { filename, contentType, courseId } = await req.json()

    if (!filename || !contentType || !courseId) {
       return NextResponse.json({ error: 'Missing required upload parameters' }, { status: 400 })
    }

    // Verify user is instructor of this course
    const { data: course, error: courseErr } = await supabase
       .from('courses')
       .select('id')
       .eq('id', courseId)
       .eq('instructor_id', user.id)
       .single()

    if (courseErr || !course) {
       return NextResponse.json({ error: 'Forbidden: You do not own this course' }, { status: 403 })
    }

    // Validate MIME type (basic validation)
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm']
    if (!validTypes.includes(contentType)) {
       return NextResponse.json({ error: 'Unsupported file type. Please upload a specific video format.' }, { status: 400 })
    }

    // Generate unique key incorporating user context
    const fileId = uuidv4()
    const extension = filename.split('.').pop()
    const key = `courses/${courseId}/videos/${fileId}.${extension}`

    const uploadUrl = await generateUploadUrl(key, contentType)

    return NextResponse.json({ 
       uploadUrl, 
       key, 
       fileId 
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error generating upload URL' }, { status: 500 })
  }
}
