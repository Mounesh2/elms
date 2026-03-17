import { useSession, signOut as nextSignOut } from "next-auth/react"
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface UseAuthReturn {
  user:        any
  profile:     any
  loading:     boolean
  signOut:     () => Promise<void>
  refreshProfile: () => Promise<void>
  isInstructor:   boolean
  isAdmin:        boolean
  isStudent:      boolean
  initialized:    boolean
}

export function useAuth(): UseAuthReturn {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const signOut = useCallback(async () => {
    await nextSignOut({ redirect: false })
    router.push('/')
    router.refresh()
  }, [router])

  const refreshProfile = useCallback(async () => {
    await update()
  }, [update])

  const user = session?.user || null
  // Map NextAuth user to "profile" for legacy components expecting it
  const profile = session?.user ? {
    id: session.user.id,
    full_name: session.user.name,
    is_instructor: (session.user as any).isInstructor,
    is_admin: (session.user as any).isAdmin,
    avatar_url: session.user.image,
  } : null

  return {
    user,
    profile,
    loading: status === 'loading',
    initialized: status !== 'loading',
    signOut,
    refreshProfile,
    isInstructor: (session?.user as any)?.isInstructor ?? false,
    isAdmin:      (session?.user as any)?.isAdmin ?? false,
    isStudent:    !(session?.user as any)?.isInstructor && !(session?.user as any)?.isAdmin,
  }
}
