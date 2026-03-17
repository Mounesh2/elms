const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

async function main() {
  const educators = [
    { name: 'Apna College', email: 'shradha@apnacollege.com' },
    { name: 'CodeWithHarry', email: 'harry@codewithharry.com' },
    { name: 'CodeHelp - by Babbar', email: 'babbar@codehelp.in' },
    { name: 'Kunal Kushwaha', email: 'kunal@communityclassroom.org' },
    { name: 'Thapa Technical', email: 'thapa@thapatechnical.com' },
    { name: 'Striver (take U forward)', email: 'striver@takeuforward.com' },
    { name: 'Harkirat Singh', email: 'harkirat@100xdevs.com' },
    { name: 'Piyush Garg', email: 'piyush@piyushgarg.dev' },
    { name: 'Knowledge Gate', email: 'sanchit@knowledgegate.in' }
  ]

  const courses = [
    { title: 'Sigma Web Development Course', slug: 'sigma-web-development', instructor: 'Apna College', cat: 'web-development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/l1EssrLxt7E/maxresdefault.jpg' },
    { title: 'Sigma Web Development Course 2.0', slug: 'harry-sigma-webdev', instructor: 'CodeWithHarry', cat: 'web-development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/tVzUXW6siu0/maxresdefault.jpg' },
    { title: 'DSA Supreme Batch', slug: 'dsa-supreme-babbar', instructor: 'CodeHelp - by Babbar', cat: 'development', level: 'Intermediate', thumb: 'https://i.ytimg.com/vi/WQoB2z67hvY/maxresdefault.jpg' },
    { title: 'Complete Git & GitHub Course', slug: 'git-github-kunal', instructor: 'Kunal Kushwaha', cat: 'development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/apGV9Kg7ics/maxresdefault.jpg' },
    { title: 'Complete React JS Course', slug: 'react-thapa-technical', instructor: 'Thapa Technical', cat: 'web-development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/tiLWCNFz7zA/maxresdefault.jpg' },
    { title: 'A-Z DSA Course', slug: 'striver-a-z-dsa', instructor: 'Striver (take U forward)', cat: 'development', level: 'All_Levels', thumb: 'https://i.ytimg.com/vi/S77He-Gat-U/maxresdefault.jpg' },
    { title: 'Full Stack MERN & Next.js', slug: 'harkirat-full-stack', instructor: 'Harkirat Singh', cat: 'web-development', level: 'Intermediate', thumb: 'https://i.ytimg.com/vi/Vv565Y_0Rto/maxresdefault.jpg' },
    { title: 'Complete Next.js 14 Course', slug: 'piyush-nextjs-14', instructor: 'Piyush Garg', cat: 'web-development', level: 'Intermediate', thumb: 'https://i.ytimg.com/vi/uQeIDHSp6_k/maxresdefault.jpg' },
    { title: 'DBMS Complete Playlist', slug: 'kg-dbms', instructor: 'Knowledge Gate', cat: 'computer-science', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/3Zp7P0yM3B0/maxresdefault.jpg' }
  ]

  const categories = await prisma.category.findMany()
  const catMap = new Map(categories.map(c => [c.slug, c.id]))
  const getCatId = (slug) => catMap.get(slug) || catMap.get('development') || categories[0].id

  console.log('Seeding educators...')
  for (const ed of educators) {
    try {
      const user = await prisma.user.upsert({
        where: { email: ed.email },
        update: { isInstructor: true, name: ed.name },
        create: { email: ed.email, name: ed.name, isInstructor: true, role: 'instructor' }
      })
      console.log(`  Educator upserted: ${ed.name}`)
    } catch (e) {
      console.error(`  Failed educator ${ed.name}:`, e.message)
    }
  }

  const instructors = await prisma.user.findMany({ where: { isInstructor: true } })
  const userMap = new Map(instructors.map(u => [u.name, u.id]))

  console.log('Seeding courses...')
  for (const c of courses) {
    const instructorId = userMap.get(c.instructor)
    if (!instructorId) {
       console.log(`  Skipping ${c.title}: Instructor ${c.instructor} not found.`)
       continue
    }
    try {
      await prisma.course.upsert({
        where: { slug: c.slug },
        update: {
          title: c.title,
          thumbnailUrl: c.thumb,
          level: c.level,
        },
        create: {
          title: c.title,
          slug: c.slug,
          description: c.title,
          thumbnailUrl: c.thumb,
          price: 0,
          level: c.level,
          instructorId: instructorId,
          categoryId: getCatId(c.cat),
          status: 'published',
          isPublished: true
        }
      })
      console.log(`  Course upserted: ${c.title}`)
    } catch (e) {
      console.error(`  Failed course ${c.title}:`, e.message)
      fs.appendFileSync('seed_final_err.txt', `Failed ${c.title}: ${e.message}\n`)
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
