/**
 * lib/supabase-server.ts — SERVER ONLY
 * ─────────────────────────────────────────────────────────────────
 * Import ONLY from Server Components, Route Handlers, and
 * middleware.ts. Do NOT import from 'use client' components.
 *
 * Uses cookies() from next/headers so the server client can
 * read and refresh the Supabase session automatically.
 * ─────────────────────────────────────────────────────────────────
 */
import { createServerClient as createSSR, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerClient() {
  const cookieStore = cookies()

  return createSSR(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }) } catch { /* Server Components can't set cookies */ }
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }) } catch { /* same */ }
        },
      },
    },
  )
}

/** Get authenticated user in a Server Component or Route Handler. */
export async function getServerUser() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/** Get full profile for the authenticated user (server-side). */
export async function getServerProfile() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  return data
}
