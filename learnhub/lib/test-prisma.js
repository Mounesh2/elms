const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const count = await prisma.user.count()
    console.log('User count:', count)
  } catch (e) {
    console.error('Prisma Error:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
