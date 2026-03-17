const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT typname FROM pg_type WHERE typname = 'Role';`
    console.log('Role type in DB:', result)
    
    const enums = await prisma.$queryRaw`SELECT n.nspname as schema, t.typname as type 
      FROM pg_type t 
      JOIN pg_namespace n ON n.oid = t.typnamespace 
      WHERE t.typtype = 'e';`
    console.log('Enums in DB:', enums)
  } catch (e) {
    console.error('Error querying pg_type:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
