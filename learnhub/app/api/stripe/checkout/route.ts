export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as any,
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { courseIds } = await req.json()

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return new NextResponse("Invalid course IDs", { status: 400 })
    }

    // Fetch courses to get prices
    const purchasedCourses = await prisma.course.findMany({
      where: {
        id: { in: courseIds }
      },
    })

    if (purchasedCourses.length === 0) {
      return new NextResponse("No courses found", { status: 404 })
    }

    // Create Stripe line items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = purchasedCourses.map((course) => ({
      quantity: 1,
      price_data: {
        currency: "usd",
        product_data: {
          name: course.title,
          description: course.subtitle || undefined,
          images: course.thumbnailUrl ? [course.thumbnailUrl] : [],
        },
        unit_amount: Math.round(course.price.toNumber() * 100),
      },
    }))

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email!,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        userId: session.user.id,
        courseIds: JSON.stringify(courseIds),
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("[STRIPE_CHECKOUT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

