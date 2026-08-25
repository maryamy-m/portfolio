import { NextResponse } from 'next/server'
import { isAuthed, isConfigured } from '@/lib/cms-auth'
import { storageMode } from '@/lib/cms-github'

export const dynamic = 'force-dynamic'

/**
 * Tells the browser-side editor whether to mount, and which backend it writes
 * to. Deliberately says nothing about where the sign-in page lives — that
 * address is only ever handed to a browser that has already signed in.
 */
export async function GET() {
  return NextResponse.json(
    { enabled: isConfigured(), authed: await isAuthed(), mode: storageMode() },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
