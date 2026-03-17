'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Card } from '@/components/ui'
import { cn, formatPrice } from '@/lib/utils'
import { 
  DollarSign, Users, Star, BookOpen, 
  TrendingUp, Eye, Edit
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useRouter } from 'next/navigation'

const revenueData = [
  { name: 'Jan', total: 1200 },
  { name: 'Feb', total: 2100 },
  { name: 'Mar', total: 1800 },
  { name: 'Apr', total: 2400 },
  { name: 'May', total: 2800 },
  { name: 'Jun', total: 3200 },
  { name: 'Jul', total: 2900 },
  { name: 'Aug', total: 3500 },
  { name: 'Sep', total: 4200 },
  { name: 'Oct', total: 3800 },
  { name: 'Nov', total: 4900 },
  { name: 'Dec', total: 5400 },
]

// Mock data to quickly satisfy visuals for recent enrollments
const recentEnrollments = [
  { id: 1, student: 'Alice Johnson', course: 'Complete Python Bootcamp: Go from zero to hero', date: '2025-03-12', price: 14.99 },
  { id: 2, student: 'Mark Spencer', course: 'Advanced React Patterns', date: '2025-03-11', price: 12.50 },
  { id: 3, student: 'Sarah Jenkins', course: 'Machine Learning A-Z', date: '2025-03-11', price: 19.99 },
  { id: 4, student: 'Tom Hardy', course: 'Complete Python Bootcamp: Go from zero to hero', date: '2025-03-10', price: 14.99 },
]

