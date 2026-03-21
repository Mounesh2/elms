import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })
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
          level: 'Beginner',
          lectures: [
            { title: 'Web Development Introduction', url: 'https://www.youtube.com/watch?v=l1EssrLxt7E' },
            { title: 'HTML Tutorial', url: 'https://www.youtube.com/watch?v=HcOc7P5BMi4' }
          ]
        },
        {
          title: 'DSA in Java Course',
          subtitle: 'Comprehensive Data Structures and Algorithms in Java.',
          description: 'Learn DSA from scratch in Java. Includes arrays, linked lists, trees, and graphs.',
          slug: 'java-dsa-apna-college',
          category: 'development',
          thumbnail: 'https://i.ytimg.com/vi/yRpLlJSxQDg/maxresdefault.jpg',
          price: 0,
          level: 'Intermediate',
          lectures: [
            { title: 'Java Introduction', url: 'https://www.youtube.com/watch?v=yRpLlJSxQDg' },
            { title: 'Data Structures Introduction', url: 'https://www.youtube.com/watch?v=Ff6lqon_Pkw' }
          ]
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
          level: 'Beginner',
          lectures: [
            { title: 'Intro to Sigma Course', url: 'https://www.youtube.com/watch?v=tVzUXW6siu0' },
            { title: 'Creating First Website', url: 'https://www.youtube.com/watch?v=Edsxf_NBFrw' }
          ]
        },
        {
          title: 'Python Tutorial for Beginners',
          subtitle: 'Learn Python in one video or follow the playlist.',
          description: 'The best Python course for absolute beginners, covering all core concepts.',
          slug: 'python-for-beginners-harry',
          category: 'computer-science',
          thumbnail: 'https://i.ytimg.com/vi/7wnove7K-mU/maxresdefault.jpg',
          price: 0,
          level: 'Beginner',
          lectures: [
            { title: 'Python Introduction', url: 'https://www.youtube.com/watch?v=7wnove7K-mU' }
          ]
        }
      ]
    },
    {
      name: 'Chai aur Code',
      email: 'hitesh@hiteshchoudhary.com',
      headline: 'Hitesh Choudhary - Quality Tech in Hindi',
      bio: 'Ex-CTO, passionate about teaching web technologies.',
      avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
      courses: [
        {
          title: 'JavaScript Series',
          subtitle: 'JavaScript masterclass in Hindi.',
          description: 'Complete JavaScript guide from fundamentals to advanced concepts.',
          slug: 'js-chai-aur-code',
          category: 'web-development',
          thumbnail: 'https://i.ytimg.com/vi/r7O-3n_n7eI/maxresdefault.jpg',
          price: 0,
          level: 'Intermediate',
          lectures: [
            { title: 'JS Part 1', url: 'https://www.youtube.com/watch?v=r7O-3n_n7eI' }
          ]
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
           level: 'Intermediate',
           lectures: [
             { title: 'Intro to DSA', url: 'https://www.youtube.com/watch?v=WQoB2z67hvY' }
           ]
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
           level: 'All_Levels',
           lectures: [
             { title: 'A-Z DSA Introduction', url: 'https://www.youtube.com/watch?v=S77He-Gat-U' }
           ]
         }
       ]
    },
    {
      name: 'Telusko',
      email: 'navin@telusko.com',
      headline: 'Navin Reddy - Learn by Doing',
      bio: 'Simplifying complex computing concepts.',
      avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
      courses: [
        {
          title: 'Java for Beginners',
          subtitle: 'Core Java full tutorial.',
          description: 'Learn Java from zero to hero with practical examples.',
          slug: 'java-telusko',
          category: 'computer-science',
          thumbnail: 'https://i.ytimg.com/vi/BGTx91t8q50/maxresdefault.jpg',
          price: 0,
          level: 'Beginner',
          lectures: [
             { title: 'Java Tutorial Introduction', url: 'https://www.youtube.com/watch?v=BGTx91t8q50' }
          ]
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
          level: 'Intermediate',
          lectures: [
             { title: 'Full Stack Intro', url: 'https://www.youtube.com/watch?v=Vv565Y_0Rto' }
          ]
        }
      ]
    },
    {
      name: 'Jenny\'s Lectures',
      email: 'jenny@jennyslectures.com',
      headline: 'Simplified Computer Science Concepts',
      bio: 'Expert in DSA, Algorithms, and Operating Systems.',
      avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
      courses: [
        {
          title: 'Data Structures Full Course',
          subtitle: 'Master Data Structures with Jenny.',
          description: 'Detailed explanation of all data structures with examples.',
          slug: 'dsa-jenny',
          category: 'computer-science',
          thumbnail: 'https://i.ytimg.com/vi/2TgvX7isBAs/maxresdefault.jpg',
          price: 0,
          level: 'Beginner',
          lectures: [
             { title: 'DSA Intro', url: 'https://www.youtube.com/watch?v=2TgvX7isBAs' }
          ]
        }
      ]
    },
    {
      name: 'Gate Smashers',
      email: 'info@gatesmashers.in',
      headline: 'Best Channel for CS Subjects',
      bio: 'Varun Singla and the team providing top quality content for GATE and UGC NET.',
      avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
      courses: [
        {
          title: 'DBMS Full Course',
          subtitle: 'Database Management Systems.',
          description: 'Comprehensive guide to DBMS for university and competitive exams.',
          slug: 'dbms-gate-smashers',
          category: 'it-software',
          thumbnail: 'https://i.ytimg.com/vi/3EJlovevfcA/maxresdefault.jpg',
          price: 0,
          level: 'Beginner',
          lectures: [
             { title: 'DBMS Introduction', url: 'https://www.youtube.com/watch?v=3EJlovevfcA' }
          ]
        }
      ]
    },
    {
      name: 'Knowledge Gate',
      email: 'sanchit@knowledgegate.in',
      headline: 'Sanchit Jain - CS Preparation expert',
      bio: 'Leading instructor for CS engineering subjects.',
      avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
      courses: [
        {
          title: 'Theory of Computation',
          subtitle: 'Automata Theory and TOC.',
          description: 'Master TOC with easy to understand explanations.',
          slug: 'toc-sanchit-jain',
          category: 'computer-science',
          thumbnail: 'https://i.ytimg.com/vi/58N2N7zJv_I/maxresdefault.jpg',
          price: 0,
          level: 'Intermediate',
          lectures: [
             { title: 'TOC Intro', url: 'https://www.youtube.com/watch?v=58N2N7zJv_I' }
          ]
        }
      ]
    },
    {
      name: 'Thapa Technical',
      email: 'vinod@thapa.com',
      headline: 'Simplified Web Development',
      bio: 'Vinod Thapa provides easy to follow web development tutorials.',
      avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
      courses: [
        {
          title: 'React JS Roadmap 2024',
          subtitle: 'Learn React in Hindi.',
          description: 'Modern React with hooks and state management.',
          slug: 'react-thapa',
          category: 'web-development',
          thumbnail: 'https://i.ytimg.com/vi/tiLWCNFz7zA/maxresdefault.jpg',
          price: 0,
          level: 'Beginner',
          lectures: [
             { title: 'React JS Introduction', url: 'https://www.youtube.com/watch?v=tiLWCNFz7zA' }
          ]
        }
      ]
    },
    {
      name: 'Anuj Bhaiya',
      email: 'anuj@anujbhaiya.com',
      headline: 'Ex-Amazon, Ex-Google SDE',
      bio: 'Helping students with placement prep and coding.',
      avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
      courses: [
        {
          title: 'Java Placement Course',
          subtitle: 'Master Java for interviews.',
          description: 'Systematic approach to learning Java and DSA for placements.',
          slug: 'java-anuj-bhaiya',
          category: 'development',
          thumbnail: 'https://i.ytimg.com/vi/n7V8I35nLpg/maxresdefault.jpg',
          price: 0,
          level: 'Beginner',
          lectures: [
             { title: 'Java Intro by Anuj', url: 'https://www.youtube.com/watch?v=n7V8I35nLpg' }
          ]
        }
      ]
    },
    {
      name: 'Tanay Pratap',
      email: 'tanay@neog.camp',
      headline: 'Founder NeoG Camp, Ex-Microsoft',
      bio: 'Mentoring the next generation of full stack developers.',
      avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
      courses: [
        {
          title: 'Level 0 Web Dev',
          subtitle: 'Start your coding journey.',
          description: 'Free course to get started with basic web technologies.',
          slug: 'neog-level0',
          category: 'web-development',
          thumbnail: 'https://i.ytimg.com/vi/Ezk2Sbegegg/maxresdefault.jpg',
          price: 0,
          level: 'Beginner',
          lectures: [
             { title: 'NeoG Level 0 Intro', url: 'https://www.youtube.com/watch?v=Ezk2Sbegegg' }
          ]
        }
      ]
    },
    {
       name: 'Kunal Kushwaha',
       email: 'kunal@communityclassroom.com',
       headline: 'Founder Community Classroom',
       bio: 'Famous for free high-quality quality education around Git and DevOps.',
       avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
       courses: [
         {
           title: 'Git & GitHub Tutorial',
           subtitle: 'Master Version Control.',
           description: 'Everything you need to know about Git and GitHub.',
           slug: 'git-kunal',
           category: 'development',
           thumbnail: 'https://i.ytimg.com/vi/apGV9Kg7ics/maxresdefault.jpg',
           price: 0,
           level: 'Beginner',
           lectures: [
             { title: 'Git Tutorial Intro', url: 'https://www.youtube.com/watch?v=apGV9Kg7ics' }
           ]
         }
       ]
    },
    {
      name: 'Coding Wallah',
      email: 'pw@physicswallah.com',
      headline: 'Alakh Pandey - Technology for All',
      bio: 'Revolutionizing technical education in India.',
      avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
      courses: [
        {
          title: 'Full Stack Bootcamp',
          subtitle: 'MERN Stack from basics.',
          description: 'A project based approach to full stack development.',
          slug: 'pw-fullstack',
          category: 'web-development',
          thumbnail: 'https://i.ytimg.com/vi/61XvkaM1J8E/maxresdefault.jpg',
          price: 0,
          level: 'Beginner',
          lectures: [
             { title: 'Bootcamp Introduction', url: 'https://www.youtube.com/watch?v=61XvkaM1J8E' }
          ]
        }
      ]
    },
    {
      name: 'MySirG.com',
      email: 'saurabh@mysirg.com',
      headline: 'Saurabh Shukla - Mastering C/C++',
      bio: 'One of India\'s most respected teachers for C and C++.',
      avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nNfV-b7v-Lp-V8W-L_gVl-K-V-L-K-V=s176-c-k-c0x00ffffff-no-rj',
      courses: [
        {
          title: 'C Programming for Beginners',
          subtitle: 'Solid foundation in C.',
          description: 'Learn C programming from the king of C, Saurabh Shukla.',
          slug: 'c-mysirg',
          category: 'development',
          thumbnail: 'https://i.ytimg.com/vi/K37Z6N1_44w/maxresdefault.jpg',
          price: 0,
          level: 'Beginner',
          lectures: [
             { title: 'C Programming Intro', url: 'https://www.youtube.com/watch?v=K37Z6N1_44w' }
          ]
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
        avatarUrl: creator.avatar,
      },
      create: {
        id: user.id,
        email: creator.email,
        fullName: creator.name,
        headline: creator.headline,
        bio: creator.bio,
        avatarUrl: creator.avatar
      }
    })

    // Create Courses
    for (const courseData of creator.courses) {
      console.log(`  Creating course: ${courseData.title}`)
      const course = await prisma.course.upsert({
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
        }
      })

      // Create Section
      const section = await prisma.section.upsert({
        where: { id: `section-${course.id}` }, // Fixed ID for upsert
        update: { title: 'Course Content' },
        create: {
          id: `section-${course.id}`,
          courseId: course.id,
          title: 'Course Content',
          sortOrder: 1
        }
      })

      // Create Lectures
      let sortOrder = 1
      for (const lec of courseData.lectures) {
        await prisma.lecture.upsert({
          where: { id: `lecture-${course.id}-${sortOrder}` },
          update: {
             title: lec.title,
             videoUrl: lec.url,
             isFreePreview: true
          },
          create: {
            id: `lecture-${course.id}-${sortOrder}`,
            courseId: course.id,
            sectionId: section.id,
            title: lec.title,
            videoUrl: lec.url,
            sortOrder: sortOrder++,
            isFreePreview: true,
            type: 'video'
          }
        })
      }
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
