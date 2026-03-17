'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { resetPassword } from '@/lib/supabase'
import { Button } from '@/components/ui'

const schema = z.object({ email: z.string().email('Enter a valid email address') })
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    const { error } = await resetPassword(data.email)
    if (error) {
      setError('email', { message: error.message })
      return
    }
    setSentEmail(data.email)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-900/40 border border-primary-700/40">
          <CheckCircle2 className="h-8 w-8 text-primary-400" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-white">Reset link sent!</h2>
        <p className="mt-3 text-sm text-surface-300">
          We sent password reset instructions to{' '}
          <span className="font-medium text-white">{sentEmail}</span>.
          The link expires in 1 hour.
        </p>
        <div className="mt-6 rounded-2xl border border-surface-700 bg-surface-900 p-5 text-left space-y-3">
          <div className="flex items-start gap-3 text-sm">
            <span className="text-xl">📧</span>
            <div>
              <p className="font-medium text-white">Check your spam folder</p>
              <p className="text-surface-400">Sometimes password reset emails end up in spam.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-xl">⏰</span>
            <div>
              <p className="font-medium text-white">Didn&apos;t receive it?</p>
              <button
                onClick={() => setSent(false)}
                className="text-primary-400 hover:text-primary-300"
              >
                Try again with a different email
              </button>
            </div>
          </div>
        </div>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-800 border border-surface-700">
          <Mail className="h-6 w-6 text-primary-400" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-white">Reset your password</h1>
        <p className="mt-2 text-sm text-surface-400">
          Enter your email and we&apos;ll send you a secure reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label htmlFor="fp-email" className="mb-1.5 block text-sm font-medium text-surface-200">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
            <input
              id="fp-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register('email')}
              className={`w-full rounded-xl border bg-surface-800 py-3 pl-10 pr-4 text-sm text-white placeholder-surface-500 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${
                errors.email ? 'border-red-500' : 'border-surface-700'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.email.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Send Reset Link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-surface-400">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </p>
    </div>
  )
}
