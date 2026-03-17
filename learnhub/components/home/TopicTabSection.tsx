"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import CourseCarousel from "./CourseCarousel"
import { SkeletonCarousel } from "./SkeletonCarousel"

interface TopicTabSectionProps {
  initialCategories: any[]
}

export function TopicTabSection({ initialCategories }: TopicTabSectionProps) {
  const [activeTab, setActiveTab] = useState(initialCategories[0]?.id)
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [cache, setCache] = useState<Record<string, any[]>>({})

  const fetchCategoryCourses = async (categoryId: string) => {
    if (cache[categoryId]) {
      setCourses(cache[categoryId])
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/courses?categoryId=${categoryId}&limit=10`)
      const data = await res.json()
      setCourses(data)
      setCache(prev => ({ ...prev, [categoryId]: data }))
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabClick = (categoryId: string) => {
    setActiveTab(categoryId)
    fetchCategoryCourses(categoryId)
  }

  // Initial fetch for first tab
  useState(() => {
    if (initialCategories[0]) fetchCategoryCourses(initialCategories[0].id)
  })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#1c1d1f] mb-2">What to learn next</h2>
        <div className="flex items-center gap-6 border-b border-surface-200 overflow-x-auto no-scrollbar">
            {initialCategories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => handleTabClick(cat.id)}
                    className={cn(
                        "pb-3 text-sm font-bold whitespace-nowrap transition-all border-b-2",
                        activeTab === cat.id 
                            ? "text-[#1c1d1f] border-[#1c1d1f]" 
                            : "text-surface-500 border-transparent hover:text-[#1c1d1f]"
                    )}
                >
                    {cat.name}
                </button>
            ))}
        </div>
      </div>

      <div className="min-h-[300px]">
        {isLoading ? (
            <SkeletonCarousel />
        ) : (
            <CourseCarousel courses={courses} />
        )}
      </div>
    </div>
  )
}
