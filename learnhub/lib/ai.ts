import OpenAI from 'openai'
import type { AIChatMessage, AIRecommendation } from '@/types'

// ─── Groq Client (OpenAI-compatible) ─────────────────────────────────────────
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: 'https://api.groq.com/openai/v1',
})

const MODEL = process.env.GROQ_MODEL ?? 'llama3-70b-8192'

// ─── AI Course Assistant ──────────────────────────────────────────────────────
export async function getCourseAssistantResponse(
  messages: AIChatMessage[],
  courseContext: {
    title: string
    description: string
    currentLecture?: string
  }
): Promise<string> {
  const systemPrompt = `You are a helpful learning assistant for the course "${courseContext.title}". 
  Your role is to help students understand the course material, answer questions about the content, 
  and provide additional explanations or examples.
  
  Course description: ${courseContext.description}
  ${courseContext.currentLecture ? `Current lecture: ${courseContext.currentLecture}` : ''}
  
  Be concise, educational, and encouraging. Use markdown formatting when helpful.`

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ],
    max_tokens: 1024,
    temperature: 0.7,
    stream: false,
  })

  return completion.choices[0]?.message?.content ?? 'I apologize, but I could not generate a response.'
}

// ─── Streaming AI Assistant ───────────────────────────────────────────────────
export async function streamCourseAssistant(
  messages: AIChatMessage[],
  courseContext: { title: string; description: string }
) {
  const systemPrompt = `You are a helpful learning assistant for "${courseContext.title}". 
  Help students understand the material and answer questions clearly and concisely.`

  const stream = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ],
    max_tokens: 1024,
    temperature: 0.7,
    stream: true,
  })

  return stream
}

// ─── AI Course Recommendations ────────────────────────────────────────────────
export async function generateCourseRecommendations(
  userHistory: { courseTitles: string[]; completedTopics: string[] },
  availableCourses: { id: string; title: string; description: string; category: string }[]
): Promise<{ course_id: string; reason: string; score: number }[]> {
  const prompt = `Based on a student's learning history and available courses, recommend the top 5 most relevant courses.

Student's learning history:
- Completed courses: ${userHistory.courseTitles.join(', ') || 'None yet'}
- Topics studied: ${userHistory.completedTopics.join(', ') || 'None yet'}

Available courses (id | title | category):
${availableCourses.map((c) => `${c.id} | ${c.title} | ${c.category}`).join('\n')}

Respond ONLY with a JSON array of objects with: course_id, reason (1 sentence), score (0-100).
No other text.`

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 512,
    temperature: 0.3,
    response_format: { type: 'json_object' },
  })

  try {
    const content = completion.choices[0]?.message?.content ?? '{}'
    const parsed = JSON.parse(content)
    return Array.isArray(parsed) ? parsed : parsed.recommendations ?? []
  } catch {
    return []
  }
}

// ─── AI Course Description Generator ─────────────────────────────────────────
export async function generateCourseDescription(params: {
  title: string
  topics: string[]
  level: string
  targetAudience: string
}): Promise<string> {
  const prompt = `Write a compelling course description for a ${params.level} level online course.

Course title: ${params.title}
Topics covered: ${params.topics.join(', ')}
Target audience: ${params.targetAudience}

Requirements:
- Write 2-3 paragraphs
- Highlight what students will learn
- Be engaging and professional
- Use markdown formatting`

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 512,
    temperature: 0.8,
  })

  return completion.choices[0]?.message?.content ?? ''
}

// ─── AI Quiz Generator ────────────────────────────────────────────────────────
export async function generateQuizQuestions(
  lectureContent: string,
  count: number = 5
): Promise<{ question: string; options: string[]; correct_option_index: number; explanation: string }[]> {
  const prompt = `Generate ${count} multiple-choice quiz questions based on this lecture content:

${lectureContent.slice(0, 3000)}

Respond ONLY with a JSON array where each object has:
- question: string
- options: array of 4 strings
- correct_option_index: number (0-3)
- explanation: string (brief explanation of the correct answer)

No other text.`

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1024,
    temperature: 0.5,
    response_format: { type: 'json_object' },
  })

  try {
    const content = completion.choices[0]?.message?.content ?? '[]'
    const parsed = JSON.parse(content)
    return Array.isArray(parsed) ? parsed : parsed.questions ?? []
  } catch {
    return []
  }
}

// ─── AI Summarize Lecture ─────────────────────────────────────────────────────
export async function summarizeLecture(content: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'user',
        content: `Summarize this lecture content in 3-5 bullet points. Use markdown:\n\n${content.slice(0, 4000)}`,
      },
    ],
    max_tokens: 256,
    temperature: 0.5,
  })
  return completion.choices[0]?.message?.content ?? ''
}
