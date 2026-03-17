const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Creating Role enum...')
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "Role" AS ENUM ('student', 'instructor', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)
    console.log('Role enum created (or already exists).')

    console.log('Creating CourseStatus enum...')
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "CourseStatus" AS ENUM ('draft', 'review', 'published', 'rejected', 'archived');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)
    console.log('CourseStatus enum created.')

    console.log('Creating Level enum...')
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "Level" AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'All_Levels');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)
    console.log('Level enum created.')

  } catch (e) {
    console.error('Error creating enums:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
