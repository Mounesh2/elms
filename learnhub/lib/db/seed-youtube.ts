import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { db } from "./index"
import { categories, courses, sections, lectures, profiles, users } from "./schema"
import { v4 as uuidv4 } from "uuid"

async function seedYouTube() {
  console.log("🚀 Starting YouTube Course Seeding...")

  try {
    // 1. Define Instructors
    const instructors = [
      {
        id: "cwh-user-id-0001",
        name: "CodeWithHarry",
        email: "harry@codewithharry.com",
        username: "codewithharry",
        headline: "Ultimate Web Development & Programming Instructor",
        bio: "Harry is one of India's most popular coding instructors, known for his Sigma Web Dev and 100 Days of Python series.",
        image: "https://yt3.googleusercontent.com/ytc/AIdro_nO39_99_99_99=s176-c-k-c0x00ffffff-no-rj"
      },
      {
        id: "apna-user-id-0002",
        name: "Apna College",
        email: "shradha@apnacollege.in",
        username: "apnacollege",
        headline: "Placement Oriented Coding Education",
        bio: "Shradha Khapra and the Apna College team help millions of students crack top tech companies with Delta and Alpha courses.",
        image: "https://yt3.googleusercontent.com/ytc/AIdro_nO39_99_99_99=s176-c-k-c0x00ffffff-no-rj"
      },
      {
        id: "algo-user-id-0003",
        name: "Algorithms365",
        email: "info@algorithms365.com",
        username: "algorithms365",
        headline: "Mastering DSA in Kannada & English",
        bio: "Specializing in Data Structures, Algorithms, and Interview Prep for students in Karnataka and beyond.",
        image: "https://yt3.googleusercontent.com/ytc/AIdro_nO39_99_99_99=s176-c-k-c0x00ffffff-no-rj"
      }
    ]

    for (const inst of instructors) {
      await db.insert(users).values({
        id: inst.id,
        name: inst.name,
        email: inst.email,
        role: "instructor",
        isInstructor: true,
        image: inst.image,
      }).onConflictDoUpdate({
        target: users.email,
        set: { image: inst.image }
      })

      await db.insert(profiles).values({
        id: inst.id,
        email: inst.email,
        fullName: inst.name,
        username: inst.username,
        headline: inst.headline,
        bio: inst.bio,
        avatarUrl: inst.image,
      }).onConflictDoUpdate({
        target: profiles.id,
        set: { avatarUrl: inst.image, bio: inst.bio }
      })
    }

    // 2. Fetch Category
    const devCategory = await db.query.categories.findFirst({
      where: (categories, { eq }) => eq(categories.slug, 'development'),
    })

    if (!devCategory) {
      console.error("Development category not found. Please run main seed first.")
      return
    }

    // 3. Define Courses
    const youtubeCourses = [
      {
        id: uuidv4(),
        instructorId: "cwh-user-id-0001",
        title: "Sigma Web Development Course",
        slug: "sigma-web-development",
        subtitle: "The most complete web development course on YouTube",
        description: "Learn HTML, CSS, JavaScript, Node.js, and more with industry projects.",
        thumbnailUrl: "https://i.ytimg.com/vi/tVzUXW6siu0/maxresdefault.jpg",
        previewVideoUrl: "https://www.youtube.com/watch?v=tVzUXW6siu0",
        price: "0",
        isFree: true,
        isPublished: true,
        status: "published" as const,
        lectures: [
          { title: "Introduction to Web Development", url: "https://www.youtube.com/watch?v=tVzUXW6siu0" },
          { title: "HTML Tutorial for Beginners", url: "https://www.youtube.com/watch?v=BsDoLVMnmLu" },
          { title: "CSS Tutorial for Beginners", url: "https://www.youtube.com/watch?v=Edsxf_NBFrw" }
        ]
      },
      {
        id: uuidv4(),
        instructorId: "apna-user-id-0002",
        title: "Delta Full Stack Web Development",
        slug: "delta-full-stack",
        subtitle: "Complete MERN Stack Roadmap",
        description: "Zero to Hero course for placements covering full stack technologies.",
        thumbnailUrl: "https://i.ytimg.com/vi/l1EssrLxt7E/maxresdefault.jpg",
        previewVideoUrl: "https://www.youtube.com/watch?v=l1EssrLxt7E",
        price: "0",
        isFree: true,
        isPublished: true,
        status: "published" as const,
        lectures: [
          { title: "Web Dev Roadmap 2024", url: "https://www.youtube.com/watch?v=l1EssrLxt7E" },
          { title: "Introduction to JavaScript", url: "https://www.youtube.com/watch?v=VlPiVmYql6w" },
          { title: "Node.js & Express Basics", url: "https://www.youtube.com/watch?v=yEHCfRWzEpx" }
        ]
      },
      {
        id: uuidv4(),
        instructorId: "algo-user-id-0003",
        title: "Master DSA in C (Kannada)",
        slug: "dsa-in-c-kannada",
        subtitle: "Learn Data Structures & Algorithms easily",
        description: "Comprehensive DSA course explained in Kannada for better understanding.",
        thumbnailUrl: "https://i.ytimg.com/vi/kum6iQiO-6w/maxresdefault.jpg",
        previewVideoUrl: "https://www.youtube.com/watch?v=kum6iQiO-6w",
        price: "0",
        isFree: true,
        isPublished: true,
        status: "published" as const,
        lectures: [
          { title: "Course Introduction", url: "https://www.youtube.com/watch?v=kum6iQiO-6w" },
          { title: "How to think like a Coder", url: "https://www.youtube.com/watch?v=7_LPdttKXPc" }
        ]
      }
    ]

    for (const c of youtubeCourses) {
      await db.insert(courses).values({
        id: c.id,
        instructorId: c.instructorId,
        title: c.title,
        slug: c.slug,
        subtitle: c.subtitle,
        description: c.description,
        categoryId: devCategory.id,
        thumbnailUrl: c.thumbnailUrl,
        previewVideoUrl: c.previewVideoUrl,
        price: c.price,
        isFree: c.isFree,
        isPublished: c.isPublished,
        status: c.status,
      }).onConflictDoNothing()

      const sectionId = uuidv4()
      await db.insert(sections).values({
        id: sectionId,
        courseId: c.id,
        title: "Course Content",
        sortOrder: 1,
      }).onConflictDoNothing()

      let sortOrder = 1
      for (const lec of c.lectures) {
        await db.insert(lectures).values({
          id: uuidv4(),
          courseId: c.id,
          sectionId: sectionId,
          title: lec.title,
          videoUrl: lec.url,
          sortOrder: sortOrder++,
          isFreePreview: true,
        }).onConflictDoNothing()
      }
    }

    console.log("✅ YouTube Course Seeding Complete!")
  } catch (err) {
    console.error("❌ Seeding Error:", err)
  }
}

seedYouTube().then(() => process.exit(0))
