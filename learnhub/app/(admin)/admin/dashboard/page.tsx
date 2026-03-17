'use client'

import { Card, Button } from '@/components/ui'
import { Users, Server, DollarSign, Activity, AlertCircle, ArrowUpRight, ArrowDownRight, BookOpen, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// MOCK DATA for Admin Dash
const PLATFORM_TRAFFIC = [
  { name: 'Mon', visitors: 12400 },
  { name: 'Tue', visitors: 14200 },
  { name: 'Wed', visitors: 13800 },
  { name: 'Thu', visitors: 18900 },
  { name: 'Fri', visitors: 16500 },
  { name: 'Sat', visitors: 22100 },
  { name: 'Sun', visitors: 24500 },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 pb-24">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-800">
          <div>
             <h1 className="text-3xl font-heading font-bold text-white mb-2">Platform Overview</h1>
             <div className="text-surface-400">System health, global revenue, and user metrics.</div>
          </div>
          <div className="flex gap-3">
             <Button variant="outline"><Activity className="w-4 h-4 mr-2" /> View Server Logs</Button>
          </div>
       </div>

       {/* System Health Banner */}
       <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-center gap-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
          <div className="flex-1">
             <span className="text-green-400 font-bold mr-2">All Systems Operational</span>
             <span className="text-surface-400 text-sm hidden sm:inline">API: 42ms | DB: 12ms | Storage: 104ms</span>
          </div>
          <Button size="sm" variant="ghost" className="text-surface-400 hover:text-white">Refresh</Button>
       </div>

       {/* Global Metrics */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-surface-900 border-surface-800 relative overflow-hidden group">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-500/10 rounded-xl text-primary-400">
                   <DollarSign className="w-6 h-6" />
                </div>
                <span className="flex items-center text-sm font-bold text-green-400">
                   <ArrowUpRight className="w-4 h-4 mr-1" /> 18.2%
                </span>
             </div>
             <div className="text-surface-400 font-medium text-sm mb-1">Monthly Gross Volume</div>
             <div className="text-3xl font-bold font-heading text-white">$428,500</div>
          </Card>

          <Card className="p-6 bg-surface-900 border-surface-800 relative overflow-hidden group">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                   <Users className="w-6 h-6" />
                </div>
                <span className="flex items-center text-sm font-bold text-green-400">
                   <ArrowUpRight className="w-4 h-4 mr-1" /> 5.4%
                </span>
             </div>
             <div className="text-surface-400 font-medium text-sm mb-1">Active Users (30d)</div>
             <div className="text-3xl font-bold font-heading text-white">84,204</div>
          </Card>

          <Card className="p-6 bg-surface-900 border-surface-800 relative overflow-hidden group">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                   <BookOpen className="w-6 h-6" />
                </div>
                <span className="flex items-center text-sm font-bold text-green-400">
                   <ArrowUpRight className="w-4 h-4 mr-1" /> 1.2%
                </span>
             </div>
             <div className="text-surface-400 font-medium text-sm mb-1">Approved Courses</div>
             <div className="text-3xl font-bold font-heading text-white">1,402</div>
          </Card>

          <Card className="p-6 bg-surface-900 border-surface-800 relative overflow-hidden group">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
                   <Server className="w-6 h-6" />
                </div>
                <span className="flex items-center text-sm font-bold text-red-400">
                   <ArrowDownRight className="w-4 h-4 mr-1" /> 4.1%
                </span>
             </div>
             <div className="text-surface-400 font-medium text-sm mb-1">Refund Rate</div>
             <div className="text-3xl font-bold font-heading text-white">2.8%</div>
          </Card>
       </div>

       <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <Card className="p-6 md:p-8 bg-surface-900 border-surface-800 lg:col-span-2">
             <div className="flex justify-between items-center mb-8 border-b border-surface-800 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">Traffic & Enrollments</h2>
                <select className="bg-surface-950 border border-surface-700 text-surface-200 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-primary-500">
                   <option>Last 7 Days</option>
                   <option>Last 30 Days</option>
                </select>
             </div>
             
             <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={PLATFORM_TRAFFIC} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{stroke: '#334155', strokeWidth: 2}}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" name="Unique Visitors" dataKey="visitors" stroke="#8b5cf6" strokeWidth={4} dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 8, fill: '#8b5cf6', stroke: '#0f172a' }} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </Card>

          {/* Action Center */}
          <Card className="p-0 bg-surface-900 border-surface-800 flex flex-col">
             <div className="p-6 border-b border-surface-800">
                <h2 className="text-xl font-bold text-white">Pending Actions</h2>
             </div>
             
             <div className="divide-y divide-surface-800">
                <div className="p-5 flex items-start gap-4 hover:bg-surface-800/30 transition-colors cursor-pointer group">
                   <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0 mt-0.5">
                      <AlertCircle className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="font-bold text-white group-hover:text-amber-400 transition-colors">Course Approvals</h4>
                      <div className="text-sm text-surface-400 mt-1">12 new courses waiting for quality review before publishing.</div>
                      <div className="flex items-center gap-2 mt-2 text-xs font-bold text-surface-500 uppercase tracking-wider">
                         <Clock className="w-3.5 h-3.5" /> Oldest is 3 days ago
                      </div>
                   </div>
                </div>

                <div className="p-5 flex items-start gap-4 hover:bg-surface-800/30 transition-colors cursor-pointer group">
                   <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg shrink-0 mt-0.5">
                      <Users className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">Instructor Identity Verification</h4>
                      <div className="text-sm text-surface-400 mt-1">45 instructors submitted their onboarding KYC documents via Stripe.</div>
                   </div>
                </div>

                <div className="p-5 flex items-start gap-4 hover:bg-surface-800/30 transition-colors cursor-pointer group">
                   <div className="p-2 bg-red-500/10 text-red-400 rounded-lg shrink-0 mt-0.5">
                      <AlertCircle className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="font-bold text-white group-hover:text-red-400 transition-colors">Reported Content</h4>
                      <div className="text-sm text-surface-400 mt-1">3 student reviews flagged for inappropriate language.</div>
                   </div>
                </div>
             </div>
             
             <div className="p-4 mt-auto border-t border-surface-800 bg-surface-950/50">
                <Button variant="outline" className="w-full">View Action Center</Button>
             </div>
          </Card>
       </div>
    </div>
  )
}