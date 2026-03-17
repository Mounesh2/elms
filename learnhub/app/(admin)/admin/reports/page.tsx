'use client'

import { Card, Button } from '@/components/ui'
import { FileText, Download, TrendingUp, Users, DollarSign, BookOpen, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// MOCK DATA for Admin Reports
const MONTHLY_ENROLLMENTS = [
  { name: 'Jan', free: 4500, paid: 2100 },
  { name: 'Feb', free: 5200, paid: 2800 },
  { name: 'Mar', free: 4800, paid: 2600 },
  { name: 'Apr', free: 6100, paid: 3500 },
  { name: 'May', free: 7200, paid: 4100 },
  { name: 'Jun', free: 8500, paid: 4800 },
]

export default function AdminReportsPage() {
  return (
    <div className="space-y-8 pb-24">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-800">
          <div>
             <h1 className="text-3xl font-heading font-bold text-white mb-2">Reports & Analytics</h1>
             <div className="text-surface-400">Generate comprehensive reports on platform growth, user engagement, and sales.</div>
          </div>
          <div className="flex gap-3">
             <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export All Data</Button>
          </div>
       </div>

       {/* Quick Export Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-5 bg-surface-900 border-surface-800 hover:border-surface-600 transition-colors cursor-pointer group">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                   <Users className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-white mb-1">User Growth</h3>
                   <div className="text-xs text-surface-400">Monthly active users & retention</div>
                </div>
             </div>
          </Card>
          <Card className="p-5 bg-surface-900 border-surface-800 hover:border-surface-600 transition-colors cursor-pointer group">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center shrink-0 group-hover:bg-green-500 group-hover:text-white transition-colors">
                   <DollarSign className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-white mb-1">Financial</h3>
                   <div className="text-xs text-surface-400">Revenue, refunds, & payouts</div>
                </div>
             </div>
          </Card>
          <Card className="p-5 bg-surface-900 border-surface-800 hover:border-surface-600 transition-colors cursor-pointer group">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                   <BookOpen className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-white mb-1">Course Catalog</h3>
                   <div className="text-xs text-surface-400">Performance by category</div>
                </div>
             </div>
          </Card>
          <Card className="p-5 bg-surface-900 border-surface-800 hover:border-surface-600 transition-colors cursor-pointer group">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                   <FileText className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-white mb-1">Custom Report</h3>
                   <div className="text-xs text-surface-400">Build your own query</div>
                </div>
             </div>
          </Card>
       </div>

       {/* Chart Section */}
       <Card className="p-6 md:p-8 bg-surface-900 border-surface-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
             <h2 className="text-xl font-bold text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary-400" /> Enrollment Trends (Free vs Paid)</h2>
             <select className="bg-surface-950 border border-surface-700 text-surface-200 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-primary-500">
                <option>Year to Date</option>
                <option>Last 12 Months</option>
                <option>All Time</option>
             </select>
          </div>
          
          <div className="h-[400px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={MONTHLY_ENROLLMENTS} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                 <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                 <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                 <Tooltip 
                   cursor={{fill: '#1e293b'}}
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                   itemStyle={{ color: '#fff' }}
                 />
                 <Bar dataKey="free" name="Free Enrollments" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                 <Bar dataKey="paid" name="Paid Enrollments" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </div>
       </Card>

       {/* Recent Generated Reports */}
       <Card className="bg-surface-900 border-surface-800 overflow-hidden">
          <div className="p-6 border-b border-surface-800 bg-surface-950">
             <h2 className="text-xl font-bold text-white">Recently Generated Reports</h2>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-surface-300">
                <thead className="bg-surface-950/50 text-xs uppercase font-bold text-surface-500 border-b border-surface-800">
                   <tr>
                      <th className="px-6 py-4">Report Name</th>
                      <th className="px-6 py-4">Generated By</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                   {[
                      { id: 'r1', name: 'Q3 Financial Reconciliation.csv', user: 'Admin User', date: 'Oct 24, 2025', type: 'Financial' },
                      { id: 'r2', name: 'Instructor_Payouts_Sep2025.xlsx', user: 'Billing Bot', date: 'Oct 01, 2025', type: 'Payouts' },
                      { id: 'r3', name: 'User_Growth_Metrics_YTD.pdf', user: 'Marketing Team', date: 'Sep 30, 2025', type: 'Analytics' },
                   ].map((report) => (
                      <tr key={report.id} className="hover:bg-surface-800/30 transition-colors">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <FileText className="w-4 h-4 text-surface-500" />
                               <span className="font-bold text-white">{report.name}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-surface-400">{report.user}</td>
                         <td className="px-6 py-4 font-mono text-xs">{report.date}</td>
                         <td className="px-6 py-4">
                            <span className="bg-surface-800 px-2 py-1 rounded text-xs font-bold text-surface-300">{report.type}</span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Download className="w-4 h-4" /></Button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </Card>

    </div>
  )
}