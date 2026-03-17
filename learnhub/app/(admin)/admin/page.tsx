import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  CreditCard,
  AlertCircle
} from "lucide-react"

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/")
  }

  // Fetch global stats using Prisma aggregates
  const userCount = await prisma.user.count()
  const courseCount = await prisma.course.count()
  const enrollmentCount = await prisma.enrollment.count()
  const revenueResult = await prisma.order.aggregate({
    _sum: {
        amount: true
    }
  })

  const stats = [
    { label: "Total Users", value: userCount, icon: Users, color: "text-blue-600" },
    { label: "Total Courses", value: courseCount, icon: BookOpen, color: "text-purple-600" },
    { label: "Total Enrollments", value: enrollmentCount, icon: ShieldCheck, color: "text-green-600" },
    { label: "Platform Revenue", value: `$${revenueResult._sum.amount?.toNumber() || "0"}`, icon: CreditCard, color: "text-indigo-600" },
  ]

  return (
    <div className="p-8 max-w-[1440px] mx-auto space-y-10">
      <div className="flex items-center gap-4">
        <div className="bg-primary-100 p-3 rounded-xl">
            <ShieldCheck className="h-8 w-8 text-primary-700" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#1c1d1f]">Admin Console</h1>
          <p className="text-surface-600">Platform-wide overview and management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-surface-200 p-8 rounded-sm shadow-sm">
            <div className={`mb-4 ${stat.color}`}>
              <stat.icon className="h-8 w-8" />
            </div>
            <p className="text-sm font-bold text-surface-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-4xl font-bold text-[#1c1d1f]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-orange-50 border border-orange-200 p-6 rounded-sm flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0" />
          <div>
              <p className="font-bold text-orange-900">System Maintenance Notice</p>
              <p className="text-orange-800 text-sm">Database migration to Neon is currently in progress. Some platform-wide metrics may lag by a few minutes.</p>
          </div>
      </div>
    </div>
  )
}
