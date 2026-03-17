import { NextRequest, NextResponse } from 'next/server'

// ─── Rate Limiter (in-memory, suitable for single-instance dev/preview) ────────
// For production multi-instance, replace with Redis (Upstash)
interface RateLimitStore {
  [key: string]: { count: number; resetAt: number }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
  max: number
  windowMs: number
  identifier?: string
}

export function rateLimit(req: NextRequest, config: RateLimitConfig): NextResponse | null {
  const max = config.max ?? Number(process.env.RATE_LIMIT_MAX ?? 100)
  const windowMs = config.windowMs ?? Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000)

  // Prefer configured identifier, then IP
  const ip =
    config.identifier ??
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const key = `${ip}:${req.nextUrl.pathname}`
  const now = Date.now()

  if (!store[key] || store[key].resetAt < now) {
    store[key] = { count: 1, resetAt: now + windowMs }
    return null // allow
  }

  store[key].count++

  if (store[key].count > max) {
    const retryAfter = Math.ceil((store[key].resetAt - now) / 1000)
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(max),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(store[key].resetAt),
        },
      }
    )
  }

  return null // allow
}

// ─── Clean up expired entries periodically ────────────────────────────────────
setInterval(() => {
  const now = Date.now()
  for (const key in store) {
    if (store[key].resetAt < now) {
      delete store[key]
    }
  }
}, 60_000)
