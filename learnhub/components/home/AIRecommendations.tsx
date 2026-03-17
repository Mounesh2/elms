"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import CourseCarousel from "./CourseCarousel"
import { SkeletonCarousel } from "./SkeletonCarousel"

export function AIRecommendations() {
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch("/api/ai/recommend", { method: "POST" })
        const data = await res.json()
        setCourses(data)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRecommendations()
  }, [])

  if (!isLoading && courses.length === 0) return null

  return (
    <section className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-sm border border-primary-100">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-6 w-6 text-primary-600 fill-primary-600" />
        <h2 className="text-2xl font-bold text-[#1c1d1f]">Recommended for you</h2>
      </div>
      
      {isLoading ? (
        <SkeletonCarousel />
      ) : (
        <CourseCarousel courses={courses} />
      )}
    </section>
  )
}
