const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Fixing users table...')
    
    // Add missing columns if they don't exist
    await prisma.$executeRawUnsafe(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verified" TIMESTAMP;`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_instructor" BOOLEAN DEFAULT false;`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_admin" BOOLEAN DEFAULT false;`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "stripe_customer_id" TEXT;`)
    
    // Ensure role column exists and uses the Role enum
    await prisma.$executeRawUnsafe(`ALTER TABLE "users" DROP COLUMN IF EXISTS "role";`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "users" ADD COLUMN "role" "Role" DEFAULT 'student';`)

    console.log('Users table fixed successfully.')
  } catch (e) {
    console.error('Error fixing users table:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
