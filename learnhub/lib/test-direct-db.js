const { PrismaClient } = require('@prisma/client')

async function main() {
  const directUrl = 'postgresql://postgres.ppsxsjuvkwsdhbnhkdku:Mounesh%408845@db.ppsxsjuvkwsdhbnhkdku.supabase.co:5432/postgres'
  console.log('Testing direct connection to:', directUrl)
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: directUrl
      }
    }
  })

  try {
    const res = await prisma.$queryRaw`SELECT 1 as connected`
    console.log('Success:', res)
    process.exit(0)
  } catch (err) {
    console.error('Failed:', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
