import { NextResponse } from 'next/server'
import deployed from '@/content/site.json'
import { isAuthed } from '@/lib/cms-auth'
import { contentHash, serialize } from '@/lib/cms'
import { loadSource } from '@/lib/cms-github'

export const dynamic = 'force-dynamic'

/**
 * Answers "has Vercel finished publishing my edit yet?".
 *
 * The content file bundled into this deployment is, by definition, what the
 * live pages were prerendered from. Comparing its fingerprint to the file
 * currently on GitHub says whether the running build is up to date — no
 * deployment API, no polling of Vercel.
 */
export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const deployedHash = contentHash(serialize(deployed))
  try {
    const { text, mode } = await loadSource()
    const latestHash = contentHash(serialize(JSON.parse(text)))
    return NextResponse.json(
      { deployedHash, latestHash, live: deployedHash === latestHash, mode },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 })
  }
}
