"use client"

import { useState, useEffect } from "react"
import { CreditCard, Download, ExternalLink, Receipt } from "lucide-react"

export function PurchaseHistory() {
  const [purchases, setPurchases] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch("/api/user/purchases")
        const data = await res.json()
        setPurchases(data)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPurchases()
  }, [])

  if (isLoading) return <div className="p-20 text-center">Loading purchases...</div>

  if (purchases.length === 0) {
    return (
        <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-surface-50 rounded-full flex items-center justify-center mx-auto">
                <Receipt className="h-8 w-8 text-surface-300" />
            </div>
            <p className="text-surface-500 font-medium">You haven&apos;t made any purchases yet.</p>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-surface-200 rounded-sm overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 text-surface-700 font-bold border-b border-surface-200">
                <tr>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Payment Method</th>
                    <th className="px-6 py-4 text-right">Receipt</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
                {purchases.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-50 transition-colors">
                        <td className="px-6 py-4">
                            <p className="font-bold text-[#1c1d1f]">{p.courseTitle}</p>
                            <p className="text-xs text-surface-500 line-clamp-1">{p.instructorName}</p>
                        </td>
                        <td className="px-6 py-4 text-surface-600">
                            {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#1c1d1f]">
                            ${p.amount}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-surface-400" />
                                <span className="text-surface-600">•••• {p.last4 || '4242'}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="p-2 text-primary-700 hover:bg-primary-50 rounded-sm transition-all" title="Download Receipt">
                                <Download className="h-5 w-5" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  )
}
