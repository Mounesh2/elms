import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Starting YouTube Seeding...')

  // 1. Get Categories
  const categories = await prisma.category.findMany()
  const catMap = new Map(categories.map(c => [c.slug, c.id]))

  // Fallback map for common slugs if not found exactly
  const getCatId = (slug: string) => {
    if (catMap.has(slug)) return catMap.get(slug)
    // Common mappings
    if (slug === 'development' || slug === 'web-development') return catMap.get('development') || catMap.get('web-development') || categories[0].id
    if (slug === 'computer-science') return catMap.get('it-software') || catMap.get('computer-science') || categories[0].id
    return categories[0].id
  }

  // 2. Define YouTube Instructors and Courses
  const techCreators = [
    {
      name: 'Apna College',
      email: 'shradha@apnacollege.com',
      headline: 'Alpha Plus Full Stack & DSA Instructor',
      bio: 'Shradha Khapra and Aman Dhattarwal team delivering best tech education.',
      avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
      courses: [
        {
          title: 'Sigma Web Development Course',
          subtitle: 'The ultimate web development course from scratch to advanced.',
          description: 'Master HTML, CSS, JS, React, Node, and more. This course is designed to take you from a beginner to a job-ready developer.',
          slug: 'sigma-web-development',
          category: 'web-development',
          thumbnail: 'https://i.ytimg.com/vi/l1EssrLxt7E/maxresdefault.jpg',
          price: 0,
          level: 'Beginner'
        },
        {
          title: 'DSA in Java Course',
          subtitle: 'Comprehensive Data Structures and Algorithms in Java.',
          description: 'Learn DSA from scratch in Java. Includes arrays, linked lists, trees, and graphs.',
          slug: 'java-dsa-apna-college',
          category: 'development',
          thumbnail: 'https://i.ytimg.com/vi/yRpLlJSxQDg/maxresdefault.jpg',
          price: 0,
          level: 'Intermediate'
        }
      ]
    },
    {
      name: 'CodeWithHarry',
      email: 'harry@codewithharry.com',
      headline: 'The Most Loved Coding Instructor in India',
      bio: 'Haris Khan (Harry) translates complex tech into simple Hindi.',
      avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
      courses: [
        {
          title: 'Sigma Web Development Course 2.0',
          subtitle: 'Full Stack Web Development with Next.js and more.',
          description: 'A complete series covering everything you need for full stack web development.',
          slug: 'harry-sigma-webdev',
          category: 'web-development',
          thumbnail: 'https://i.ytimg.com/vi/tVzUXW6siu0/maxresdefault.jpg',
          price: 0,
          level: 'Beginner'
        },
        {
          title: 'Python Tutorial for Beginners',
          subtitle: 'Learn Python in one video or follow the playlist.',
          description: 'The best Python course for absolute beginners, covering all core concepts.',
          slug: 'python-for-beginners-harry',
          category: 'computer-science',
          thumbnail: 'https://i.ytimg.com/vi/7wnove7K-mU/maxresdefault.jpg',
          price: 0,
          level: 'Beginner'
        }
      ]
    },
    {
       name: 'CodeHelp - by Babbar',
       email: 'babbar@codehelp.in',
       headline: 'Ex-Amazon, Ex-Microsoft Engineer',
       bio: 'Love Babbar is famous for his DSA content and Supreme batches.',
       avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
       courses: [
         {
           title: 'DSA Supreme Batch',
           subtitle: 'Master Data Structures and Algorithms with Babbar.',
           description: 'A complete roadmap and course for mastering DSA in C++.',
           slug: 'dsa-supreme-babbar',
           category: 'development',
           thumbnail: 'https://i.ytimg.com/vi/WQoB2z67hvY/maxresdefault.jpg',
           price: 0,
           level: 'Intermediate'
         }
       ]
    },
    {
      name: 'Kunal Kushwaha',
      email: 'kunal@communityclassroom.org',
      headline: 'Founder Community Classroom',
      bio: 'Famous for free high-quality education and Git/GitHub tutorials.',
      avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
      courses: [
        {
          title: 'Complete Git & GitHub Course',
          subtitle: 'Master version control with Kunal Kushwaha.',
          description: 'Everything you need to know about Git and GitHub, from basic to advanced.',
          slug: 'git-github-kunal',
          category: 'development',
          thumbnail: 'https://i.ytimg.com/vi/apGV9Kg7ics/maxresdefault.jpg',
          price: 0,
          level: 'Beginner'
        }
      ]
    },
    {
      name: 'Thapa Technical',
      email: 'thapa@thapatechnical.com',
      headline: 'Simplified Web Development in Hindi',
      bio: 'Expert in React, Node, and modern web technologies.',
      avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
      courses: [
        {
          title: 'Complete React JS Course',
          subtitle: 'Modern React with hooks and state management.',
          description: 'A comprehensive React course in Hindi, perfect for beginners.',
          slug: 'react-thapa-technical',
          category: 'web-development',
          thumbnail: 'https://i.ytimg.com/vi/tiLWCNFz7zA/maxresdefault.jpg',
          price: 0,
          level: 'Beginner'
        }
      ]
    },
    {
       name: 'Striver (take U forward)',
       email: 'striver@takeuforward.com',
       headline: 'G-Step @ Google, Ex-Amazon',
       bio: 'Famous for SDE Sheets and DSA Playlists.',
       avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
       courses: [
         {
           title: 'A-Z DSA Course',
           subtitle: 'The ultimate roadmap to master DSA.',
           description: 'Complete DSA playlist from basic to advanced including DP and Graphs.',
           slug: 'striver-a-z-dsa',
           category: 'development',
           thumbnail: 'https://i.ytimg.com/vi/S77He-Gat-U/maxresdefault.jpg',
           price: 0,
           level: 'All_Levels'
         }
       ]
    },
    {
      name: 'Harkirat Singh',
      email: 'harkirat@100xdevs.com',
      headline: 'Founder 100xDevs, Ex-Remote Engineer',
      bio: 'Teaching deep full-stack and open source.',
      avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
      courses: [
        {
          title: 'Full Stack MERN & Next.js',
          subtitle: 'The 100xDevs Way.',
          description: 'Deep dive into MERN, Next.js, and scaling applications.',
          slug: 'harkirat-full-stack',
          category: 'web-development',
          thumbnail: 'https://i.ytimg.com/vi/Vv565Y_0Rto/maxresdefault.jpg',
          price: 0,
          level: 'Intermediate'
        }
      ]
    }
  ]

  for (const creator of techCreators) {
    console.log(`Processing instructor: ${creator.name}`)
    
    // Create User / Instructor
    const user = await prisma.user.upsert({
      where: { email: creator.email },
      update: {
        name: creator.name,
        image: creator.avatar,
        isInstructor: true,
      },
      create: {
        email: creator.email,
        name: creator.name,
        image: creator.avatar,
        isInstructor: true,
        role: 'instructor'
      }
    })

    // Create Profile
    await prisma.profile.upsert({
      where: { id: user.id },
      update: {
        headline: creator.headline,
        bio: creator.bio,
      },
      create: {
        id: user.id,
        email: creator.email,
        fullName: creator.name,
        headline: creator.headline,
        bio: creator.bio,
        role: 'instructor',
        isInstructor: true
      }
    })

    // Create Courses
    for (const courseData of creator.courses) {
      console.log(`  Creating course: ${courseData.title}`)
      await prisma.course.upsert({
        where: { slug: courseData.slug },
        update: {
          title: courseData.title,
          subtitle: courseData.subtitle,
          description: courseData.description,
          thumbnailUrl: courseData.thumbnail,
          price: courseData.price,
          level: courseData.level as any,
          instructorId: user.id,
          categoryId: getCatId(courseData.category),
          status: 'published',
          isPublished: true,
          isApproved: true
        },
        create: {
          title: courseData.title,
          subtitle: courseData.subtitle,
          description: courseData.description,
          slug: courseData.slug,
          thumbnailUrl: courseData.thumbnail,
          price: courseData.price,
          level: courseData.level as any,
          instructorId: user.id,
          categoryId: getCatId(courseData.category),
          status: 'published',
          isPublished: true,
          isApproved: true
        }
      })
    }
  }

  console.log('YouTube Seeding Completed!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
