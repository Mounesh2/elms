const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Attempting manual DDL...')
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS test_table (
        id TEXT PRIMARY KEY,
        name TEXT
      );
    `)
    console.log('Success: test_table created.')
  } catch (e) {
    console.error('Failed:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
