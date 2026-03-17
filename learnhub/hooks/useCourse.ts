'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Course, Section } from '@/types'

export function useCourse(slugOrId: string) {
  const [course, setCourse] = useState<Course & { sections?: Section[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slugOrId) return
    const isUUID = /^[0-9a-f-]{36}$/i.test(slugOrId)
    const column = isUUID ? 'id' : 'slug'

    supabase
      .from('courses')
      .select(`*, instructor:users!instructor_id(*), category:categories!category_id(*), sections:sections(*, lectures:lectures(*))`)
      .eq(column, slugOrId)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setCourse(data as Course & { sections?: Section[] })
        setLoading(false)
      })
  }, [slugOrId])

  return { course, loading, error }
}

export function useCourses(filters?: {
  category?: string
  level?: string
  limit?: number
  offset?: number
}) {
  const [courses, setCourses] = useState<Course[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let query = supabase
      .from('courses')
      .select('*, instructor:users!instructor_id(id, full_name, avatar_url), category:categories!category_id(id, name, slug)', { count: 'exact' })
      .eq('status', 'published')

    if (filters?.category) query = query.eq('category_id', filters.category)
    if (filters?.level) query = query.eq('level', filters.level)
    if (filters?.limit) query = query.limit(filters.limit)
    if (filters?.offset) query = query.range(filters.offset, (filters.offset + (filters.limit ?? 10)) - 1)

    query.then(({ data, error: err, count }) => {
      if (err) setError(err.message)
      else { setCourses(data as Course[]); setTotal(count ?? 0) }
      setLoading(false)
    })
  }, [filters?.category, filters?.level, filters?.limit, filters?.offset])

  return { courses, total, loading, error }
}
