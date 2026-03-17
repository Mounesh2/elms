const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

async function main() {
  const tables = await prisma.$queryRaw`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';`
  fs.writeFileSync('db_tables.txt', JSON.stringify(tables, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
