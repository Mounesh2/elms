export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    const body = await req.json()
    const { 
        name, 
        image, 
        title, 
        bio, 
        website, 
        twitter, 
        linkedin,
        username 
    } = body

    // Update User table
    if (name || image) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          ...(name && { name }),
          ...(image && { image })
        }
      })
    }

    // Update Profile table using upsert
    const profileData: any = {}
    if (name) profileData.fullName = name
    if (title !== undefined) profileData.headline = title
    if (bio !== undefined) profileData.bio = bio
    if (website !== undefined) profileData.websiteUrl = website
    if (twitter !== undefined) profileData.twitterUrl = twitter
    if (linkedin !== undefined) profileData.linkedinUrl = linkedin
    if (username !== undefined) profileData.username = username

    if (Object.keys(profileData).length > 0) {
      await prisma.profile.upsert({
        where: { id: session.user.id },
        update: profileData,
        create: {
          id: session.user.id,
          email: session.user.email!,
          ...profileData
        }
      })
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("[PROFILE_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

