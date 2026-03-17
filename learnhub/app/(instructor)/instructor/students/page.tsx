'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, Button, Input } from '@/components/ui'
import { Search, Mail, Filter, MoreVertical, MessageSquare } from 'lucide-react'

const MOCK_STUDENTS = [
  { id: 'u1', name: 'Alice Smith', email: 'alice@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', enrolled: 3, lastActive: '2 hours ago', progress: { 'c1': 85, 'c2': 10 } },
  { id: 'u2', name: 'Bob Johnson', email: 'bob@example.com', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop', enrolled: 1, lastActive: '1 day ago', progress: { 'c1': 100 } },
  { id: 'u3', name: 'Charlie Davis', email: 'charlie@example.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop', enrolled: 5, lastActive: 'Just now', progress: { 'c2': 45 } },
  { id: 'u4', name: 'Diana Prince', email: 'diana@example.com', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop', enrolled: 2, lastActive: '3 days ago', progress: { 'c1': 0 } },
]

export default function InstructorStudentsPage() {
  const [search, setSearch] = useState('')

  const filteredStudents = MOCK_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 pb-24">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-800">
          <div>
             <h1 className="text-3xl font-heading font-bold text-white mb-2">Students</h1>
             <div className="text-surface-400">View and manage the {MOCK_STUDENTS.length} students enrolled in your courses.</div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <Button variant="outline"><Mail className="w-4 h-4 mr-2" /> Message All</Button>
          </div>
       </div>

       <Card className="bg-surface-900 border-surface-800 overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-surface-800 flex flex-col sm:flex-row gap-4 justify-between bg-surface-950/50">
             <div className="w-full sm:w-96 relative">
                <Input 
                   placeholder="Search students by name or email" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="pl-10 bg-surface-900"
                />
                <Search className="w-4 h-4 text-surface-500 absolute left-3 top-3" />
             </div>
             <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
             </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-surface-300">
                <thead className="bg-surface-950 text-xs uppercase font-bold text-surface-500 border-b border-surface-800">
                   <tr>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Courses Enrolled</th>
                      <th className="px-6 py-4">Last Active</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                   {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-surface-800/30 transition-colors group">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <Image 
                                 src={student.avatar} 
                                 alt={student.name} 
                                 width={40} height={40} 
                                 className="rounded-full object-cover shrink-0"
                               />
                               <div>
                                  <div className="font-bold text-white group-hover:text-primary-400 transition-colors">{student.name}</div>
                                  <div className="text-xs text-surface-500">{student.email}</div>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4 font-bold">
                            <span className="bg-surface-800 text-white px-2.5 py-1 rounded-md">{student.enrolled}</span>
                         </td>
                         <td className="px-6 py-4 text-surface-400">{student.lastActive}</td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors" title="Message Student">
                                  <MessageSquare className="w-4 h-4" />
                               </button>
                               <button className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors">
                                  <MoreVertical className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                   )) : (
                      <tr>
                         <td colSpan={4} className="px-6 py-8 text-center text-surface-500 font-medium">
                            No students found matching your search.
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