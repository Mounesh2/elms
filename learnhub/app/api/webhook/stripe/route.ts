export const dynamic = 'force-dynamic'

import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import prisma from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as any,
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const userId = session?.metadata?.userId
    const courseIds = JSON.parse(session?.metadata?.courseIds || "[]")

    if (!userId || courseIds.length === 0) {
      return new NextResponse("Webhook Error: Missing metadata", { status: 400 })
    }

    // Process enrollments using a transaction for atomicity
    await prisma.$transaction(async (tx) => {
        for (const courseId of courseIds) {
          await tx.enrollment.create({
            data: {
                userId,
                courseId,
                pricePaid: (session.amount_total! / 100),
                enrollmentType: "paid",
            }
          })
        }

        // Record order
        await tx.order.create({
            data: {
                userId,
                stripePaymentIntentId: session.payment_intent as string,
                amount: (session.amount_total! / 100),
                status: "completed",
            }
        })
    })
  }

  return new NextResponse(null, { status: 200 })
}

