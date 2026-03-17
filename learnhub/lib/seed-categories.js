const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const categories = [
    { name: 'Web Development', slug: 'web-development', description: 'Master the art of building websites' },
    { name: 'Development', slug: 'development', description: 'General software development courses' },
    { name: 'Computer Science', slug: 'computer-science', description: 'Core CS fundamentals' },
    { name: 'Design', slug: 'design', description: 'UI/UX and Graphic Design' },
    { name: 'Business', slug: 'business', description: 'Business and Entrepreneurship' }
  ]

  console.log('Seeding categories...')
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    })
    console.log(`  Category created: ${cat.name}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
