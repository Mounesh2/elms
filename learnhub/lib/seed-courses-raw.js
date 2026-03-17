const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({ where: { isInstructor: true } })
  const userMap = new Map(users.map(u => [u.name, u.id]))
  
  const categories = await prisma.category.findMany()
  const catMap = new Map(categories.map(c => [c.slug, c.id]))

  const getCatId = (slug) => {
    if (catMap.has(slug)) return catMap.get(slug)
    if (slug === 'development' || slug === 'web-development') return catMap.get('development') || catMap.get('web-development') || categories[0].id
    return categories[0].id
  }

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

  console.log('Inserting courses using raw SQL...')
  for (const c of courses) {
    const instructorId = userMap.get(c.instructor)
    const categoryId = getCatId(c.cat)
    if (!instructorId) {
      console.log(`  Skipping ${c.title}: Instructor ${c.instructor} not found.`)
      continue
    }

    try {
      const id = Math.random().toString(36).substring(7)
      await prisma.$executeRaw`
        INSERT INTO public.courses (
          id, title, slug, description, thumbnail_url, price, level, 
          instructor_id, category_id, status, is_published, is_approved, updated_at
        ) VALUES (
          ${id}, ${c.title}, ${c.slug}, ${c.title}, ${c.thumb}, 0, ${c.level}::public."Level", ${instructorId}, ${categoryId}, 'published'::public."CourseStatus", true, true, NOW()
        ) ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          level = EXCLUDED.level,
          thumbnail_url = EXCLUDED.thumbnail_url,
          updated_at = NOW();
      `
      console.log(`  Inserted: ${c.title}`)
    } catch (e) {
      console.error(`  Failed ${c.title}:`, e.message)
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
