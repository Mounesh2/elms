export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    const { courseId, question, context } = await req.json()

    // Fetch course details for context
    const course = await prisma.course.findUnique({
        where: { id: courseId }
    })

    if (!course) return new NextResponse("Course not found", { status: 404 })

    const prompt = `
      You are an AI teaching assistant for the course "${course.title}".
      Your goal is to help the student understand the material.
      
      Course Description: ${course.description}
      Current Context (e.g., lecture title or transcript): ${context}
      
      Student's Question: ${question}
      
      Provide a helpful, concise, and educational response. If you don't know the answer or it's outside the course scope, politely say so.
    `

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const answer = data.choices[0].message.content

    return NextResponse.json({ answer })
  } catch (error) {
    console.error("[GROQ_AI_ASSISTANT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

