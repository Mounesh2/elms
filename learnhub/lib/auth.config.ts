import type { NextAuthConfig } from "next-auth"

// This configuration is used in Middleware.ts which runs on Vercel Edge Runtime.
// DO NOT import any Node.js native modules (like 'crypto', 'fs', 'bcryptjs', or 'prisma' client) here.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.isInstructor = (user as any).isInstructor
        token.isAdmin = (user as any).isAdmin
      }
      
      if (trigger === "update" && session) {
        token = { ...token, ...session }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.isInstructor = token.isInstructor as boolean
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    },
  },
  providers: [], // Add shared providers like Google/GitHub here if they don't use non-edge code
} satisfies NextAuthConfig
