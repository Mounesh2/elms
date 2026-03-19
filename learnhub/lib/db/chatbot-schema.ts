import { pgTable, text, timestamp, uuid, integer, pgEnum, date, uniqueIndex } from "drizzle-orm/pg-core";

export const chatRoleEnum = pgEnum("chat_role", ["user", "assistant"]);

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(), // Matching existing profile ID (text)
  sessionId: uuid("session_id").notNull(),
  role: text("role").notNull(), // Will use check constraint in SQL or just trust app logic
  content: text("content").notNull(),
  courseId: uuid("course_id"), // References courses.id
  lectureId: uuid("lecture_id"), // References lectures.id
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const chatRateLimits = pgTable("chat_rate_limits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  date: date("date").defaultNow(),
  count: integer("count").default(0),
}, (table) => ({
  userDateIdx: uniqueIndex("user_date_idx").on(table.userId, table.date),
}));
