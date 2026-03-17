'use client'

import { useState } from 'react'
import { Card, Button } from '@/components/ui'
import { DollarSign, Download, TrendingUp, Send } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// MOCK DATA for Admin Revenue
const PLATFORM_REVENUE = [
  { name: 'Jan', revenue: 124000, payouts: 86800 },
  { name: 'Feb', revenue: 142000, payouts: 99400 },
  { name: 'Mar', revenue: 138000, payouts: 96600 },
  { name: 'Apr', revenue: 189000, payouts: 132300 },
  { name: 'May', revenue: 215000, payouts: 150500 },
  { name: 'Jun', revenue: 245000, payouts: 171500 },
]

export default function AdminRevenuePage() {
  const [timeRange, setTimeRange] = useState('6M')

  return (
    <div className="space-y-8 pb-24">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-800">
          <div>
             <h1 className="text-3xl font-heading font-bold text-white mb-2">Financial Hub</h1>
             <div className="text-surface-400">Platform-wide revenue, instructor payouts, and processing fees.</div>
          </div>
          <div className="flex gap-3">
             <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-surface-900 border-surface-800">
             <div className="flex justify-between items-start mb-4">
                <div className="text-surface-400 font-medium">Gross Total Volume</div>
                <DollarSign className="w-5 h-5 text-green-400" />
             </div>
             <div className="text-3xl font-bold font-heading text-white mb-2">$1,053,000</div>
             <div className="flex items-center text-sm font-bold text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" /> +24% YTD
             </div>
          </Card>
          <Card className="p-6 bg-surface-900 border-surface-800">
             <div className="flex justify-between items-start mb-4">
                <div className="text-surface-400 font-medium">Instructor Payouts (70%)</div>
                <Send className="w-5 h-5 text-blue-400" />
             </div>
             <div className="text-3xl font-bold font-heading text-white mb-2">$737,100</div>
             <div className="text-sm font-bold text-surface-500">Processed via Stripe Connect</div>
          </Card>
          <Card className="p-6 bg-surface-900 border-surface-800 border-primary-500/20 bg-primary-500/5">
             <div className="flex justify-between items-start mb-4">
                <div className="text-primary-400 font-medium">Platform Net Revenue (30%)</div>
                <DollarSign className="w-5 h-5 text-primary-400" />
             </div>
             <div className="text-3xl font-bold font-heading text-white mb-2">$315,900</div>
             <div className="text-sm font-bold text-primary-500/80">Before processing fees</div>
          </Card>
       </div>

       <Card className="p-6 md:p-8 bg-surface-900 border-surface-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
             <h2 className="text-xl font-bold text-white">Revenue Split</h2>
             <div className="flex items-center bg-surface-950 rounded-lg p-1 border border-surface-800 w-fit">
                {['1M', '3M', '6M', '1Y', 'ALL'].map(range => (
                   <button 
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${timeRange === range ? 'bg-surface-800 text-white shadow-sm' : 'text-surface-400 hover:text-surface-200'}`}
                   >
                      {range}
                   </button>
                ))}
             </div>
          </div>
          
          <div className="h-[400px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={PLATFORM_REVENUE} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorPayouts" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                 <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                 <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                 <Tooltip 
                   cursor={{stroke: '#334155', strokeWidth: 2}}
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                   itemStyle={{ color: '#fff' }}
                 />
                 <Area type="monotone" name="Gross Revenue" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                 <Area type="monotone" name="Instructor Payouts" dataKey="payouts" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPayouts)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
       </Card>
    </div>
  )
}