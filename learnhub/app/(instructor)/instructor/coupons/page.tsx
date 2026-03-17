'use client'

import { useState } from 'react'
import { Card, Button, Input } from '@/components/ui'
import { Ticket, Search, PlusCircle, Copy, AlertCircle, Percent, Clock } from 'lucide-react'

const MOCK_COUPONS = [
  { id: 'cp1', code: 'WINTER50', course: 'Complete Python Bootcamp', discountType: 'percentage', amount: 50, uses: 124, maxUses: 500, expires: 'Dec 31, 2025', active: true },
  { id: 'cp2', code: 'DEV15OFF', course: 'Next.js Pro Guide', discountType: 'fixed', amount: 15, uses: 8, maxUses: 100, expires: 'Nov 15, 2025', active: true },
  { id: 'cp3', code: 'LAUNCH99', course: 'Machine Learning A-Z', discountType: 'fixed', amount: 9.99, uses: 1000, maxUses: 1000, expires: 'Oct 01, 2025', active: false },
]

export default function InstructorCouponsPage() {
  const [search, setSearch] = useState('')
  const [coupons] = useState(MOCK_COUPONS)

  return (
    <div className="space-y-8 pb-24">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-800">
          <div>
             <h1 className="text-3xl font-heading font-bold text-white mb-2">Coupons & Promotions</h1>
             <div className="text-surface-400">Create discount codes to boost your course sales.</div>
          </div>
          <div className="flex gap-3">
             <Button><PlusCircle className="w-4 h-4 mr-2" /> Create Coupon</Button>
          </div>
       </div>

       {/* Notice */}
       <div className="bg-primary-500/10 border-l-4 border-primary-500 p-4 rounded-r-lg flex gap-3 text-primary-100 text-sm leading-relaxed mb-8">
          <AlertCircle className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
          <div>
             <strong className="text-white block mb-0.5">LearnHub Pricing Policy</strong>
             Creating heavy discounts (over 50%) may reduce your overall revenue share depending on the promotional channel used. Fixed-price coupons cannot drop the course price below $9.99.
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-surface-900 border-surface-800 flex items-center gap-4">
             <div className="w-12 h-12 rounded-lg bg-surface-800 text-surface-300 flex items-center justify-center shrink-0">
                <Ticket className="w-6 h-6" />
             </div>
             <div>
                <div className="text-medium text-surface-400 text-sm">Active Coupons</div>
                <div className="text-2xl font-bold text-white">2</div>
             </div>
          </Card>
          <Card className="p-6 bg-surface-900 border-surface-800 flex items-center gap-4">
             <div className="w-12 h-12 rounded-lg bg-surface-800 text-surface-300 flex items-center justify-center shrink-0">
                <Percent className="w-6 h-6" />
             </div>
             <div>
                <div className="text-medium text-surface-400 text-sm">Total Redemptions</div>
                <div className="text-2xl font-bold text-white">1,132</div>
             </div>
          </Card>
          <Card className="p-6 bg-surface-900 border-surface-800 flex items-center gap-4">
             <div className="w-12 h-12 rounded-lg bg-surface-800 text-surface-300 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
             </div>
             <div>
                <div className="text-medium text-surface-400 text-sm">Expiring Soon</div>
                <div className="text-2xl font-bold text-white">1</div>
             </div>
          </Card>
       </div>

       <Card className="bg-surface-900 border-surface-800 overflow-hidden">
          <div className="p-4 border-b border-surface-800 bg-surface-950/50">
             <div className="w-full sm:w-96 relative">
                <Input 
                   placeholder="Search coupon codes..." 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="pl-10 bg-surface-900"
                />
                <Search className="w-4 h-4 text-surface-500 absolute left-3 top-3" />
             </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-surface-300">
                <thead className="bg-surface-950 text-xs uppercase font-bold text-surface-500 border-b border-surface-800">
                   <tr>
                      <th className="px-6 py-4">Coupon Code</th>
                      <th className="px-6 py-4">Course</th>
                      <th className="px-6 py-4">Discount</th>
                      <th className="px-6 py-4">Redemptions</th>
                      <th className="px-6 py-4">Expires</th>
                      <th className="px-6 py-4">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                   {coupons.filter(c => c.code.toLowerCase().includes(search.toLowerCase())).map((coupon) => {
                      const percentageUsed = Math.round((coupon.uses / coupon.maxUses) * 100)
                      
                      return (
                         <tr key={coupon.id} className="hover:bg-surface-800/30 transition-colors group">
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-white bg-surface-800 px-2.5 py-1 rounded tracking-widest">{coupon.code}</span>
                                  <button className="text-surface-500 hover:text-white transition-colors" title="Copy code">
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                               </div>
                            </td>
                            <td className="px-6 py-4 font-medium max-w-[200px] truncate" title={coupon.course}>{coupon.course}</td>
                            <td className="px-6 py-4 font-bold text-primary-400">
                               {coupon.discountType === 'percentage' ? `${coupon.amount}% OFF` : `Flat $${coupon.amount}`}
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2">
                                  <div className="text-xs font-bold text-white w-12 text-right">{coupon.uses} / {coupon.maxUses}</div>
                                  <div className="w-20 h-1.5 bg-surface-800 rounded-full overflow-hidden">
                                     <div className="h-full bg-primary-500" style={{ width: `${percentageUsed}%` }}></div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-surface-400">{coupon.expires}</td>
                            <td className="px-6 py-4">
                               {coupon.active ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">Active</span>
                               ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-surface-800 text-surface-400 border border-surface-700">Expired</span>
                               )}
                            </td>
                         </tr>
                      )
                   })}
                </tbody>
             </table>
          </div>
       </Card>
    </div>
  )
}