const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Dropping and recreating enums UNQUOTED...')
    
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "Role" CASCADE;`)
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS Role CASCADE;`)
    await prisma.$executeRawUnsafe(`CREATE TYPE Role AS ENUM ('student', 'instructor', 'admin');`)
    
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "CourseStatus" CASCADE;`)
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS CourseStatus CASCADE;`)
    await prisma.$executeRawUnsafe(`CREATE TYPE CourseStatus AS ENUM ('draft', 'review', 'published', 'rejected', 'archived');`)
    
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "Level" CASCADE;`)
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS Level CASCADE;`)
    await prisma.$executeRawUnsafe(`CREATE TYPE Level AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'All_Levels');`)

    console.log('Enums recreated successfully UNQUOTED.')
  } catch (e) {
    console.error('Error recreating enums:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
