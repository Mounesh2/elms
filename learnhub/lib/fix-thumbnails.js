const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Updating course thumbnails...')
  const courses = await prisma.course.findMany({
    where: {
      thumbnailUrl: {
        contains: 'maxresdefault.jpg'
      }
    }
  })

  console.log(`Found ${courses.length} courses with maxresdefault.jpg`)

  for (const course of courses) {
    const newThumb = course.thumbnailUrl.replace('maxresdefault.jpg', 'hqdefault.jpg')
    await prisma.course.update({
      where: { id: course.id },
      data: { thumbnailUrl: newThumb }
    })
    console.log(`  Updated: ${course.title}`)
  }

  console.log('Done.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
