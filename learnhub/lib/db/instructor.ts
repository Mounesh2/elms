import prisma from "@/lib/prisma"

export async function getInstructorStats(instructorId: string) {
  // 1. Total Students
  const instructorCourses = await prisma.course.findMany({
    where: { instructorId },
    select: { id: true }
  })
  
  const courseIds = instructorCourses.map((c) => c.id)
  
  let totalStudents = 0
  let totalRevenue = "0.00"
  
  if (courseIds.length > 0) {
    totalStudents = await prisma.enrollment.count({
        where: {
            courseId: { in: courseIds }
        }
    })

    const revenueResult = await prisma.enrollment.aggregate({
        where: {
            courseId: { in: courseIds }
        },
        _sum: {
            pricePaid: true
        }
    })
    totalRevenue = (revenueResult._sum.pricePaid || 0).toString()
  }

  // 2. Average Rating
  const avgRatingResult = await prisma.course.aggregate({
    where: { instructorId },
    _avg: {
        averageRating: true
    }
  })
  const avgRating = (avgRatingResult._avg.averageRating?.toNumber() || 0).toFixed(1)

  return {
    totalStudents,
    avgRating,
    totalCourses: courseIds.length,
    totalRevenue: parseFloat(totalRevenue).toFixed(2)
  }
}

export async function getInstructorCourses(instructorId: string) {
    return await prisma.course.findMany({
        where: { instructorId },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            category: true
        }
    })
}
