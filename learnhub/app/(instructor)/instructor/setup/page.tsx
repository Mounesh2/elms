'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Card, Button, Input } from '@/components/ui'
import { CheckCircle2, ChevronRight, DollarSign, Image as ImageIcon, Map, GraduationCap, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

function InstructorSetupWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, profile, refreshProfile, loading } = useAuth()
  
  const initialStep = Number(searchParams.get('step')) || 1
  const [step, setStep] = useState(initialStep)
  const [submitting, setSubmitting] = useState(false)

  // Step 1 State
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    if (profile) {
      if (profile.headline) setHeadline(profile.headline)
      if (profile.bio) setBio(profile.bio)
    }
  }, [profile])

  if (loading) return null

  // Progress logic
  async function saveStep1() {
    if (!headline || !bio) {
      toast.error('Please fill in your headline and bio')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline, bio }),
      })
      if (!res.ok) throw new Error('Failed to save')
      await refreshProfile()
      setStep(2)
    } catch (err: unknown) {
      toast.error((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  async function connectStripe() {
    setSubmitting(true)
    try {
      const res = await fetch('/api/instructor/stripe-connect', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url // Redirect to Stripe onboarding
    } catch (err: unknown) {
      toast.error((err as Error).message)
      setSubmitting(false)
    }
  }

  async function finishSetup() {
    // Note: The actual webhook sets payout_enabled=true when Stripe onboarding is finished
    router.push('/instructor/dashboard')
    toast.success('Welcome to your Instructor Dashboard!')
  }

  const steps = [
    { num: 1, title: 'Profile details', icon: ImageIcon },
    { num: 2, title: 'Teaching experience', icon: GraduationCap },
    { num: 3, title: 'Payout setup', icon: DollarSign },
  ]

  return (
    <div className="max-w-3xl mx-auto py-8">
      
      {/* ── Header ── */}
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-bold text-white">Complete your instructor profile</h1>
        <p className="mt-2 text-surface-400">Set up your public presence and get ready to receive payments.</p>
      </div>

      {/* ── Progress Bar ── */}
      <div className="mb-8 flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.num} className="flex flex-1 items-center">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
              step > s.num ? 'bg-green-500 border-green-500 text-white' : 
              step === s.num ? 'border-primary-500 bg-primary-900/40 text-primary-400' : 
              'border-surface-700 bg-surface-800 text-surface-500'
            }`}>
              {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
            </div>
            {i < steps.length - 1 && (
              <div className={`h-1 flex-1 mx-4 rounded-full transition-colors ${step > s.num ? 'bg-green-500' : 'bg-surface-800'}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 1: Profile ── */}
      {step === 1 && (
        <Card className="p-8 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl font-bold text-white mb-6">Tell students about yourself</h2>
          <div className="space-y-6">
            <Input 
              label="Professional Headline" 
              placeholder="e.g. Senior Software Engineer at Tech Corp" 
              value={headline} 
              onChange={(e) => setHeadline(e.target.value)} 
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-200">Instructor Bio</label>
              <textarea
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your background, experience, and what makes you a great instructor..."
                className="w-full rounded-xl border border-surface-700 bg-surface-800 p-3 text-sm text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <Button onClick={saveStep1} loading={submitting}>Continue <ChevronRight className="ml-1 h-4 w-4" /></Button>
          </div>
        </Card>
      )}

      {/* ── Step 2: Experience ── */}
      {step === 2 && (
        <Card className="p-8 animate-in fade-in slide-in-from-right-8">
          <h2 className="text-xl font-bold text-white mb-6">What is your teaching experience?</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {['In person, informally', 'In person, professionally', 'Online', 'Other'].map(opt => (
              <button key={opt} className="rounded-xl border border-surface-700 bg-surface-800 p-4 text-left hover:border-primary-500 hover:bg-primary-900/20 transition-all">
                <p className="font-medium text-white">{opt}</p>
              </button>
            ))}
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Continue <ChevronRight className="ml-1 h-4 w-4" /></Button>
          </div>
        </Card>
      )}

      {/* ── Step 3: Payouts ── */}
      {step === 3 && (
        <Card className="p-8 animate-in fade-in slide-in-from-right-8">
          <h2 className="text-xl font-bold text-white mb-2">Set up payouts</h2>
          <p className="text-surface-400 mb-8">Connect with Stripe to receive payments securely into your bank account.</p>
          
          <div className="rounded-2xl border border-surface-700 bg-surface-800/50 p-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20">
              <DollarSign className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Stripe Connect Express</h3>
            <p className="text-sm text-surface-400 mb-6 max-w-sm">
              We partner with Stripe for secure and fast payouts. You&apos;ll be redirected to Stripe to verify your identity and add your bank details.
            </p>
            <Button onClick={connectStripe} loading={submitting} className="bg-indigo-500 hover:bg-indigo-600">
              Connect with Stripe
            </Button>
            <p className="mt-4 text-xs text-surface-500">
              You can always do this later from your Revenue settings.
            </p>
          </div>

          <div className="mt-8 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
            <Button variant="outline" onClick={() => setStep(4)}>Skip for now</Button>
          </div>
        </Card>
      )}

      {/* ── Step 4: Done ── */}
      {step === 4 && (
        <Card className="p-10 text-center animate-in zoom-in-95">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">You&apos;re all set!</h2>
          <p className="text-surface-400 mb-8 max-w-sm mx-auto">
            Your instructor profile is ready. You can now start creating your first course and building your curriculum.
          </p>
          <Button size="lg" onClick={finishSetup} className="w-full sm:w-auto">
            Go to Instructor Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      )}

    </div>
  )
}

export default function InstructorSetupPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><span className="text-surface-400">Loading setup...</span></div>}>
      <InstructorSetupWizard />
    </Suspense>
  )
}
