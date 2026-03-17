import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { 
  DollarSign, 
  TrendingUp, 
  Download, 
  Calendar,
  CreditCard
} from "lucide-react"
import { Button } from "@/components/ui"

export default async function InstructorRevenuePage() {
  const session = await auth()
  if (!session?.user || !session.user.isInstructor) {
    redirect("/")
  }

  // Fetch revenue by course using Prisma GroupBy
  const courseRevenueRaw = await prisma.enrollment.groupBy({
    by: ['courseId'],
    _sum: {
        pricePaid: true
    },
    _count: {
        _all: true
    },
    where: {
        course: {
            instructorId: session.user.id
        }
    }
  })

  // We need the titles too, so let's fetch course details for the IDs we found
  const courseIds = courseRevenueRaw.map(r => r.courseId)
  const coursesData = await prisma.course.findMany({
    where: {
        id: { in: courseIds }
    },
    select: {
        id: true,
        title: true
    }
  })

  const courseTitlesMap = Object.fromEntries(coursesData.map(c => [c.id, c.title]))

  const courseRevenue = courseRevenueRaw.map(r => ({
    courseId: r.courseId,
    courseTitle: courseTitlesMap[r.courseId] || "Unknown Course",
    revenue: r._sum.pricePaid?.toNumber() || 0,
    salesCount: r._count._all
  })).sort((a, b) => b.revenue - a.revenue)

  const totalRevenue = courseRevenue.reduce((acc, curr) => acc + curr.revenue, 0).toFixed(2)
  const totalSales = courseRevenue.reduce((acc, curr) => acc + curr.salesCount, 0)

  return (
    <div className="p-8 max-w-[1440px] mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1c1d1f]">Revenue & Payouts</h1>
          <p className="text-surface-600 mt-1">Track your earnings and manage your payout settings.</p>
        </div>
        <Button variant="outline" className="gap-2 font-bold border-surface-200">
          <Download className="h-4 w-4" /> Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1c1d1f] text-white p-8 rounded-sm shadow-xl relative overflow-hidden">
            <DollarSign className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10" />
            <p className="text-sm font-bold text-surface-400 uppercase tracking-widest mb-2">Total Earnings</p>
            <p className="text-5xl font-bold">${totalRevenue}</p>
            <p className="text-sm text-green-400 mt-4 flex items-center gap-1 font-medium">
                <TrendingUp className="h-4 w-4" /> +15% from last month
            </p>
        </div>
        
        <div className="bg-white border border-surface-200 p-8 rounded-sm">
            <p className="text-sm font-bold text-surface-500 uppercase tracking-widest mb-2">Net Earnings</p>
            <p className="text-4xl font-bold text-[#1c1d1f]">${(parseFloat(totalRevenue) * 0.7).toFixed(2)}</p>
            <p className="text-xs text-surface-500 mt-4">After 30% platform fee</p>
        </div>

        <div className="bg-white border border-surface-200 p-8 rounded-sm flex flex-col justify-between">
            <div>
                <p className="text-sm font-bold text-surface-500 uppercase tracking-widest mb-2">Payout Method</p>
                <div className="flex items-center gap-2 text-[#1c1d1f] font-bold">
                    <CreditCard className="h-5 w-5" /> Stripe Connect
                </div>
            </div>
            <Button className="w-full mt-4 border-primary-100 text-primary-700 bg-primary-50 hover:bg-primary-100 font-bold">
                Manage Payouts
            </Button>
        </div>
      </div>

      <div className="bg-white border border-surface-200 rounded-sm">
        <div className="p-6 border-b border-surface-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1c1d1f]">Revenue by Course</h2>
            <div className="flex items-center gap-2 text-sm text-surface-500">
                <Calendar className="h-4 w-4" /> Last 30 days
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-surface-50 text-surface-600 uppercase text-xs font-bold">
                    <tr>
                        <th className="px-6 py-4">Course</th>
                        <th className="px-6 py-4">Sales</th>
                        <th className="px-6 py-4">Gross Revenue</th>
                        <th className="px-6 py-4">Instructor Revenue</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-surface-200 text-sm">
                    {courseRevenue.map((course) => (
                        <tr key={course.courseId} className="hover:bg-surface-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-[#1c1d1f]">{course.courseTitle}</td>
                            <td className="px-6 py-4">{course.salesCount}</td>
                            <td className="px-6 py-4 font-medium">${course.revenue.toFixed(2)}</td>
                            <td className="px-6 py-4 font-bold text-primary-700">${(course.revenue * 0.7).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  )
}