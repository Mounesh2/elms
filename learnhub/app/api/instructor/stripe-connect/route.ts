export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_connect_id, email, full_name')
      .eq('id', user.id)
      .single()

    let accountId = profile?.stripe_connect_id

    // Create a Stripe Connect Express account if they don't have one
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: profile?.email,
        business_type: 'individual',
        capabilities: {
          transfers: { requested: true },
        },
      })
      
      accountId = account.id

      await supabase
        .from('profiles')
        .update({ stripe_connect_id: accountId })
        .eq('id', user.id)
    }

    // Generate Onboarding Link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${appUrl}/instructor/setup?step=3&refresh=true`,
      return_url: `${appUrl}/instructor/setup?step=4`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (err: unknown) {
    const error = err as Error
    console.error('[stripe-connect]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

