/**
 * lib/supabase.ts  — CLIENT-SIDE ONLY
 * ─────────────────────────────────────────────────────────────────
 * Safe to import from both 'use client' components and server code
 * that does NOT need cookie-based session management.
 *
 * For Server Components / Route Handlers that need cookie sessions,
 * import from '@/lib/supabase-server' instead.
 * ─────────────────────────────────────────────────────────────────
 */
import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON_KEY     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('[Supabase] Missing environment variables. Auth will fail.')
}
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-key'
const APP_URL      = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3004'

// ─── 1. Browser singleton (use client components + hooks) ─────────────────────
let _client: ReturnType<typeof createClient> | null = null

export function getBrowserClient() {
  if (typeof window === 'undefined') {
    return createClient(SUPABASE_URL, ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  if (!_client) {
    _client = createBrowserClient(SUPABASE_URL, ANON_KEY)
  }
  return _client
}

export const supabase = getBrowserClient()

// ─── 2. Admin client (service-role, server-only, no cookie needed) ────────────
export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ─────────────────────────────────────────────────────────────────────────────
// AUTH HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: 'student' | 'instructor' = 'student',
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role, is_instructor: role === 'instructor' },
      emailRedirectTo: `${APP_URL}/api/auth/callback`,
    },
  })
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signInWithMagicLink(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${APP_URL}/api/auth/callback` },
  })
}

export async function signInWithOAuth(
  provider: 'google' | 'github',
  intent?: 'instructor',
) {
  const origin = typeof window !== 'undefined' ? window.location.origin : APP_URL
  const redirectTo = `${origin}/api/auth/callback${intent ? `?intent=${intent}` : ''}`
  
  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      scopes: provider === 'github' ? 'user:email' : 'email profile',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${APP_URL}/auth/update-password`,
  })
}

export async function updatePassword(newPassword: string) {
  return supabase.auth.updateUser({ password: newPassword })
}

export async function resendVerification(email: string) {
  return supabase.auth.resend({ type: 'signup', email })
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export type Profile = {
  id: string
  email: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  bio: string | null
  headline: string | null
  website_url: string | null
  twitter_url: string | null
  linkedin_url: string | null
  role: 'student' | 'instructor' | 'admin'
  is_instructor: boolean
  is_admin: boolean
  is_banned: boolean
  total_courses_enrolled: number
  total_courses_created: number
  stripe_customer_id: string | null
  stripe_connect_id: string | null
  payout_enabled: boolean
  created_at: string
  updated_at: string
}

export async function getProfile(userId: string) {
  return supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single<Profile>()
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'email' | 'created_at'>>,
) {
  return supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single<Profile>()
}

export async function upgradeToInstructor(userId: string) {
  return supabase
    .from('profiles')
    .update({ role: 'instructor', is_instructor: true, updated_at: new Date().toISOString() })
    .eq('id', userId)
}

// ─── CATEGORY HELPERS ─────────────────────────────────────────────────────────
export async function getCategories() {
  return supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
}

// ─────────────────────────────────────────────────────────────────────────────
// COURSE / ENROLLMENT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export async function getCourseBySlug(slug: string) {
  return supabase
    .from('courses')
    .select(`
      *,
      instructor:profiles!instructor_id(id, full_name, avatar_url, headline, bio),
      category:categories!category_id(id, name, slug),
      sections(*, lectures(id, title, type, duration_seconds, is_free_preview, is_published, sort_order))
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
}

export async function getCourses(filters?: {
  category_id?: string
  level?: string
  is_free?: boolean
  instructor_id?: string
  limit?: number
  offset?: number
}) {
  let q = supabase
    .from('courses')
    .select('*, instructor:profiles!instructor_id(id, full_name, avatar_url)', { count: 'exact' })
    .eq('is_published', true)

  if (filters?.category_id)    q = q.eq('category_id', filters.category_id)
  if (filters?.level)          q = q.eq('level', filters.level)
  if (filters?.is_free != null) q = q.eq('is_free', filters.is_free)
  if (filters?.instructor_id)  q = q.eq('instructor_id', filters.instructor_id)
  q = q.range(filters?.offset ?? 0, (filters?.offset ?? 0) + (filters?.limit ?? 20) - 1)
  return q.order('total_students', { ascending: false })
}

export async function getUserEnrollments(userId: string) {
  return supabase
    .from('enrollments')
    .select('*, course:courses(id, slug, title, thumbnail_url, total_lectures, total_duration_seconds, average_rating)')
    .eq('user_id', userId)
    .order('enrolled_at', { ascending: false })
}

export async function checkEnrollment(userId: string, courseId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle()
  return { enrolled: !!data && !error, error }
}

export async function getLectureProgress(userId: string, courseId: string) {
  return supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
}
