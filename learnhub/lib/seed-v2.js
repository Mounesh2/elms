const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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
    { name: 'Knowledge Gate', email: 'sanchit@knowledgegate.in' },
    { name: 'Geeky Shows', email: 'geeky@geekyshows.com' },
    { name: 'WsCube Tech', email: 'info@wscubetech.com' },
    { name: 'Intellipaat', email: 'sales@intellipaat.com' },
    { name: 'Simplilearn', email: 'info@simplilearn.com' },
    { name: 'Great Learning', email: 'info@greatlearning.com' },
    { name: 'Scaler', email: 'info@scaler.com' },
    { name: 'Coding Ninjas', email: 'info@codingninjas.com' },
    { name: 'Edureka', email: 'info@edureka.co' },
    { name: 'Unacademy Computer Science', email: 'info@unacademy.com' },
    { name: 'Physics Wallah Skills', email: 'info@pwskills.com' },
    { name: 'CodeWithMosh India', email: 'mosh@codewithmosh.com' },
    { name: 'NPTEL', email: 'info@nptel.ac.in' },
    { name: 'freeCodeCamp Hindi', email: 'info@freecodecamp.org' },
    { name: 'TechTFQ', email: 'techtfq@gmail.com' },
    { name: 'Jenny\'s Lectures CS/IT', email: 'jenny@jennyslectures.com' },
    { name: 'Gate Smashers', email: 'info@gatesmashers.in' },
    { name: 'MySirG.com', email: 'saurabh@mysirg.com' },
    { name: 'Code Step By Step', email: 'anil@codestepbystep.com' },
    { name: 'Geeky Codes', email: 'geeky@geekycodes.com' },
    { name: 'CodeHelp Hindi', email: 'hindi@codehelp.in' },
    { name: 'Love Babbar', email: 'love@codehelp.in' }
  ]

  const courses = [
    { title: 'Sigma Web Development Course', slug: 'sigma-web-development', instructor: 'Apna College', cat: 'web-development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/l1EssrLxt7E/hqdefault.jpg' },
    { title: 'Sigma Web Development Course 2.0', slug: 'harry-sigma-webdev', instructor: 'CodeWithHarry', cat: 'web-development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/tVzUXW6siu0/hqdefault.jpg' },
    { title: 'DSA Supreme Batch', slug: 'dsa-supreme-babbar', instructor: 'CodeHelp - by Babbar', cat: 'development', level: 'Intermediate', thumb: 'https://i.ytimg.com/vi/WQoB2z67hvY/hqdefault.jpg' },
    { title: 'Complete Git & GitHub Course', slug: 'git-github-kunal', instructor: 'Kunal Kushwaha', cat: 'development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/apGV9Kg7ics/hqdefault.jpg' },
    { title: 'Complete React JS Course', slug: 'react-thapa-technical', instructor: 'Thapa Technical', cat: 'web-development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/0W6i5LYKCSI/hqdefault.jpg' },
    { title: 'A-Z DSA Course', slug: 'striver-a-z-dsa', instructor: 'Striver (take U forward)', cat: 'development', level: 'All_Levels', thumb: 'https://i.ytimg.com/vi/S77He-Gat-U/hqdefault.jpg' },
    { title: 'Full Stack MERN & Next.js', slug: 'harkirat-full-stack', instructor: 'Harkirat Singh', cat: 'web-development', level: 'Intermediate', thumb: 'https://i.ytimg.com/vi/SqcY0GlETPk/hqdefault.jpg' },
    { title: 'Complete Next.js 14 Course', slug: 'piyush-nextjs-14', instructor: 'Piyush Garg', cat: 'web-development', level: 'Intermediate', thumb: 'https://i.ytimg.com/vi/uC_f_Mv2y8I/hqdefault.jpg' },
    { title: 'DBMS Complete Playlist', slug: 'kg-dbms', instructor: 'Knowledge Gate', cat: 'computer-science', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/kBdlM6hHUXU/hqdefault.jpg' },
    { title: 'React JS Mastery', slug: 'geeky-react', instructor: 'Geeky Shows', cat: 'web-development', level: 'Advanced', thumb: 'https://i.ytimg.com/vi/5_5oE5lVst0/hqdefault.jpg' },
    { title: 'Python Full Course 2024', slug: 'wscube-python', instructor: 'WsCube Tech', cat: 'development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/m67-b27UopM/hqdefault.jpg' },
    { title: 'Data Science with Python', slug: 'intellipaat-ds', instructor: 'Intellipaat', cat: 'development', level: 'Intermediate', thumb: 'https://i.ytimg.com/vi/mI6fO13Msls/hqdefault.jpg' },
    { title: 'Full Stack Java Course', slug: 'simplilearn-java', instructor: 'Simplilearn', cat: 'development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/X0S39pUPpNo/hqdefault.jpg' },
    { title: 'Artificial Intelligence Tutorial', slug: 'gl-ai', instructor: 'Great Learning', cat: 'computer-science', level: 'Intermediate', thumb: 'https://i.ytimg.com/vi/m5On-Y8zC8k/hqdefault.jpg' },
    { title: 'System Design Course', slug: 'scaler-system-design', instructor: 'Scaler', cat: 'development', level: 'Advanced', thumb: 'https://i.ytimg.com/vi/xpDnVSm6dNo/hqdefault.jpg' },
    { title: 'C++ Foundation to Advanced', slug: 'cn-cpp', instructor: 'Coding Ninjas', cat: 'development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/vLnPwxZdW4Y/hqdefault.jpg' },
    { title: 'Cyber Security Full Course', slug: 'edureka-cyber', instructor: 'Edureka', cat: 'computer-science', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/PlHnamdwGmw/hqdefault.jpg' },
    { title: 'Java for Beginners', slug: 'unacademy-java', instructor: 'Unacademy Computer Science', cat: 'development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/IsM2G0fXUuU/hqdefault.jpg' },
    { title: 'Web Development Bootcamp', slug: 'pw-web', instructor: 'Physics Wallah Skills', cat: 'web-development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/zIdp0L6I-v8/hqdefault.jpg' },
    { title: 'Ultimate JavaScript Mastery', slug: 'mosh-js', instructor: 'CodeWithMosh India', cat: 'web-development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/W6NZfCO5SIk/hqdefault.jpg' },
    { title: 'Operating Systems', slug: 'nptel-os', instructor: 'NPTEL', cat: 'computer-science', level: 'Intermediate', thumb: 'https://i.ytimg.com/vi/ro8vL9f9Xp0/hqdefault.jpg' },
    { title: 'Responsive Web Design', slug: 'fcc-responsive', instructor: 'freeCodeCamp Hindi', cat: 'web-development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/pQN-pnXPaVg/hqdefault.jpg' },
    { title: 'SQL for Data Science', slug: 'techtfq-sql', instructor: 'TechTFQ', cat: 'development', level: 'Intermediate', thumb: 'https://i.ytimg.com/vi/HXV3zeQKqGY/hqdefault.jpg' },
    { title: 'Data Structures & Algorithms', slug: 'jenny-dsa', instructor: 'Jenny\'s Lectures CS/IT', cat: 'computer-science', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/AT14lCXuMKI/hqdefault.jpg' },
    { title: 'GATE Computer Science', slug: 'gsm-gate-cs', instructor: 'Gate Smashers', cat: 'computer-science', level: 'Advanced', thumb: 'https://i.ytimg.com/vi/97K9VpsSjWA/hqdefault.jpg' },
    { title: 'C Language Full Course', slug: 'mysirg-c', instructor: 'MySirG.com', cat: 'development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/3t9E_BFrL68/hqdefault.jpg' },
    { title: 'Node JS Tutorial', slug: 'csbs-node', instructor: 'Code Step By Step', cat: 'web-development', level: 'Intermediate', thumb: 'https://i.ytimg.com/vi/vJpS3I3E9_M/hqdefault.jpg' },
    { title: 'Android App Development', slug: 'gc-android', instructor: 'Geeky Codes', cat: 'development', level: 'Beginner', thumb: 'https://i.ytimg.com/vi/fis26HvvDII/hqdefault.jpg' },
    { title: 'Full Stack Development', slug: 'ch-full-stack', instructor: 'CodeHelp Hindi', cat: 'web-development', level: 'Intermediate', thumb: 'https://i.ytimg.com/vi/u2Z6_Wp_YF8/hqdefault.jpg' },
    { title: 'C++ & DSA Mentor', slug: 'love-cpp-dsa', instructor: 'Love Babbar', cat: 'development', level: 'All_Levels', thumb: 'https://i.ytimg.com/vi/WQoB2z67hvY/hqdefault.jpg' }
  ]

  const categories = await prisma.category.findMany()
  const catMap = new Map(categories.map(c => [c.slug, c.id]))
  const getCatId = (slug) => catMap.get(slug) || catMap.get('development') || categories[0].id

  console.log('Seeding educators...')
  for (const ed of educators) {
    try {
      await prisma.user.upsert({
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
    if (!instructorId) continue
    
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
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
