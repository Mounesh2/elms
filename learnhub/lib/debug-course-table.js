const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.$queryRaw`
    SELECT table_name, column_name 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name ILIKE '%course%';
  `
  console.log('Course-related columns:', result)
}

main().catch(console.error).finally(() => prisma.$disconnect())
