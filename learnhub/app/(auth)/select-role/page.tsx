'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, BookOpen, Mic2, ArrowRight, Check } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { supabase, updateProfile } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function SelectRolePage() {
  const router = useRouter()
  const [role, setRole] = useState<'student' | 'instructor' | null>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
    }
    checkUser()
  }, [router])

  async function handleConfirm() {
    if (!role || !user) return
    setLoading(true)

    try {
      const { error } = await updateProfile(user.id, {
        role: role,
        is_instructor: role === 'instructor',
      })

      if (error) throw error

      toast.success(`Welcome aboard as a ${role}!`)
      
      if (role === 'instructor') {
        router.push('/instructor/setup')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 shadow-glow">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-white mb-4">How do you want to use LearnHub?</h1>
          <p className="text-lg text-surface-400">Choose your primary role to customize your experience.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Card */}
          <button
            onClick={() => setRole('student')}
            className={`group relative flex flex-col items-center p-8 rounded-3xl border-2 transition-all duration-300 text-center ${
              role === 'student'
                ? 'border-primary-500 bg-primary-900/20 shadow-[0_0_30px_rgba(var(--primary-500-rgb),0.2)]'
                : 'border-surface-800 bg-surface-900 hover:border-surface-700'
            }`}
          >
            <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300 ${
              role === 'student' ? 'bg-primary-500 text-white' : 'bg-surface-800 text-surface-400'
            }`}>
              <BookOpen className="h-10 w-10" />
            </div>
            <h3 className={`text-2xl font-bold mb-2 transition-colors ${role === 'student' ? 'text-white' : 'text-surface-200'}`}>I want to Learn</h3>
            <p className="text-surface-400 text-sm leading-relaxed">Access thousands of courses, track your progress, and earn certificates.</p>
            
            {role === 'student' && (
              <div className="absolute top-4 right-4 h-6 w-6 bg-primary-500 rounded-full flex items-center justify-center animate-in zoom-in">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </button>

          {/* Instructor Card */}
          <button
            onClick={() => setRole('instructor')}
            className={`group relative flex flex-col items-center p-8 rounded-3xl border-2 transition-all duration-300 text-center ${
              role === 'instructor'
                ? 'border-indigo-500 bg-indigo-900/20 shadow-[0_0_30px_rgba(var(--indigo-500-rgb),0.2)]'
                : 'border-surface-800 bg-surface-900 hover:border-surface-700'
            }`}
          >
            <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300 ${
              role === 'instructor' ? 'bg-indigo-500 text-white' : 'bg-surface-800 text-surface-400'
            }`}>
              <Mic2 className="h-10 w-10" />
            </div>
            <h3 className={`text-2xl font-bold mb-2 transition-colors ${role === 'instructor' ? 'text-white' : 'text-surface-200'}`}>I want to Teach</h3>
            <p className="text-surface-400 text-sm leading-relaxed">Share your expertise, build an audience, and earn income by teaching.</p>
            
            {role === 'instructor' && (
              <div className="absolute top-4 right-4 h-6 w-6 bg-indigo-500 rounded-full flex items-center justify-center animate-in zoom-in">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </button>
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            size="lg"
            className="px-12 py-6 text-lg rounded-2xl group shadow-glow"
            disabled={!role || loading}
            loading={loading}
            onClick={handleConfirm}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-surface-500">
          You can always change your role or add capabilities later in settings.
        </p>
      </div>
    </div>
  )
}
