'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, StarRating } from '@/components/ui'
import { Play, Loader2 } from 'lucide-react'
import { formatPrice, formatCount } from '@/lib/utils'

export default function CourseLandingClient({ course, isEnrolled: initialEnrolled }: { course: any, isEnrolled: boolean }) {
  const router = useRouter()
  const [isEnrolled, setIsEnrolled] = useState(initialEnrolled)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEnroll = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id })
      })
      const data = await res.json()

      if (res.status === 401) {
        router.push('/login')
        return
      }
      if (!res.ok) {
        setError(data.error || 'Enrollment failed')
        return
      }

      setIsEnrolled(true)
      router.push(`/learn/${course.slug}/default`)
    } catch (e) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const goToCourse = () => router.push(`/learn/${course.slug}/default`)

  return (
    <>
      {/* Sticky top bar */}
      <div className="sticky top-0 z-50 hidden border-b border-surface-800 bg-surface-950/90 backdrop-blur-md px-4 py-3 xl:block shadow-md">
        <div className="container flex items-center justify-between mx-auto">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <h3 className="text-white font-bold truncate max-w-xl">{course.title}</h3>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 font-bold">{Number(course.averageRating || 0).toFixed(1)}</span>
              <StarRating rating={Number(course.averageRating || 0)} />
              <span className="text-surface-400 text-sm">({formatCount(course.totalReviews || 0)} ratings)</span>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="font-bold text-white text-xl">{course.isFree ? 'Free' : formatPrice(course.price)}</div>
            {isEnrolled ? (
              <Button onClick={goToCourse}><Play className="w-4 h-4 mr-2" /> Continue Learning</Button>
            ) : (
              <Button onClick={handleEnroll} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                Enroll Now
              </Button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl text-sm font-bold">
          {error}
        </div>
      )}
    </>
  )
}
