'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { supabase, updatePassword } from '@/lib/supabase'
import { Button } from '@/components/ui'
import toast from 'react-hot-toast'

const schema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Include at least one uppercase letter')
    .regex(/[0-9]/, 'Include at least one number'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [showPass,    setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [hasSession,  setHasSession]  = useState(false)
  const [done,        setDone]        = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) })

  // Only render form if the user has a valid recovery session
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setHasSession(true)
    })
  }, [])

  async function onSubmit(data: FormData) {
    const { error } = await updatePassword(data.password)
    if (error) { toast.error(error.message); return }
    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2500)
  }

  if (done) return (
    <div className="w-full max-w-md text-center">
      <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-400" />
      <h2 className="font-heading text-2xl font-bold text-white">Password updated!</h2>
      <p className="mt-2 text-surface-400">Redirecting you to your dashboard…</p>
    </div>
  )

  if (!hasSession) return (
    <div className="w-full max-w-md text-center">
      <AlertCircle className="mx-auto mb-4 h-12 w-12 text-yellow-400" />
      <h2 className="font-heading text-2xl font-bold text-white">Link expired or invalid</h2>
      <p className="mt-2 text-surface-400">Password reset links expire after 1 hour.</p>
      <a href="/forgot-password" className="mt-4 inline-block text-sm text-primary-400 hover:text-primary-300">
        Request a new link →
      </a>
    </div>
  )

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-white">Set new password</h1>
        <p className="mt-2 text-sm text-surface-400">Choose a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label htmlFor="new-pass" className="mb-1.5 block text-sm font-medium text-surface-200">New Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
            <input id="new-pass" type={showPass ? 'text' : 'password'} autoComplete="new-password"
              placeholder="Min. 8 characters" {...register('password')}
              className={`w-full rounded-xl border bg-surface-800 py-3 pl-10 pr-10 text-sm text-white placeholder-surface-500 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${errors.password ? 'border-red-500' : 'border-surface-700'}`}
            />
            <button type="button" onClick={() => setShowPass(p => !p)} tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white">
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400"><AlertCircle className="h-3.5 w-3.5" />{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="conf-pass" className="mb-1.5 block text-sm font-medium text-surface-200">Confirm New Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
            <input id="conf-pass" type={showConfirm ? 'text' : 'password'} autoComplete="new-password"
              placeholder="Repeat your password" {...register('confirmPassword')}
              className={`w-full rounded-xl border bg-surface-800 py-3 pl-10 pr-10 text-sm text-white placeholder-surface-500 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${errors.confirmPassword ? 'border-red-500' : 'border-surface-700'}`}
            />
            <button type="button" onClick={() => setShowConfirm(p => !p)} tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white">
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400"><AlertCircle className="h-3.5 w-3.5" />{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Update Password
        </Button>
      </form>
    </div>
  )
}
