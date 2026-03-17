import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getCategories } from "@/lib/db/queries"
import CreateCourseForm from "@/components/instructor/CreateCourseForm"

export default async function CreateCoursePage() {
  const session = await auth()
  if (!session?.user || !session.user.isInstructor) {
    redirect("/")
  }

  const categories = await getCategories()

  return <CreateCourseForm categories={categories} />
}