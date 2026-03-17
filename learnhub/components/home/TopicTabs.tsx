'use client'
import { useState, useEffect } from 'react'
import { getCategories, getCourses } from '@/lib/supabase'
import CourseCarousel from './CourseCarousel'
import { Spinner } from '@/components/ui'
import { cn } from '@/lib/utils'

export default function TopicTabs() {
  const [categories, setCategories] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [coursesLoading, setCoursesLoading] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        if (data && data.length > 0) {
          setCategories(data)
          setActiveTab(data[0].id)
        }
      } catch (e) {
        console.error('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  useEffect(() => {
    async function fetchTabCourses() {
      if (!activeTab) return
      setCoursesLoading(true)
      try {
        const res = await fetch(`/api/courses?categoryId=${activeTab}&isPublished=true`)
        const data = await res.json()
        setCourses(data || [])
      } catch (e) {
        console.error('Failed to load courses')
      } finally {
        setCoursesLoading(false)
      }
    }
    fetchTabCourses()
  }, [activeTab])

  if (loading) return <div className="h-64 flex items-center justify-center"><Spinner /></div>

  const activeCategory = categories.find(c => c.id === activeTab)

  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#1c1d1f] mb-2">Skills to transform your career and life</h2>
        <p className="text-lg text-surface-500 mb-8 max-w-3xl">
          From critical skills to technical topics, LearnHub supports your professional development.
        </p>

        {/* Tab Navigation */}
        <div className="border-b border-surface-200 mb-8">
            <div className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={cn(
                            "pb-3 text-base font-bold transition-all border-b-2 whitespace-nowrap",
                            activeTab === cat.id 
                                ? "border-[#1c1d1f] text-[#1c1d1f]" 
                                : "border-transparent text-surface-500 hover:text-[#1c1d1f]"
                        )}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>

        {/* Active Tab Content */}
        <div className="animate-fade-in">
            {activeCategory && (
                <div className="mb-8 p-8 border border-surface-200 rounded-sm">
                    <h3 className="text-2xl font-bold mb-4">{activeCategory.name}</h3>
                    <p className="text-surface-600 mb-6 max-w-2xl">
                        {activeCategory.description || `Explore thousands of ${activeCategory.name} courses to build your skills and advance your career.`}
                    </p>
                    <button className="px-6 py-2.5 border border-[#1c1d1f] text-[#1c1d1f] font-bold hover:bg-surface-50 transition-colors">
                        Explore {activeCategory.name}
                    </button>
                </div>
            )}

            {coursesLoading ? (
                <div className="h-64 flex items-center justify-center"><Spinner /></div>
            ) : (
                <CourseCarousel courses={courses} />
            )}
        </div>
      </div>
    </section>
  )
}
