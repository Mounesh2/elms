import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { chatMessages, chatRateLimits } from "@/lib/db/chatbot-schema";
import { groq, buildSystemPrompt } from "@/lib/chatbot";
import prisma from "@/lib/prisma";
import { eq, and, sql } from "drizzle-orm";

export const runtime = "edge";

export async function POST(request: Request) {
  const session = await auth();
  const { message, sessionId, courseId, lectureId, history } = await request.json();
  
  // Allow anonymous chat using sessionId if no user is logged in
  const userId = session?.user?.id || sessionId || 'anonymous';
  const today = new Date().toISOString().split("T")[0];

  // 1. Check Rate Limit (20 per day)
  try {
    const [rateLimit] = await db
      .select()
      .from(chatRateLimits)
      .where(and(eq(chatRateLimits.userId, userId), eq(chatRateLimits.date, today)));

    if (rateLimit && (rateLimit.count ?? 0) >= 20) {
      return NextResponse.json(
        { error: "You've used your 20 daily messages. Resets at midnight." },
        { status: 429 }
      );
    }

    // Upsert rate limit count
    await db
      .insert(chatRateLimits)
      .values({ userId, date: today, count: 1 })
      .onConflictDoUpdate({
        target: [chatRateLimits.userId, chatRateLimits.date],
        set: { count: sql`${chatRateLimits.count} + 1` },
      });
  } catch (error) {
    console.error("Rate limit check error:", error);
    // Continue anyway if rate limit check fails to avoid blocking user
  }

  // 2. Fetch Context if courseId/lectureId provided
  const chatContext = {
    studentName: session?.user?.name || "Guest",
    preferredLanguage: "English",
  };

  if (courseId) {
    const isUuid = courseId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    const course = await prisma.course.findFirst({
      where: isUuid ? { id: courseId } : { slug: courseId },
      include: {
        sections: {
          include: { lectures: { where: { id: lectureId } } },
        },
      },
    });

    if (course) {
      const lecture = course.sections.flatMap((s) => s.lectures)[0];
      Object.assign(chatContext, {
        courseTitle: course.title,
        lectureTitle: lecture?.title,
        lectureDescription: course.subtitle, // Or actual description
        lectureContent: lecture?.articleContent,
      });
    }
  }

  // 3. Build Messages for Groq
  const systemPrompt = buildSystemPrompt(chatContext);
  const messages = [
    { role: "system", content: systemPrompt },
    ...(history || []).slice(-10).map((m: any) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user", content: message },
  ];

  // 4. Stream Response
  try {
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages as any,
      stream: true,
      max_tokens: 600,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            fullResponse += text;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }

          // Save messages to DB after streaming completes
          // user message
          await db.insert(chatMessages).values({
            userId,
            sessionId,
            role: "user",
            content: message,
            courseId: courseId || null,
            lectureId: lectureId || null,
          });

          // assistant response
          await db.insert(chatMessages).values({
            userId,
            sessionId,
            role: "assistant",
            content: fullResponse,
            courseId: courseId || null,
            lectureId: lectureId || null,
          });

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          console.error("Streaming error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
  }
}
