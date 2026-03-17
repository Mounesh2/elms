'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { Play, Loader2, ShoppingCart } from 'lucide-react'

interface Props {
  courseId: string
  courseSlug: string
  isEnrolled: boolean
  isFree: boolean
}

export default function EnrollButton({ courseId, courseSlug, isEnrolled: initial, isFree }: Props) {
  const router = useRouter()
  const [isEnrolled, setIsEnrolled] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEnroll = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      })

      if (res.status === 401) { router.push('/login'); return }

      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Enrollment failed'); return }

      setIsEnrolled(true)
      router.push(`/learn/${courseSlug}/default`)
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (isEnrolled) {
    return (
      <Button size="lg" className="w-full text-lg py-4 h-auto" onClick={() => router.push(`/learn/${courseSlug}/default`)}>
        <Play className="w-5 h-5 mr-2" /> Continue Learning
      </Button>
    )
  }

  return (
    <div className="space-y-3">
      <Button size="lg" className="w-full text-lg py-4 h-auto shadow-xl shadow-primary-900/20" onClick={handleEnroll} disabled={loading}>
        {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : isFree ? <Play className="w-5 h-5 mr-2" /> : <ShoppingCart className="w-5 h-5 mr-2" />}
        {isFree ? 'Enroll for Free' : 'Add to Cart'}
      </Button>
      {!isFree && (
        <Button variant="outline" size="lg" className="w-full" onClick={handleEnroll} disabled={loading}>
          Buy Now
        </Button>
      )}
      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
    </div>
  )
}
