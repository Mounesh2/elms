import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role: string
    isInstructor: boolean
    isAdmin: boolean
  }

  interface Session {
    user: {
      id: string
      role: string
      isInstructor: boolean
      isAdmin: boolean
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    isInstructor: boolean
    isAdmin: boolean
  }
}
