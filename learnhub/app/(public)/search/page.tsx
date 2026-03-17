'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import CourseCard from '@/components/course/CourseCard'
import { Button, Input } from '@/components/ui'
import type { Course } from '@/types'
import { 
  Search, SlidersHorizontal, LayoutGrid, List, ChevronRight,
  MonitorPlay, Star, Tag, Layers, Clock, Check, Loader2
} from 'lucide-react'
import { debounce } from '@/lib/utils'

const RATINGS = [4.5, 4.0, 3.5, 3.0]
const LEVELS = ['all-levels', 'beginner', 'intermediate', 'advanced']
const TOPICS = ['Python', 'Web Development', 'React', 'JavaScript', 'Data Science', 'Machine Learning', 'AWS', 'Design']

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Current State
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  
  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  
  // Active Filters
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'relevance'
  const rating = Number(searchParams.get('rating')) || 0
  const levelParams = searchParams.get('level')?.split(',') || []
  const isFree = searchParams.get('free')

  // Search input state for the "Instant search with debounce"
  const [searchQuery, setSearchQuery] = useState(q)

  useEffect(() => {
    // Update local state if URL changes externally
    setSearchQuery(searchParams.get('q') || '')
    fetchCourses()
  }, [searchParams])

  const fetchCourses = async () => {
    setLoading(true)
    
    // Construct query parameters
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    if (levelParams.length > 0) params.set('level', levelParams[0]) // APi takes single level for now
    if (isFree) params.set('free', isFree)
    if (sort) params.set('sort', sort)
    params.set('limit', '20')

    try {
      const res = await fetch(`/api/search?${params.toString()}`)
      if (!res.ok) throw new Error('Search failed')
      const result = await res.json()
      
      setCourses(result.data as unknown as Course[])
      setTotalCount(result.total || 0)
    } catch (err) {
      console.error('Error fetching search results:', err)
      setCourses([])
      setTotalCount(0)
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
    router.push(`/search?${params.toString()}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debouncedSearch = useMemo(() => debounce((val: any) => updateParams({ q: val }), 250), [])
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    debouncedSearch(e.target.value)
  }

  const toggleLevel = (l: string) => {
    const active = new Set(levelParams)
    if (active.has(l)) active.delete(l)
    else active.add(l)
    updateParams({ level: Array.from(active).join(',') || null })
  }

  return (
    <div className="min-h-screen bg-surface-950">
      
      {/* Search Header / Breadcrumb */}
      <div className="border-b border-surface-800 bg-surface-900/50 pt-16 pb-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm font-medium text-surface-400 mb-6 mt-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">Search Results</span>
            {category && (
               <>
                 <ChevronRight className="h-4 w-4 mx-2" />
                 <span className="text-primary-400 capitalize">{category}</span>
               </>
            )}
          </div>
          
          <div className="max-w-3xl relative">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                <input 
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search for anything..."
                  className="w-full rounded-2xl border-2 border-surface-700 bg-surface-800 py-4 pl-14 pr-4 text-xl text-white placeholder-surface-500 shadow-xl transition-all focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20"
                />
             </div>

             {/* Did You Mean (mock feature demonstration based on result count) */}
             {!loading && totalCount === 0 && q.length > 3 && (
               <p className="mt-4 text-surface-300">
                 No results found. Did you mean: <button onClick={() => updateParams({ q: 'python' })} className="text-primary-400 font-semibold hover:underline">python</button>?
               </p>
             )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Mobile Filter Toggle */}
        <div className="flex flex-wrap items-center justify-between mb-6 lg:hidden gap-4">
          <Button variant="outline" onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}>
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
          </Button>
          <div className="text-sm text-surface-400">{totalCount} results</div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR FILTERS */}
          <aside className={`w-full lg:w-64 shrink-0 space-y-8 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            
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

            {/* Duration Filter */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white flex items-center gap-2"><Clock className="w-4 h-4 text-primary-400" /> Video Duration</h3>
              <div className="space-y-3">
                {['0-1hr', '1-3hr', '3-6hr', '6-17hr', '17hr+'].map(d => (
                   <label key={d} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`flex h-4 w-4 items-center justify-center rounded border border-surface-600 group-hover:border-surface-400`}>
                      </div>
                      <input type="checkbox" className="hidden" />
                      <span className="text-sm text-surface-300 group-hover:text-white">{d}</span>
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
                    <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${p === 'all' && !isFree || (p === 'free' && isFree === 'true') || (p === 'paid' && isFree === 'false') ? 'border-primary-500' : 'border-surface-600 group-hover:border-surface-400'}`}>
                      {(p === 'all' && !isFree || (p === 'free' && isFree === 'true') || (p === 'paid' && isFree === 'false')) && <div className="h-2 w-2 rounded-full bg-primary-500" />}
                    </div>
                    <input type="radio" className="hidden" onChange={() => updateParams({ free: p === 'all' ? null : p === 'free' ? 'true' : 'false' })} />
                    <span className="text-sm text-surface-300 group-hover:text-white capitalize">{p}</span>
                  </label>
                ))}
              </div>
            </div>

            {(q || rating > 0 || levelParams.length > 0 || isFree) && (
              <Button variant="outline" className="w-full text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => router.push('/search')}>
                Clear Filters
              </Button>
            )}

          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0">
            
            {/* Toolbar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="hidden lg:block text-lg font-bold text-white">{totalCount} {totalCount === 1 ? 'result' : 'results'} {q && <span className="text-surface-400 font-medium ml-1">for &quot;{q}&quot;</span>}</div>
              
              <div className="flex items-center gap-4 ml-auto">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-surface-400 shrink-0">Sort by:</label>
                  <select 
                    value={sort}
                    onChange={(e) => updateParams({ sort: e.target.value })}
                    className="rounded-lg border border-surface-700 bg-surface-800 px-3 py-1.5 text-sm text-white outline-none focus:border-primary-500"
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popular">Most Reviewed</option>
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
              <div className="flex flex-col items-center justify-center py-32 text-center border-t border-surface-800 mt-4">
                <MonitorPlay className="h-16 w-16 text-surface-700 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">We couldn&apos;t find any exact matches</h3>
                <p className="text-surface-400 max-w-sm mb-6">Try adjusting your search or filters, or broaden your language selection to find what you&apos;re looking for.</p>
                <Button onClick={() => router.push('/search')} variant="outline">Clear all search parameters</Button>
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

            {/* Pagination Placeholder */}
            {!loading && totalCount > 20 && (
              <div className="mt-12 flex justify-center">
                 <Button variant="outline" size="lg" className="w-full sm:w-auto px-12">
                   Load More Results
                 </Button>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface-950"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>}>
      <SearchPageContent />
    </Suspense>
  )
}
