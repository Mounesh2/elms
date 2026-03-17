'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, Button, Input } from '@/components/ui'
import { Search, Filter, MoreVertical, CheckCircle2, XCircle, Clock, Eye } from 'lucide-react'

// MOCK DATA for Admin Courses Log
const MOCK_PLATFORM_COURSES = [
  { id: 'c1', title: 'Complete Python Bootcamp: Go from zero to hero in Python 3', instructor: 'Colt Steele', category: 'Development', thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?w=800&q=80', status: 'published', price: 14.99, enrolled: 41203 },
  { id: 'c2', title: 'Machine Learning A-Z: AI, Python & R', instructor: 'Kirill Eremenko', category: 'Data Science', thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80', status: 'pending', price: 19.99, enrolled: 0 },
  { id: 'c3', title: 'The Complete Web Development Bootcamp', instructor: 'Dr. Angela Yu', category: 'Development', thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', status: 'published', price: 29.99, enrolled: 125430 },
  { id: 'c4', title: 'Unreal Engine 5 C++ Developer', instructor: 'Ben Tristem', category: 'Game Dev', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', status: 'rejected', price: 24.99, enrolled: 0 },
]

export default function AdminCoursesPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredCourses = MOCK_PLATFORM_COURSES.filter(c => {
     const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase())
     const matchesStatus = filterStatus === 'all' || c.status === filterStatus
     return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8 pb-24">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-800">
          <div>
             <h1 className="text-3xl font-heading font-bold text-white mb-2">Content Moderation</h1>
             <div className="text-surface-400">Review pending courses, monitor published content, and enforce guidelines.</div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-5 bg-surface-900 border-surface-800 border-amber-500/20 bg-amber-500/5">
             <div className="flex justify-between items-start">
                <div>
                   <div className="text-amber-500/80 text-sm mb-1">Awaiting Review</div>
                   <div className="text-2xl font-bold text-amber-500">24</div>
                </div>
                <Clock className="w-5 h-5 text-amber-500/50" />
             </div>
             <Button size="sm" variant="outline" className="w-full mt-4 border-amber-500/20 text-amber-500 hover:bg-amber-500/10">Start Review Queue</Button>
          </Card>
          <Card className="p-5 bg-surface-900 border-surface-800 border-green-500/20 bg-green-500/5">
             <div className="flex justify-between items-start">
                <div>
                   <div className="text-green-500/80 text-sm mb-1">Total Published</div>
                   <div className="text-2xl font-bold text-green-500">14,204</div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500/50" />
             </div>
          </Card>
          <Card className="p-5 bg-surface-900 border-surface-800 border-red-500/20 bg-red-500/5">
             <div className="flex justify-between items-start">
                <div>
                   <div className="text-red-500/80 text-sm mb-1">Rejected Content</div>
                   <div className="text-2xl font-bold text-red-500">415</div>
                </div>
                <XCircle className="w-5 h-5 text-red-500/50" />
             </div>
          </Card>
       </div>

       <Card className="bg-surface-900 border-surface-800 overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-surface-800 flex flex-col sm:flex-row gap-4 justify-between bg-surface-950/50">
             <div className="w-full sm:w-96 relative">
                <Input 
                   placeholder="Search by title, instructor, or ID" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="pl-10 bg-surface-900"
                />
                <Search className="w-4 h-4 text-surface-500 absolute left-3 top-3" />
             </div>
             <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <button onClick={()=>setFilterStatus('all')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${filterStatus === 'all' ? 'bg-surface-800 text-white' : 'text-surface-400 hover:text-white hover:bg-surface-800/50'}`}>All Content</button>
                <button onClick={()=>setFilterStatus('pending')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${filterStatus === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-surface-400 hover:text-amber-500 hover:bg-amber-500/5'}`}>Needs Review</button>
                <button onClick={()=>setFilterStatus('published')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${filterStatus === 'published' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'text-surface-400 hover:text-green-500 hover:bg-green-500/5'}`}>Published</button>
                <button onClick={()=>setFilterStatus('rejected')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${filterStatus === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-surface-400 hover:text-red-500 hover:bg-red-500/5'}`}>Rejected</button>
             </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-surface-300">
                <thead className="bg-surface-950 text-xs uppercase font-bold text-surface-500 border-b border-surface-800">
                   <tr>
                      <th className="px-6 py-4">Course Info</th>
                      <th className="px-6 py-4">Instructor</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                   {filteredCourses.length > 0 ? filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-surface-800/30 transition-colors group">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                               <div className="w-16 h-10 relative rounded overflow-hidden shrink-0 border border-surface-800 bg-surface-950">
                                  <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                               </div>
                               <div>
                                  <div className="font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1 max-w-[300px]">{course.title}</div>
                                  <div className="text-xs text-surface-500 mt-1 flex items-center gap-2">
                                     <span className="uppercase tracking-wider font-bold">{course.category}</span>
                                     <span className="w-1 h-1 bg-surface-700 rounded-full"></span>
                                     <span>{course.enrolled.toLocaleString('en-US')} Enrolled</span>
                                  </div>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4 font-medium">{course.instructor}</td>
                         <td className="px-6 py-4 font-bold font-mono text-white">${course.price}</td>
                         <td className="px-6 py-4">
                            {course.status === 'published' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20"><CheckCircle2 className="w-3.5 h-3.5" /> Published</span>}
                            {course.status === 'pending' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20"><Clock className="w-3.5 h-3.5" /> Pending Review</span>}
                            {course.status === 'rejected' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20"><XCircle className="w-3.5 h-3.5" /> Rejected</span>}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               {course.status === 'pending' && (
                                  <Button size="sm" variant="outline" className="h-8 text-xs border-amber-500/50 text-amber-500 hover:bg-amber-500/10">Review Quality</Button>
                               )}
                               <button className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors" title="View Course Frontend">
                                  <Eye className="w-4 h-4" />
                               </button>
                               <button className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors" title="More Options">
                                  <MoreVertical className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                   )) : (
                      <tr>
                         <td colSpan={5} className="px-6 py-12 text-center text-surface-500 font-medium">
                            No courses found matching your criteria.
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