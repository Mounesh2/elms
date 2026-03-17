'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import CourseCard from '@/components/course/CourseCard'
import { Button, Input } from '@/components/ui'
import type { Course } from '@/types'
import { 
  Search, SlidersHorizontal, LayoutGrid, List, ChevronRight,
  MonitorPlay, Star, Tag, Layers, Clock, Check, Loader2, X
} from 'lucide-react'
import { debounce } from '@/lib/utils'

const RATINGS = [4.5, 4.0, 3.5, 3.0]
const LEVELS = ['all-levels', 'beginner', 'intermediate', 'advanced']
const DURATIONS = [
  { label: '0-1 Hours', min: 0, max: 3600 },
  { label: '1-3 Hours', min: 3600, max: 10800 },
  { label: '3-6 Hours', min: 10800, max: 21600 },
  { label: '6-17 Hours', min: 21600, max: 61200 },
  { label: '17+ Hours', min: 61200, max: null }
]
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Hindi']
const TOPICS = ['Python', 'Web Development', 'React', 'JavaScript', 'Data Science', 'Machine Learning', 'AWS', 'Design']

// Extracted search filters
function CoursesCatalogContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Current State
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  
  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  
  // Active Filters
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'highest-rated'
  const rating = Number(searchParams.get('rating')) || 0
  const levelParams = searchParams.get('levels')?.split(',') || []
  const priceParam = searchParams.get('price') || 'all' // all, free, paid

  useEffect(() => {
    fetchCourses()
  }, [searchParams])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      const response = await fetch(`/api/courses/search?${params.toString()}`)
      const data = await response.json()
      
      setCourses(data)
      setTotalCount(data.length) // Our current mock API returns all matches up to limit
    } catch (error) {
      console.error("Failed to fetch courses:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle URL updates smoothly
  const updateParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') params.delete(key)
      else params.set(key, value)
    })
    router.push(`/courses?${params.toString()}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debouncedSearch = useMemo(() => debounce((val: any) => updateParams({ q: val }), 400), [])
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    debouncedSearch(e.target.value)
  }

  const toggleLevel = (l: string) => {
    const active = new Set(levelParams)
    if (active.has(l)) active.delete(l)
    else active.add(l)
    updateParams({ levels: Array.from(active).join(',') || null })
  }

  return (
    <div className="min-h-screen bg-surface-950">
      
      {/* Header / Breadcrumb */}
      <div className="border-b border-surface-800 bg-surface-900/50 pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm font-medium text-surface-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">All Courses</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            {q ? `Search results for "${q}"` : 'Explore All Courses'}
          </h1>
          <p className="mt-2 text-surface-400">Join millions of learners from around the world.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <Button variant="outline" onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}>
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
          </Button>
          <div className="text-sm text-surface-400">{totalCount} results</div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR FILTERS */}
          <aside className={`w-full lg:w-64 shrink-0 space-y-8 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            
            {/* Search within results */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
                <input 
                  type="text" 
                  placeholder="Search courses..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full rounded-xl border border-surface-700 bg-surface-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-surface-500 outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div className="h-px bg-surface-800" />

            {/* Ratings Filter */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white flex items-center gap-2"><Star className="w-4 h-4 text-primary-400" /> Ratings</h3>
              <div className="space-y-3">
                {RATINGS.map(r => (
                  <label key={r} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${rating === r ? 'border-primary-500' : 'border-surface-600 group-hover:border-surface-400'}`}>
                      {rating === r && <div className="h-2 w-2 rounded-full bg-primary-500" />}
                    </div>
                    <input type="radio" className="hidden" checked={rating === r} onChange={() => updateParams({ rating: r.toString() })} />
                    <span className="flex items-center gap-1 text-sm text-surface-300 group-hover:text-white">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {r.toFixed(1)} & up
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-surface-800" />

            {/* Level Filter */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white flex items-center gap-2"><Layers className="w-4 h-4 text-primary-400" /> Level</h3>
              <div className="space-y-3">
                {LEVELS.map(l => {
                  const isChecked = levelParams.includes(l);
                  return (
                    <label key={l} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`flex h-4 w-4 items-center justify-center rounded border ${isChecked ? 'border-primary-500 bg-primary-500' : 'border-surface-600 group-hover:border-surface-400'}`}>
                        {isChecked && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleLevel(l)} />
                      <span className="text-sm text-surface-300 group-hover:text-white capitalize">{l.replace('-', ' ')}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="h-px bg-surface-800" />

            {/* Price Filter */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white flex items-center gap-2"><Tag className="w-4 h-4 text-primary-400" /> Price</h3>
              <div className="space-y-3">
                {['all', 'free', 'paid'].map(p => (
                  <label key={p} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${priceParam === p ? 'border-primary-500' : 'border-surface-600 group-hover:border-surface-400'}`}>
                      {priceParam === p && <div className="h-2 w-2 rounded-full bg-primary-500" />}
                    </div>
                    <input type="radio" className="hidden" checked={priceParam === p} onChange={() => updateParams({ price: p === 'all' ? null : p })} />
                    <span className="text-sm text-surface-300 group-hover:text-white capitalize">{p}</span>
                  </label>
                ))}
              </div>
            </div>

            {(q || rating > 0 || levelParams.length > 0 || priceParam !== 'all') && (
              <Button variant="outline" className="w-full text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => router.push('/courses')}>
                Clear Filters
              </Button>
            )}

          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0">
            
            {/* Toolbar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="hidden lg:block text-sm font-medium text-surface-200">{totalCount} course{totalCount !== 1 && 's'} found</div>
              
              <div className="flex items-center gap-4 ml-auto">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-surface-400">Sort by:</label>
                  <select 
                    value={sort}
                    onChange={(e) => updateParams({ sort: e.target.value })}
                    className="rounded-lg border border-surface-700 bg-surface-800 px-3 py-1.5 text-sm text-white outline-none focus:border-primary-500"
                  >
                    <option value="highest-rated">Highest Rated</option>
                    <option value="most-reviewed">Most Reviewed</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                <div className="hidden sm:flex items-center gap-1 rounded-lg border border-surface-700 bg-surface-800 p-1">
                  <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'bg-surface-700 text-white rounded p-1' : 'text-surface-400 hover:text-white p-1'}><List className="h-4 w-4" /></button>
                  <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'bg-surface-700 text-white rounded p-1' : 'text-surface-400 hover:text-white p-1'}><LayoutGrid className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            {/* Courses Grid/List */}
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            ) : totalCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <MonitorPlay className="h-16 w-16 text-surface-700 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
                <p className="text-surface-400 max-w-sm mb-6">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                <Button onClick={() => router.push('/courses')} variant="outline">Clear all filters</Button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
              }>
                {courses.map(course => (
                   <CourseCard 
                      key={course.id} 
                      course={course as any} 
                      variant={(viewMode === 'grid' ? 'default' : 'horizontal') as any}
                   />
                ))}
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  )
}

export default function CoursesCatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface-950"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>}>
      <CoursesCatalogContent />
    </Suspense>
  )
}
