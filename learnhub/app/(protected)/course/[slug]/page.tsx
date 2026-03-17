import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getCourseBySlug } from "@/lib/db/queries"
import prisma from "@/lib/prisma"
import CoursePlayer from "@/components/course/CoursePlayer"

interface CoursePageProps {
  params: {
    slug: string
  }
}

export default async function ProtectedCoursePage({ params }: CoursePageProps) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const course = await getCourseBySlug(params.slug)
  if (!course) redirect("/courses")

  // Check enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: {
        userId: session.user.id,
        courseId: course.id
    }
  })

  // If not enrolled and not admin/instructor of the course, redirect to landing page
  if (!enrollment && session.user.role !== "admin" && course.instructorId !== session.user.id) {
    redirect(`/courses/${params.slug}`)
  }

  // Transform data for the client component
  const transformedCourse = {
    id: course.id,
    title: course.title,
    sections: course.sections.map((section: any) => ({
        id: section.id,
        title: section.title,
        lectures: section.lectures.map((lecture: any) => ({
            id: lecture.id,
            title: lecture.title,
            videoUrl: lecture.videoUrl || "",
            completed: false, // We'd fetch actual progress here
            durationSeconds: lecture.durationSeconds
        }))
    }))
  }

  return <CoursePlayer course={transformedCourse as any} />
}
