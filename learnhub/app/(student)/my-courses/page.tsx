"use client"

import { useState, useEffect } from "react"
import { Search, PlayCircle, BookOpen } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface EnrolledCourse {
  id: string
  title: string
  slug: string
  thumbnailUrl: string | null
  instructor: { name: string }
  progress: number
  lastLectureId?: string | null
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all')

  useEffect(() => {
    fetch("/api/user/enrolled-courses")
      .then(r => r.json())
      .then(data => Array.isArray(data) ? setCourses(data) : setCourses([]))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase())
    if (filter === 'in-progress') return matchSearch && c.progress > 0 && c.progress < 100
    if (filter === 'completed') return matchSearch && c.progress === 100
    return matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#1c1d1f]">My Learning</h1>
        <p className="text-surface-500 text-sm mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''} enrolled</p>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-1 bg-white border border-surface-200 rounded-lg p-1">
          {(['all', 'in-progress', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all capitalize",
                filter === f
                  ? "bg-[#1c1d1f] text-white"
                  : "text-surface-500 hover:text-[#1c1d1f]"
              )}
            >
              {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : 'Completed'}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-white border border-surface-200 rounded-lg focus:outline-none focus:border-[#1c1d1f] text-sm"
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-3 bg-white rounded-xl p-3">
              <div className="aspect-video bg-surface-100 rounded-lg" />
              <div className="h-4 bg-surface-100 rounded w-3/4" />
              <div className="h-3 bg-surface-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-xl border border-surface-200 space-y-4">
          <BookOpen className="w-14 h-14 mx-auto text-surface-300" />
          <p className="text-surface-600 font-medium">
            {courses.length === 0 ? "You haven't enrolled in any courses yet." : "No courses match your search."}
          </p>
          <Link href="/courses" className="inline-block px-6 py-3 bg-[#1c1d1f] text-white font-bold hover:bg-surface-800 transition-all rounded-lg">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(course => (
            <div key={course.id} className="group bg-white border border-surface-200 rounded-xl overflow-hidden hover:shadow-md hover:border-primary-200 transition-all flex flex-col">
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-surface-100">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-surface-300 font-bold text-2xl">LH</div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                    <PlayCircle className="h-7 w-7 text-[#1c1d1f]" />
                  </div>
                </div>
                {course.progress === 100 && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ✓ Completed
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-sm font-bold text-[#1c1d1f] line-clamp-2 leading-tight mb-1 group-hover:text-primary-700 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-surface-500 truncate mb-4">{course.instructor?.name}</p>

                {/* Progress */}
                <div className="mt-auto space-y-1.5 mb-3">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-surface-500">Progress</span>
                    <span className={course.progress === 100 ? 'text-green-600' : 'text-[#1c1d1f]'}>
                      {Math.round(course.progress || 0)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", course.progress === 100 ? "bg-green-500" : "bg-primary-600")}
                      style={{ width: `${course.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/learn/${course.slug}/${course.lastLectureId || 'default'}`}
                  className="w-full py-2.5 text-center text-sm font-bold bg-[#1c1d1f] text-white hover:bg-surface-800 transition-all rounded-lg"
                >
                  {course.progress === 0 ? 'Start Learning' : course.progress === 100 ? 'Review Course' : 'Continue Learning'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
