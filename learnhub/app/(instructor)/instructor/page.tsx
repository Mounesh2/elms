import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getInstructorStats, getInstructorCourses } from "@/lib/db/instructor"
import { 
  Users, 
  Star, 
  BookOpen, 
  DollarSign, 
  Plus, 
  MoreVertical
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui"

export default async function InstructorDashboardPage() {
  const session = await auth()
  if (!session?.user || !session.user.isInstructor) {
    redirect("/")
  }

  const stats = await getInstructorStats(session.user.id)
  const instructorCourses = await getInstructorCourses(session.user.id)

  const statCards = [
    { label: "Total Students", value: stats.totalStudents, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Average Rating", value: stats.avgRating, icon: Star, iconFill: true, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Total Courses", value: stats.totalCourses, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Revenue", value: `$${stats.totalRevenue}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
  ]

  return (
    <div className="p-8 max-w-[1440px] mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1c1d1f]">Instructor Dashboard</h1>
          <p className="text-surface-600 mt-1">Welcome back, {session.user.name}</p>
        </div>
        <Link href="/instructor/courses/create">
          <Button className="bg-[#1c1d1f] hover:bg-surface-800 text-white gap-2 h-12 px-6">
            <Plus className="h-5 w-5" /> Create New Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white border border-surface-200 p-6 rounded-sm shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.iconFill ? 'fill-current' : ''}`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-[#1c1d1f]">{stat.value}</p>
              <p className="text-sm font-medium text-surface-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1c1d1f]">Your Courses</h2>
          <Link href="/instructor/courses" className="text-primary-700 font-bold hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {instructorCourses.length === 0 ? (
            <div className="text-center py-20 bg-surface-50 border-2 border-dashed border-surface-200 rounded-sm">
                <BookOpen className="h-12 w-12 text-surface-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold">No courses yet</h3>
                <p className="text-surface-500 mb-6">Start your journey by creating your first course today.</p>
                <Link href="/instructor/courses/create">
                    <Button variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" /> Create Course
                    </Button>
                </Link>
            </div>
          ) : (
            instructorCourses.map((course: any) => (
              <div key={course.id} className="flex items-center gap-6 p-4 bg-white border border-surface-200 rounded-sm hover:border-primary-300 transition-colors group">
                <div className="w-40 aspect-video rounded-sm overflow-hidden bg-surface-100 flex-shrink-0">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-300">
                        <BookOpen className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {course.isPublished ? 'Live' : 'Draft'}
                    </span>
                    <span className="text-xs text-surface-500">• {course.category?.name || 'Uncategorized'}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1c1d1f] truncate group-hover:text-primary-700 transition-colors">{course.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-surface-600 font-medium">
                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {course.totalStudents}</span>
                    <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> {course.averageRating}</span>
                    <span>${course.price}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pr-4">
                  <Link href={`/instructor/courses/${course.id}`}>
                    <Button variant="ghost" size="sm" className="font-bold">Edit</Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-surface-400">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
