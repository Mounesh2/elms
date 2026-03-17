const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const userCount = await prisma.user.count()
  const courseCount = await prisma.course.count()
  const instructorCount = await prisma.user.count({ where: { isInstructor: true } })
  const instructors = await prisma.user.findMany({ 
    where: { isInstructor: true },
    select: { name: true, email: true }
  })
  
  console.log('Total Users:', userCount)
  console.log('Total Instructors:', instructorCount)
  console.log('Total Courses:', courseCount)
  console.log('Instructors List:', instructors.map(i => i.name).join(', '))
}

main().catch(console.error).finally(() => prisma.$disconnect())
