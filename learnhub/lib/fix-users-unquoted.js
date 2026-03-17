const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Fixing users table UNQUOTED identifiers...')
    
    // Add missing columns if they don't exist
    await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified TIMESTAMP;`)
    await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_instructor BOOLEAN DEFAULT false;`)
    await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;`)
    await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;`)
    
    // Check if role column exists, if not add it using the Role enum
    // We try to add it, if it fails it might already exist
    try {
       await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN role Role DEFAULT 'student';`)
    } catch (e) {
       console.log('Role column might already exist, attempting to alter type...')
       await prisma.$executeRawUnsafe(`ALTER TABLE users ALTER COLUMN role TYPE Role USING role::text::Role;`)
    }

    console.log('Users table fixed successfully UNQUOTED.')
  } catch (e) {
    console.error('Error fixing users table:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
