import prisma from "@/lib/prisma"

export async function getCourses(params: {
  category?: string
  search?: string
  limit?: number
  rating?: number
  levels?: string[]
  price?: 'all' | 'free' | 'paid'
  sort?: 'highest-rated' | 'most-reviewed' | 'newest'
}) {
  const { category, search, limit = 10, rating = 0, levels = [], price = 'all', sort = 'highest-rated' } = params

  const where: any = {
    isPublished: true,
  }

  if (category) {
    where.categoryId = category
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { subtitle: { contains: search, mode: 'insensitive' } }
    ]
  }

  if (rating > 0) {
    where.averageRating = { gte: rating }
  }

  if (levels.length > 0) {
    where.level = { in: levels as any }
  }

  if (price === 'free') {
    where.isFree = true
  } else if (price === 'paid') {
    where.isFree = false
  }

  let orderBy: any = { averageRating: 'desc' }
  if (sort === 'newest') orderBy = { createdAt: 'desc' }
  if (sort === 'most-reviewed') orderBy = { totalReviews: 'desc' }

  const result = await prisma.course.findMany({
    where,
    include: {
      category: true,
      instructor: {
        select: {
          name: true,
          image: true
        }
      }
    },
    take: limit,
    orderBy: orderBy,
  })

  return result
}

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: {
      sortOrder: 'asc'
    }
  })
}

export async function getCourseBySlug(slug: string) {
  return await prisma.course.findFirst({
    where: {
      slug: slug
    },
    include: {
      category: true,
      instructor: {
        include: {
          profile: true
        }
      },
      sections: {
        include: {
          lectures: true
        },
        orderBy: {
          sortOrder: 'asc'
        }
      }
    }
  })
}