export default function InstructorDashboard() {
  const router = useRouter()
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const [courses, setCourses] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalStudents: 0,
    avgRating: 0,
    publishedCount: 0,
    draftCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data: cData } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false })

      if (cData) {
        setCourses(cData)
        const published = cData.filter(c => c.status === 'published').length
        const drafts = cData.filter(c => c.status === 'draft').length
        const students = cData.reduce((acc, c) => acc + (c.total_students || 0), 0)
        const revenue = cData.reduce((acc, c) => acc + ((c.total_students || 0) * (c.price || 0) * 0.7), 0)
        const rating = cData.length > 0 ? cData.reduce((acc, c) => acc + (c.average_rating || 0), 0) / cData.length : 0

        setStats({
          totalRevenue: revenue,
          totalStudents: students,
          avgRating: rating,
          publishedCount: published,
          draftCount: drafts
        })
      }
      setLoading(false)
    }
    loadData()
  }, [supabase])

  if (!mounted || loading) return <div className="p-8"><div className="w-8 h-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white">Overview Dashboard</h1>
        <p className="text-surface-400 mt-2">Welcome back! Here&apos;s a summary of your performance.</p>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col gap-2 p-6 justify-center">
           <div className="flex items-center justify-between text-surface-400 mb-1">
             <span className="font-semibold text-sm uppercase tracking-wider">Total Revenue</span>
             <DollarSign className="w-5 h-5 text-green-400" />
           </div>
           <div className="text-3xl font-bold text-white">{formatPrice(stats.totalRevenue)}</div>
           <div className="text-sm font-medium text-green-400 flex items-center gap-1 mt-1">
             <TrendingUp className="w-4 h-4" /> +0% <span className="text-surface-500 ml-1 font-normal">from last month</span>
           </div>
        </Card>
        
        <Card className="flex flex-col gap-2 p-6 justify-center">
           <div className="flex items-center justify-between text-surface-400 mb-1">
             <span className="font-semibold text-sm uppercase tracking-wider">Total Students</span>
             <Users className="w-5 h-5 text-blue-400" />
           </div>
           <div className="text-3xl font-bold text-white">{stats.totalStudents.toLocaleString('en-US')}</div>
           <div className="text-sm font-medium text-green-400 flex items-center gap-1 mt-1">
             <TrendingUp className="w-4 h-4" /> +0 <span className="text-surface-500 ml-1 font-normal">new this month</span>
           </div>
        </Card>

        <Card className="flex flex-col gap-2 p-6 justify-center">
           <div className="flex items-center justify-between text-surface-400 mb-1">
             <span className="font-semibold text-sm uppercase tracking-wider">Average Rating</span>
             <Star className="w-5 h-5 text-yellow-400" />
           </div>
           <div className="text-3xl font-bold text-white">{stats.avgRating.toFixed(1)} <span className="text-xl text-surface-500 font-normal">/ 5.0</span></div>
           <div className="text-sm font-medium text-surface-400 flex items-center gap-1 mt-1">
             Across {courses.length} courses
           </div>
        </Card>

        <Card className="flex flex-col gap-2 p-6 justify-center">
           <div className="flex items-center justify-between text-surface-400 mb-1">
             <span className="font-semibold text-sm uppercase tracking-wider">Total Courses</span>
             <BookOpen className="w-5 h-5 text-primary-400" />
           </div>
           <div className="text-3xl font-bold text-white">{courses.length}</div>
           <div className="text-sm font-medium text-surface-400 flex flex-wrap gap-2 mt-1">
             <span className="text-green-400 font-semibold">{stats.publishedCount} published</span>
             <span className="text-yellow-400 font-semibold">{stats.draftCount} draft</span>
           </div>
        </Card>
      </div>

      {/* CHART & ENROLLMENTS ROW */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* REVENUE CHART */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold text-white mb-6">Revenue Overview (Last 12 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d30" vertical={false} />
                <XAxis dataKey="name" stroke="#8b8b93" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#8b8b93" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  cursor={{ fill: '#2d2d30' }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#2d2d30', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#a78bfa' }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === revenueData.length - 1 ? '#8b5cf6' : '#6d28d9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* RECENT ENROLLMENTS */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Recent Enrollments</h3>
            <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">View All</button>
          </div>
          <div className="space-y-6">
            {recentEnrollments.map((enr) => (
              <div key={enr.id} className="flex flex-col gap-1 border-b border-surface-800 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-surface-200">{enr.student}</span>
                  <span className="font-bold text-green-400">${enr.price.toFixed(2)}</span>
                </div>
                <div className="text-sm text-surface-400 line-clamp-1">{enr.course}</div>
                <div className="text-xs text-surface-500 mt-1">{enr.date}</div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* COURSE PERFORMANCE TABLE */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-surface-800">
           <h3 className="text-lg font-bold text-white">Course Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-surface-300">
             <thead className="bg-surface-800/50 text-xs uppercase text-surface-400">
                <tr>
                   <th className="px-6 py-4 font-semibold">Course Title</th>
                   <th className="px-6 py-4 font-semibold">Students</th>
                   <th className="px-6 py-4 font-semibold">Revenue</th>
                   <th className="px-6 py-4 font-semibold">Rating</th>
                   <th className="px-6 py-4 font-semibold">Status</th>
                   <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-surface-800">
                {courses.slice(0, 5).map(course => (
                  <tr key={course.id} className="hover:bg-surface-800/20 transition-colors">
                     <td className="px-6 py-4 font-medium text-white max-w-xs truncate">{course.title}</td>
                     <td className="px-6 py-4">{course.total_students || 0}</td>
                     <td className="px-6 py-4 font-medium text-green-400">{formatPrice((course.total_students || 0) * (course.price || 0) * 0.7)}</td>
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-1">
                         <Star className={`w-3 h-3 ${course.average_rating > 0 ? 'text-yellow-500 fill-yellow-500' : 'text-surface-600'}`} /> 
                         {course.average_rating ? course.average_rating.toFixed(1) : '—'}
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <span className={cn(
                         "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                         course.status === 'published' ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                       )}>
                         {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2 text-surface-400">
                         <button 
                           onClick={() => router.push(`/courses/${course.slug}`)}
                           className="p-1.5 hover:text-white hover:bg-surface-700 rounded transition-colors" 
                           title="View Details"
                         >
                           <Eye className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => router.push(`/instructor/courses/${course.id}/curriculum`)}
                           className="p-1.5 hover:text-white hover:bg-surface-700 rounded transition-colors" 
                           title="Edit"
                         >
                           <Edit className="w-4 h-4" />
                         </button>
                       </div>
                     </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-surface-500">
                      No courses created yet. 
                      <button onClick={() => router.push('/instructor/courses/create')} className="text-primary-400 hover:underline ml-1">Create your first course</button>
                    </td>
                  </tr>
                )}
             </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}