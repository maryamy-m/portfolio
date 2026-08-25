import { NextResponse } from 'next/server'
import {
  HINT_COOKIE,
  HINT_MAX_AGE,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  isConfigured,
  passwordMatches,
  signInSlug,
} from '@/lib/cms-auth'

export const dynamic = 'force-dynamic'

/**
 * Crude per-instance throttle. Serverless spreads requests over instances so
 * this is a speed bump rather than a wall, but the sign-in page is at a secret
 * address to begin with, so anyone reaching this has already got past the part
 * that does the real work.
 */
const attempts = new Map<string, { count: number; until: number }>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 10

function throttled(ip: string): boolean {
  const rec = attempts.get(ip)
  if (!rec || Date.now() > rec.until) return false
  return rec.count >= MAX_ATTEMPTS
}

function recordFailure(ip: string) {
  const rec = attempts.get(ip)
  if (!rec || Date.now() > rec.until) attempts.set(ip, { count: 1, until: Date.now() + WINDOW_MS })
  else rec.count += 1
}

export async function POST(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: 'Editing is not configured. Set CMS_PASSWORD, CMS_SECRET and CMS_PATH.' },
      { status: 503 },
    )
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  if (throttled(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
  }

  const body = (await req.json().catch(() => null)) as { password?: unknown } | null
  if (!passwordMatches(body?.password)) {
    recordFailure(ip)
    // Blunt the timing signal from an early return on a missing/short password.
    await new Promise((r) => setTimeout(r, 400))
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  attempts.delete(ip)
  const token = createSessionToken()
  const slug = signInSlug()
  if (!token || !slug) return NextResponse.json({ error: 'Editing is not configured.' }, { status: 503 })

  const res = NextResponse.json({ ok: true })
  const secure = process.env.NODE_ENV === 'production'
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  // Readable by script on purpose: it decides whether to load the editor, and
  // carries the sign-in path so a lapsed session can offer a way back. Only a
  // browser that has just authenticated ever receives it.
  res.cookies.set(HINT_COOKIE, slug, {
    httpOnly: false,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: HINT_MAX_AGE,
  })
  return res
}
