'use client'

import { Card, Button } from '@/components/ui/index'
import { Users, BookOpen, Star, TrendingUp, Award } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const ENROLLMENT_DATA = [
  { name: 'Jan', students: 120 },
  { name: 'Feb', students: 250 },
  { name: 'Mar', students: 180 },
  { name: 'Apr', students: 390 },
  { name: 'May', students: 480 },
  { name: 'Jun', students: 610 },
  { name: 'Jul', students: 530 },
]

export default function InstructorAnalyticsPage() {
  return (
    <div className="space-y-8 pb-24">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-800">
          <div>
             <h1 className="text-3xl font-heading font-bold text-white mb-2">Analytics</h1>
             <div className="text-surface-400">Track student engagement, enrollments, and ratings across your catalog.</div>
          </div>
       </div>

       {/* KIPs */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-surface-900 border-surface-800 flex items-center gap-4">
             <div className="w-14 h-14 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Users className="w-7 h-7" />
             </div>
             <div>
                <div className="text-surface-400 font-medium text-sm mb-1">Total Students</div>
                <div className="text-2xl font-bold text-white">12,450</div>
             </div>
          </Card>
          <Card className="p-6 bg-surface-900 border-surface-800 flex items-center gap-4">
             <div className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Star className="w-7 h-7" />
             </div>
             <div>
                <div className="text-surface-400 font-medium text-sm mb-1">Instructor Rating</div>
                <div className="text-2xl font-bold text-white">4.7 <span className="text-sm font-normal text-surface-500">/ 5.0</span></div>
             </div>
          </Card>
          <Card className="p-6 bg-surface-900 border-surface-800 flex items-center gap-4">
             <div className="w-14 h-14 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-7 h-7" />
             </div>
             <div>
                <div className="text-surface-400 font-medium text-sm mb-1">Active Courses</div>
                <div className="text-2xl font-bold text-white">8</div>
             </div>
          </Card>
          <Card className="p-6 bg-surface-900 border-surface-800 flex items-center gap-4">
             <div className="w-14 h-14 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
                <Award className="w-7 h-7" />
             </div>
             <div>
                <div className="text-surface-400 font-medium text-sm mb-1">Certificates Issued</div>
                <div className="text-2xl font-bold text-white">1,204</div>
             </div>
          </Card>
       </div>

       <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <Card className="p-6 md:p-8 bg-surface-900 border-surface-800 lg:col-span-2">
             <div className="flex justify-between items-center mb-8 border-b border-surface-800 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary-400" /> Enrollment Trends</h2>
                <select className="bg-surface-950 border border-surface-700 text-surface-200 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-primary-500">
                   <option>Last 6 Months</option>
                   <option>This Year</option>
                   <option>All Time</option>
                </select>
             </div>
             
             <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ENROLLMENT_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{stroke: '#334155', strokeWidth: 2}}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="students" stroke="#8b5cf6" strokeWidth={4} dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 8, fill: '#8b5cf6', stroke: '#0f172a' }} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </Card>

          {/* Top Courses */}
          <Card className="p-6 bg-surface-900 border-surface-800 flex flex-col">
             <h2 className="text-xl font-bold text-white mb-6 border-b border-surface-800 pb-4">Top Performing Courses</h2>
             
             <div className="space-y-6 flex-1">
                {[
                   { title: 'Complete Python Bootcamp', students: '4,230', rating: 4.8 },
                   { title: 'Machine Learning A-Z', students: '3,105', rating: 4.7 },
                   { title: 'Next.js 14 Pro Guide', students: '2,840', rating: 4.9 },
                   { title: 'Advanced Docker & K8s', students: '1,120', rating: 4.5 },
                ].map((course, i) => (
                   <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-950 border border-surface-800 flex items-center justify-center font-bold text-surface-400 shrink-0">
                         {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="font-bold text-white truncate mb-1">{course.title}</div>
                         <div className="flex items-center gap-3 text-sm text-surface-400">
                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.students}</span>
                            <span className="flex items-center gap-1 text-amber-400"><Star className="w-3.5 h-3.5 fill-current" /> {course.rating}</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
             
             <div className="pt-6 mt-auto border-t border-surface-800">
                <Button variant="outline" className="w-full">View Full Report</Button>
             </div>
          </Card>
       </div>

    </div>
  )
}