export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import OpenAI from "openai"

// Groq is OpenAI compatible
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new NextResponse("Invalid messages format", { status: 400 })
    }

    const systemPrompt = {
      role: "system",
      content: `You are a helpful, enthusiastic, and knowledgeable educational assistant for LearnHub, an online learning platform similar to Udemy or Coursera. 
      Your goal is to help students find courses, answer questions about learning paths, and provide encouraging advice.
      Keep your responses concise, friendly, and formatted nicely. Do not use overly formal language.
      If asked about specific features, mention that we offer a wide variety of development, business, and design courses, and we have a new section on "Understanding Hugging Face".`
    }

    const completion = await groq.chat.completions.create({
      messages: [systemPrompt, ...messages],
      model: "llama-3.1-8b-instant", // Using currently active groq model
      max_tokens: 500,
      temperature: 0.7,
    })

    const responseMessage = completion.choices[0]?.message?.content || "I'm sorry, I couldn't formulate a response right now."

    return NextResponse.json({ message: responseMessage })
  } catch (error) {
    console.error("[CHAT_ERROR]", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

