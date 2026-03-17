import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
  typescript: true,
})

// ─── Create Payment Intent ────────────────────────────────────────────────────
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata: Record<string, string> = {}
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // convert to cents
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  })
  return paymentIntent
}

// ─── Construct Webhook Event ──────────────────────────────────────────────────
export function constructWebhookEvent(
  body: string | Buffer,
  signature: string
) {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
}

// ─── Create/Retrieve Customer ─────────────────────────────────────────────────
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name: string
) {
  // Search for existing customer
  const existing = await stripe.customers.search({
    query: `metadata['user_id']:'${userId}'`,
    limit: 1,
  })

  if (existing.data.length > 0) {
    return existing.data[0]
  }

  return stripe.customers.create({
    email,
    name,
    metadata: { user_id: userId },
  })
}

// ─── Create Connected Account (for instructors) ───────────────────────────────
export async function createConnectedAccount(
  email: string,
  userId: string
) {
  return stripe.accounts.create({
    type: 'express',
    email,
    metadata: { user_id: userId },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  })
}

// ─── Create Account Link (onboarding) ────────────────────────────────────────
export async function createAccountLink(accountId: string) {
  return stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/instructor/stripe/refresh`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/instructor/stripe/return`,
    type: 'account_onboarding',
  })
}

// ─── Calculate platform fee ───────────────────────────────────────────────────
export function calculatePlatformFee(amount: number): number {
  const feePercent = Number(process.env.STRIPE_PLATFORM_FEE_PERCENT ?? 30)
  return Math.round(amount * 100 * (feePercent / 100))
}

// ─── Format amount for display ────────────────────────────────────────────────
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}
