'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/ssr'
import { Button, Card, Badge } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import { Course } from '@/types'
import { 
  Plus, Search, Filter, MoreVertical, 
  Edit, Eye, Trash2, MonitorPlay, Star, BookOpen
} from 'lucide-react'

export default function InstructorCoursesPage() {
  const router = useRouter()
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadCourses() {
      // In a real app, filter by `instructor_id = user.id`
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const query = supabase.from('courses').select('*').eq('instructor_id', user.id).order('created_at', { ascending: false })
      
      const { data, error } = await query
      if (data) {
        setCourses(data as unknown as Course[])
      }
      setLoading(false)
    }

    loadCourses()
  }, [supabase])

  const filteredCourses = courses.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Mock data if the user has no courses yet (to demonstrate the UI as requested)
  const displayCourses = courses.length > 0 ? filteredCourses : [
    {
       id: 'mock-1',
       title: 'Complete Python Bootcamp: Go from zero to hero',
       thumbnail_url: null,
       status: 'published',
       total_students: 845,
       average_rating: 4.8,
       price: 49.99,
       created_at: new Date().toISOString()
    },
    {
       id: 'mock-2',
       title: 'Advanced React Patterns',
       thumbnail_url: null,
       status: 'draft',
       total_students: 0,
       avg_rating: 0,
       price: 29.99,
       created_at: new Date().toISOString()
    }
  ] as any[]

  if (loading) return <div className="p-8"><div className="w-8 h-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Courses</h1>
          <p className="text-surface-400 mt-2">Manage your courses, view performance, and publish new content.</p>
        </div>
        <Button onClick={() => router.push('/instructor/courses/create')} size="lg" className="shrink-0">
          <Plus className="w-5 h-5 mr-2" /> Create New Course
        </Button>
      </div>

      {/* FILTERS TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-900 border border-surface-800 p-4 rounded-2xl">
         <div className="relative w-full sm:w-96 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input 
              type="text"
              placeholder="Search your courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-800 border border-surface-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
            />
         </div>
         <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-surface-400 shrink-0">
               <Filter className="w-4 h-4" /> Filter by status:
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-800 border border-surface-700 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-primary-500 flex-1 sm:flex-none"
            >
              <option value="all">All Courses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="pending">In Review</option>
            </select>
         </div>
      </div>

      {/* COURSES TABLE */}
      <Card className="p-0 overflow-hidden border-surface-800 shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-surface-300">
             <thead className="bg-surface-800/80 text-xs uppercase text-surface-400 border-b border-surface-700">
                <tr>
                   <th className="px-6 py-4 font-semibold shrink-0 w-16">Image</th>
                   <th className="px-6 py-4 font-semibold">Course Details</th>
                   <th className="px-6 py-4 font-semibold">Status</th>
                   <th className="px-6 py-4 font-semibold text-center">Students</th>
                   <th className="px-6 py-4 font-semibold text-center">Rating</th>
                   <th className="px-6 py-4 font-semibold text-right">Revenue</th>
                   <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-surface-800">
                {displayCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-surface-400">
                       <BookOpen className="w-12 h-12 mx-auto text-surface-600 mb-3" />
                       <div className="text-lg font-medium text-white mb-1">No courses found</div>
                       <div>Try adjusting your filters or create a new course.</div>
                    </td>
                  </tr>
                ) : (
                  displayCourses.map(course => (
                    <tr key={course.id} className="hover:bg-surface-800/30 transition-colors group">
                       <td className="px-6 py-4">
                         <div className="w-24 h-16 rounded-lg bg-surface-800 border border-surface-700 overflow-hidden relative flex items-center justify-center shrink-0">
                           {course.thumbnail_url ? (
                             <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" />
                           ) : (
                             <MonitorPlay className="w-6 h-6 text-surface-600" />
                           )}
                         </div>
                       </td>
                       <td className="px-6 py-4 min-w-[250px]">
                         <div className="font-bold text-white mb-1 line-clamp-1 group-hover:text-primary-400 transition-colors">{course.title}</div>
                         <div className="text-xs text-surface-500 flex items-center gap-2">
                            <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="font-medium text-surface-300">{formatPrice(course.price)}</span>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         {course.status === 'published' ? (
                           <Badge color="green" label="Published" />
                         ) : course.status === 'pending' ? (
                           <Badge color="blue" label="In Review" />
                         ) : course.status === 'archived' ? (
                           <Badge color="gray" label="Archived" />
                         ) : (
                           <Badge color="orange" label="Draft" />
                         )}
                       </td>
                       <td className="px-6 py-4 text-center font-medium">
                         {course.total_students > 0 ? course.total_students : '--'}
                       </td>
                       <td className="px-6 py-4 center text-center">
                         {course.average_rating > 0 ? (
                           <div className="flex items-center justify-center gap-1.5 font-bold text-white">
                             {course.average_rating.toFixed(1)} <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 mb-0.5" />
                           </div>
                         ) : (
                           <span className="text-surface-500">None</span>
                         )}
                       </td>
                       <td className="px-6 py-4 text-right font-medium text-green-400">
                         {course.total_students > 0 ? formatPrice(course.total_students * course.price * 0.7) : '$0.00'}
                       </td>
                       <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-1 text-surface-400 opacity-60 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => router.push(`/instructor/courses/${course.id}/curriculum`)} className="p-2 hover:text-white hover:bg-surface-700 rounded-md transition-colors" title="Edit Curriculum">
                             <Edit className="w-4 h-4" />
                           </button>
                           <button className="p-2 hover:text-white hover:bg-surface-700 rounded-md transition-colors" title="View Stats">
                             <Eye className="w-4 h-4" />
                           </button>
                           <div className="w-px h-5 bg-surface-700 mx-1 self-center" />
                           <button className="p-2 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors" title="Delete">
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                       </td>
                    </tr>
                  ))
                )}
             </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}