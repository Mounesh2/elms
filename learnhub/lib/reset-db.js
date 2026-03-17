const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('DROPPING ALL TABLES AND TYPES IN PUBLIC SCHEMA...')
    
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS public CASCADE;`)
    await prisma.$executeRawUnsafe(`CREATE SCHEMA public;`)
    await prisma.$executeRawUnsafe(`GRANT ALL ON SCHEMA public TO postgres;`)
    await prisma.$executeRawUnsafe(`GRANT ALL ON SCHEMA public TO public;`)

    console.log('Public schema reset successfully.')
  } catch (e) {
    console.error('Error resetting schema:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
