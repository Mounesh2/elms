import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { chatMessages } from "@/lib/db/chatbot-schema";
import { eq, and, asc } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID required" }, { status: 400 });
  }

  try {
    const history = await db
      .select()
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.userId, session.user.id),
          eq(chatMessages.sessionId, sessionId)
        )
      )
      .orderBy(asc(chatMessages.createdAt))
      .limit(20);

    return NextResponse.json(history);
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID required" }, { status: 400 });
  }

  try {
    await db
      .delete(chatMessages)
      .where(
        and(
          eq(chatMessages.userId, session.user.id),
          eq(chatMessages.sessionId, sessionId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("History delete error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
