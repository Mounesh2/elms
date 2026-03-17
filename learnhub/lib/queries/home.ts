import prisma from "@/lib/prisma"

export async function getLoggedInHomepageData(userId: string) {
  const [
    lastAccessed,
    enrolled,
    wishlist,
    unreadCountResult,
    topCategories,
    recentlyViewedResult,
    trendingResult
  ] = await Promise.all([
    // 1. Last accessed course for Continue Learning Bar
    prisma.progress.findFirst({
        where: { userId },
        include: {
            course: true,
            lecture: true
        },
        orderBy: {
            updatedAt: 'desc'
        }
    }),

    // 2. Enrolled courses for "Let's start learning" row
    prisma.enrollment.findMany({
        where: { userId },
        include: {
            course: {
                include: {
                    instructor: true,
                    category: true
                }
            }
        },
        take: 10
    }),

    // 3. Wishlist preview
    prisma.wishlist.findMany({
        where: { userId },
        include: {
            course: {
                include: {
                    instructor: true
                }
            }
        },
        take: 4
    }),

    // 4. Unread notification count
    prisma.notification.count({
        where: {
            userId,
            isRead: false
        }
    }),

    // 5. Popular categories
    prisma.category.findMany({
        orderBy: {
            courseCount: 'desc'
        },
        take: 8
    }),

    // 6. Recently viewed course
    prisma.recentlyViewed.findFirst({
        where: { userId },
        orderBy: {
            viewedAt: 'desc'
        },
        include: {
            course: {
                include: {
                    instructor: true
                }
            }
        }
    }),

    // 7. Trending this week (approximate with enrollment count)
    prisma.enrollment.groupBy({
        by: ['courseId'],
        where: {
            enrolledAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
        },
        _count: {
            id: true
        },
        orderBy: {
            _count: {
                id: 'desc'
            }
        },
        take: 8
    })
  ])

  // Post-process trending to get course details
  const trendingCourses = trendingResult.length > 0 
    ? await prisma.course.findMany({
        where: {
            id: {
                in: trendingResult.map(t => t.courseId)
            }
        },
        include: {
            instructor: true,
            category: true
        }
      })
    : []

  return {
    lastAccessed: lastAccessed ? {
        course: lastAccessed.course,
        lecture: lastAccessed.lecture,
        progress: lastAccessed
    } : null,
    enrolled: enrolled.map((e) => e.course),
    wishlist: wishlist.map((w) => w.course),
    unreadCount: unreadCountResult,
    categories: topCategories,
    recentlyViewed: recentlyViewedResult?.course || null,
    trending: trendingCourses
  }
}

export async function getLearningStats(userId: string) {
    const [stats, completedCount, inProgressCount] = await Promise.all([
        prisma.progress.aggregate({
            where: { userId },
            _sum: {
                lastPositionSeconds: true
            }
        }),
        prisma.progress.count({
            where: {
                userId,
                completed: true
            }
        }),
        prisma.progress.count({
            where: { userId }
        })
    ])

    return {
        minutesLearned: Math.floor((stats._sum.lastPositionSeconds || 0) / 60),
        completedCourses: completedCount,
        activeCourses: inProgressCount,
        streak: 3 // Placeholder
    }
}
