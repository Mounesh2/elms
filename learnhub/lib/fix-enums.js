const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Dropping and recreating enums without quotes...')
    
    // We can't drop the type if it's in use, but here we assume it's fresh or we just alter
    // For safety, we use DO block to create if not exists correctly or just run raw SQL
    
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "Role" CASCADE;`)
    await prisma.$executeRawUnsafe(`CREATE TYPE "Role" AS ENUM ('student', 'instructor', 'admin');`)
    
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "CourseStatus" CASCADE;`)
    await prisma.$executeRawUnsafe(`CREATE TYPE "CourseStatus" AS ENUM ('draft', 'review', 'published', 'rejected', 'archived');`)
    
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "Level" CASCADE;`)
    await prisma.$executeRawUnsafe(`CREATE TYPE "Level" AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'All_Levels');`)

    console.log('Enums recreated successfully.')
  } catch (e) {
    console.error('Error recreating enums:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
