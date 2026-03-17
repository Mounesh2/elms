import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { db } from "./index"
import { categories, courses, sections, lectures, profiles } from "./schema"
import { users } from "./schema"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

// THIS SCRIPT IS FOR MANUAL SEEDING VIA NODE OR A SCRIPT RUNNER
// WE SHOULD ALSO HAVE A SQL SEED FOR CONVENIENCE

export async function seed() {
  console.log("Seeding database...")

  // 1. Create a demo instructor (using a static ID for idempotency)
  const instructorId = "837f8c96-646d-4b89-8a6a-bf781d999999"
  const hashedInstructorPassword = await bcrypt.hash("instructor123", 12)
  
  try {
    await db.insert(users).values({
        id: instructorId,
        name: "John Instructor",
        email: "instructor@example.com",
        password: hashedInstructorPassword,
        role: "instructor",
        isInstructor: true,
      }).onConflictDoUpdate({
        target: users.email,
        set: { updatedAt: new Date() }
      })
    
      // 1b. Create a profile for the instructor (Required by foreign key)
      await db.insert(profiles).values({
        id: instructorId,
        email: "instructor@example.com",
        fullName: "John Instructor",
        username: "johninstructor",
        headline: "Expert Web Developer",
      }).onConflictDoNothing()
    
      // 2. Create categories
      await db.insert(categories).values([
        {
          id: uuidv4(),
          name: "Development",
          slug: "development",
          description: "Learn to build software",
          icon: "Code",
        },
        {
          id: uuidv4(),
          name: "Business",
          slug: "business",
          description: "Master the art of business",
          icon: "Briefcase",
        },
        {
          id: uuidv4(),
          name: "Design",
          slug: "design",
          description: "Create beautiful graphics",
          icon: "PenTool",
        },
      ]).onConflictDoNothing()
    
      // 3. Create a demo course
      // Fetch the Development category ID to link the course
      const devCategory = await db.query.categories.findFirst({
        where: (categories, { eq }) => eq(categories.slug, 'development'),
      })

      const courseId = uuidv4()
      await db.insert(courses).values({
        id: courseId,
        instructorId,
        title: "Complete Web Development Bootcamp",
        slug: "complete-web-development-bootcamp",
        subtitle: "Learn HTML, CSS, JavaScript, React, and Node.js",
        description: "The most comprehensive web development course on the market.",
        categoryId: devCategory?.id || null,
        price: "99.99",
        isPublished: true,
        status: "published",
        totalStudents: 1200,
        averageRating: "4.8",
      }).onConflictDoNothing()
    
      // 4. Create sections and lectures
      const sectionId = uuidv4()
      await db.insert(sections).values({
        id: sectionId,
        courseId,
        title: "Introduction",
        sortOrder: 1,
      }).onConflictDoNothing()
    
      await db.insert(lectures).values([
        {
          id: uuidv4(),
          courseId,
          sectionId,
          title: "Welcome to the course",
          sortOrder: 1,
          durationSeconds: 300,
          videoUrl: "https://example.com/videos/welcome.mp4",
          isFreePreview: true,
        },
        {
          id: uuidv4(),
          courseId,
          sectionId,
          title: "How to get help",
          sortOrder: 2,
          durationSeconds: 120,
          videoUrl: "https://example.com/videos/help.mp4",
        },
      ]).onConflictDoNothing()
    
      console.log("Seeding complete!")
  } catch (err) {
      console.error("Seed error:", err)
      process.exit(1)
  }
}

// Run seeding
seed()
  .then(() => {
    console.log("Seeding process finished successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding process failed:", err);
    process.exit(1);
  });
