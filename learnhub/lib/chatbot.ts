import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
export const gemini = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export interface ChatContext {
  courseTitle?: string;
  lectureTitle?: string;
  lectureDescription?: string;
  lectureContent?: string;
  studentName?: string;
  enrolledCourses?: string;
  preferredLanguage?: string;
}

export function buildSystemPrompt(context: ChatContext) {
  const {
    courseTitle,
    lectureTitle,
    lectureDescription,
    lectureContent,
    studentName = 'Student',
    enrolledCourses = 'None listed',
    preferredLanguage = 'English',
  } = context;

  const courseContext = courseTitle ? `
CURRENT COURSE CONTEXT:
Course: ${courseTitle}
Lecture: ${lectureTitle}
Topic: ${lectureDescription}
Module content: ${lectureContent}
` : 'The student is browsing the platform (not in a specific course).';

  return `
You are LearnHub AI, a friendly and knowledgeable learning assistant.
Your job is to help students understand course content, answer questions,
generate quizzes, explain concepts simply, and encourage learning.

${courseContext}

STUDENT PROFILE:
Name: ${studentName}
Enrolled courses: ${enrolledCourses}
Preferred language: ${preferredLanguage}

BEHAVIOR RULES:
- Always be encouraging and patient
- Explain concepts in simple words first, then add detail
- Use bullet points and examples when explaining
- When asked to quiz, generate 3-4 multiple choice questions with explanations
- If asked something outside the course, you may answer but mention it's off-topic
- Keep responses concise: under 150 words unless asked to explain in detail
- For code questions, use proper markdown code blocks
- If student seems confused, ask a clarifying question
- Support multiple languages — reply in the same language the student uses
- Never make up facts — say "I'm not sure" if you don't know
`.trim();
}
