'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Progress, CourseProgress } from '@/types'

export function useProgress(userId: string | undefined, courseId: string | undefined) {
  const [progress, setProgress] = useState<Progress[]>([])
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !courseId) { setLoading(false); return }

    supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .then(({ data }) => {
        const items = (data as Progress[]) ?? []
        setProgress(items)

        supabase
          .from('courses')
          .select('total_lectures')
          .eq('id', courseId)
          .single()
          .then(({ data: course }) => {
            const totalLectures = course?.total_lectures ?? 0
            const completed = items.filter((p) => p.is_completed).length
            setCourseProgress({
              course_id: courseId,
              total_lectures: totalLectures,
              completed_lectures: completed,
              percent_complete: totalLectures > 0 ? Math.round((completed / totalLectures) * 100) : 0,
              last_lecture_id: items[items.length - 1]?.lecture_id,
              last_accessed_at: items[items.length - 1]?.updated_at,
            })
            setLoading(false)
          })
      })
  }, [userId, courseId])

  const markComplete = useCallback(async (lectureId: string) => {
    if (!userId || !courseId) return
    const { data } = await supabase
      .from('progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        lecture_id: lectureId,
        is_completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lecture_id' })
      .select()
      .single()

    if (data) {
      setProgress((prev) => {
        const idx = prev.findIndex((p) => p.lecture_id === lectureId)
        if (idx >= 0) { const next = [...prev]; next[idx] = data as Progress; return next }
        return [...prev, data as Progress]
      })
    }
  }, [userId, courseId])

  const updateWatchTime = useCallback(async (lectureId: string, seconds: number, position: number) => {
    if (!userId || !courseId) return
    await supabase
      .from('progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        lecture_id: lectureId,
        watch_time_seconds: seconds,
        last_position_seconds: position,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lecture_id' })
  }, [userId, courseId])

  const isLectureCompleted = useCallback((lectureId: string) => {
    return progress.some((p) => p.lecture_id === lectureId && p.is_completed)
  }, [progress])

  return { progress, courseProgress, loading, markComplete, updateWatchTime, isLectureCompleted }
}
