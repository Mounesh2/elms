export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import OpenAI from "openai"

// Groq is OpenAI compatible
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    // 1. Get user's enrolled courses
    const userEnrollments = await prisma.enrollment.findMany({
        where: { userId: session.user.id },
        include: { course: true }
    })
    const enrolledTitles = userEnrollments.map((e) => e.course.title)
    const enrolledIds = userEnrollments.map((e) => e.course.id)

    // 2. Get top 50 courses for potential recommendations
    const topCourses = await prisma.course.findMany({
        where: {
            id: { notIn: enrolledIds },
            isPublished: true
        },
        orderBy: [
            { averageRating: 'desc' },
            { totalStudents: 'desc' }
        ],
        take: 50
    })

    if (topCourses.length === 0) return NextResponse.json([])

    const availableCoursesStr = topCourses.map((c) => `ID: ${c.id}, Title: ${c.title}, Category: ${c.categoryId}`).join("\n")
    const enrolledCoursesStr = enrolledTitles.join(", ")

    // 3. Prompt Groq for recommendations
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional educational consultant for LearnHub. Recommend the best courses for the user based on their interests. Return ONLY a JSON object with a 'recommendations' key containing an array of course IDs."
        },
        {
          role: "user",
          content: `User is enrolled in: [${enrolledCoursesStr}]. 
          From these available courses, recommend up to 8 IDs the user would most benefit from, sorted by relevance:
          ${availableCoursesStr}`
        }
      ],
      model: process.env.GROQ_MODEL || "llama3-7b-8192",
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0]?.message?.content || '{"recommendations": []}'
    const response = JSON.parse(content)
    const recommendedIds = response.recommendations || []

    // 4. Fetch the full course data for recommended IDs
    if (recommendedIds.length === 0) return NextResponse.json(topCourses.slice(0, 8))

    const recommendedCourses = await prisma.course.findMany({
        where: {
            id: { in: recommendedIds }
        },
        include: { instructor: true }
    })

    return NextResponse.json(recommendedCourses)
  } catch (error) {
    console.error("[RECOMMENDATIONS_ERROR]", error)
    // Fallback to top rated
    const fallBack = await prisma.course.findMany({
        where: { isPublished: true },
        orderBy: { averageRating: 'desc' },
        take: 8,
        include: { instructor: true }
    })
    return NextResponse.json(fallBack)
  }
}
