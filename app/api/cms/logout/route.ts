import { NextResponse } from 'next/server'
import { HINT_COOKIE, SESSION_COOKIE } from '@/lib/cms-auth'

export const dynamic = 'force-dynamic'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 })
  res.cookies.set(HINT_COOKIE, '', { path: '/', maxAge: 0 })
  return res
}
