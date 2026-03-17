export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  return NextResponse.json({ success: true, message: 'Route: app/api/certificates/route.ts' })
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ success: true, message: 'Route: app/api/certificates/route.ts' })
}
