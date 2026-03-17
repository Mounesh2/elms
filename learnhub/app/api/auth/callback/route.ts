export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { upgradeToInstructor } from '@/lib/supabase'
import { sendWelcomeEmail } from '@/lib/email'

/**
 * /api/auth/callback
 * ─────────────────────────────────────────────────────────────────
 * Handles:
 *   1. Email confirmation links (signUp flow)
 *   2. Password reset links
 *   3. OAuth redirects (Google, GitHub)
 *   4. Magic link sign-ins
 *
 * Supabase appends ?code=... to this URL. We exchange it for a
 * session using the PKCE code verifier stored in the cookie.
 * ─────────────────────────────────────────────────────────────────
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code   = searchParams.get('code')
  const next   = searchParams.get('next') ?? '/'
  const intent = searchParams.get('intent')   // e.g. 'instructor' from OAuth register
  const type   = searchParams.get('type')     // 'recovery' for password reset

  // ── 1. Password reset — redirect to update-password page ──────────────────
  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/auth/update-password`)
  }

  if (!code) {
    // No code → redirect to login with error
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const supabase = createServerClient()

  // ── 2. Exchange code for session ──────────────────────────────────────────
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] code exchange error:', error.message)
    return NextResponse.redirect(`${origin}/login?error=auth_error`)
  }

  const user    = data.session?.user
  const isNew   = data.session?.user?.created_at
                    ? (Date.now() - new Date(data.session.user.created_at).getTime()) < 10_000
                    : false

  // ── 3. New user — send welcome email ──────────────────────────────────────
  if (user && isNew) {
    const email    = user.email ?? ''
    const fullName = user.user_metadata?.full_name ?? email.split('@')[0]
    const role     = (user.user_metadata?.role as string) ?? 'student'

    // Fire-and-forget (don't block redirect on email)
    sendWelcomeEmail(email, fullName).catch(console.error)

    // If signed up as instructor via OAuth with ?intent=instructor
    if (intent === 'instructor' || role === 'instructor') {
      await upgradeToInstructor(user.id).catch(console.error)
      return NextResponse.redirect(`${origin}/instructor/setup`)
    }
  }

  // ── 4. Instructor intent on existing account ──────────────────────────────
  if (intent === 'instructor' && user) {
    return NextResponse.redirect(`${origin}/instructor/setup`)
  }

  // ── 5. Role Selection Logic ──────────────────────────────────────────────
  // If the user has no role defined yet (e.g. social login first time), send to selection
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.role) {
    // Check if it was truly a new social login without intent
    if (isNew && !intent) {
      return NextResponse.redirect(`${origin}/select-role`)
    }
  }

  // ── 6. Normal redirect ─────────────────────────────────────────────────────
  const safeNext = next.startsWith('/') ? next : '/'
  return NextResponse.redirect(`${origin}${safeNext}`)
}

