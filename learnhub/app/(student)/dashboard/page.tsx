import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Card, ProgressBar, Button } from '@/components/ui'
import { PlayCircle, Award, BookOpen, Clock, ChevronRight, CheckCircle } from 'lucide-react'
import { formatCount } from '@/lib/utils'

export default async function StudentDashboardPage() {
  const session = await auth()

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold text-[#1c1d1f]">Please log in to view your dashboard</h2>
        <Link href="/login"><Button>Log In</Button></Link>
      </div>
    )
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          sections: { include: { lectures: true } }
        }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  })

  const recommendations = await prisma.course.findMany({
    where: { isPublished: true, id: { notIn: enrollments.map(e => e.courseId) } },
    take: 4,
    include: { instructor: { select: { name: true } } }
  })

  const coursesInProgress = enrollments.filter(e => e.progressPercentage > 0 && e.progressPercentage < 100).length
  const completedCourses = enrollments.filter(e => e.progressPercentage === 100).length
  const currentEnrollment = enrollments[0]
  const currentCourse = currentEnrollment?.course
  const progressPercent = currentEnrollment?.progressPercentage || 0

  return (
    <div className="space-y-10 py-4">

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-[#1c1d1f]">Welcome back, {session.user.name?.split(' ')[0]}! 👋</h1>
        <p className="text-surface-500 mt-1">Pick up where you left off.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'In Progress', value: coursesInProgress, icon: <BookOpen className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50' },
          { label: 'Completed', value: completedCourses, icon: <CheckCircle className="w-5 h-5 text-green-500" />, bg: 'bg-green-50' },
          { label: 'Certificates', value: completedCourses, icon: <Award className="w-5 h-5 text-yellow-500" />, bg: 'bg-yellow-50' },
          { label: 'Total Enrolled', value: enrollments.length, icon: <Clock className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-surface-200 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-full ${stat.bg} flex items-center justify-center shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1c1d1f]">{stat.value}</div>
              <div className="text-xs text-surface-500 font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Learning Hero */}
      {currentCourse && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1c1d1f] flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-primary-600" /> Continue Learning
            </h2>
            <Link href="/my-courses" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              My Courses <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <Link href={`/learn/${currentCourse.slug}/default`} className="group block bg-white border border-surface-200 rounded-xl overflow-hidden hover:border-primary-300 hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-72 aspect-video md:aspect-auto relative overflow-hidden shrink-0">
                {currentCourse.thumbnailUrl ? (
                  <Image src={currentCourse.thumbnailUrl} alt={currentCourse.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-surface-100 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-surface-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 p-6 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-[#1c1d1f] mb-1 group-hover:text-primary-700 transition-colors line-clamp-2">{currentCourse.title}</h3>
                <p className="text-sm text-surface-500 mb-5">{currentCourse.instructor?.name}</p>
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-surface-500">Progress</span>
                    <span className="text-primary-600 font-bold">{progressPercent}%</span>
                  </div>
                  <ProgressBar value={progressPercent} className="h-2" />
                </div>
                <span className="w-fit px-5 py-2.5 bg-[#1c1d1f] text-white text-sm font-bold hover:bg-surface-800 transition-colors">
                  {progressPercent === 0 ? 'Start Learning' : 'Continue Learning'}
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Recently Accessed */}
      {enrollments.length > 1 && (
        <section>
          <h2 className="text-lg font-bold text-[#1c1d1f] mb-4">Recently Accessed</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {enrollments.slice(1, 5).map(e => (
              <Link key={e.id} href={`/learn/${e.course.slug}/default`} className="group bg-white border border-surface-200 rounded-xl overflow-hidden hover:border-primary-300 hover:shadow-md transition-all">
                <div className="aspect-video relative overflow-hidden">
                  {e.course.thumbnailUrl ? (
                    <Image src={e.course.thumbnailUrl} alt={e.course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-surface-100 flex items-center justify-center">
                      <PlayCircle className="w-8 h-8 text-surface-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-[#1c1d1f] text-sm line-clamp-2 mb-1 group-hover:text-primary-700 transition-colors">{e.course.title}</h4>
                  <p className="text-xs text-surface-500 mb-3">{e.course.instructor?.name}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-surface-500">Progress</span>
                      <span className="text-[#1c1d1f]">{e.progressPercentage}%</span>
                    </div>
                    <ProgressBar value={e.progressPercentage} className="h-1.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {enrollments.length === 0 && (
        <div className="py-16 text-center bg-white border border-surface-200 rounded-xl">
          <BookOpen className="w-14 h-14 mx-auto text-surface-300 mb-4" />
          <h3 className="text-lg font-bold text-[#1c1d1f] mb-2">No courses yet</h3>
          <p className="text-surface-500 mb-6">Start learning by enrolling in a course.</p>
          <Link href="/courses" className="inline-block px-6 py-3 bg-[#1c1d1f] text-white font-bold hover:bg-surface-800 transition-colors">
            Browse Courses
          </Link>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="border-t border-surface-100 pt-8">
          <h2 className="text-lg font-bold text-[#1c1d1f] mb-4">Recommended for you</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendations.map(course => (
              <Link key={course.id} href={`/courses/${course.slug}`} className="group bg-white border border-surface-200 rounded-xl overflow-hidden hover:border-primary-300 hover:shadow-md transition-all">
                <div className="aspect-video relative overflow-hidden">
                  {course.thumbnailUrl ? (
                    <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-surface-100" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#1c1d1f] text-sm line-clamp-2 mb-1 group-hover:text-primary-700 transition-colors">{course.title}</h3>
                  <p className="text-xs text-surface-500 mb-2">{course.instructor?.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 font-bold text-sm">{course.averageRating?.toNumber().toFixed(1) || '0.0'}</span>
                    <span className="text-yellow-400 text-xs">★★★★★</span>
                    <span className="text-surface-400 text-xs">({formatCount(course.totalReviews || 0)})</span>
                  </div>
                  <p className="font-bold text-[#1c1d1f] mt-2">₹{course.price.toNumber().toLocaleString('en-IN')}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
