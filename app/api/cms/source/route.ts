import { NextResponse } from 'next/server'
import { isAuthed } from '@/lib/cms-auth'
import { serialize } from '@/lib/cms'
import { loadSource, saveSource } from '@/lib/cms-github'

export const dynamic = 'force-dynamic'

/**
 * Whole-file access for the editor's Raw JSON panel — the escape hatch for
 * everything inline editing can't reach: links, SEO metadata, image alt text,
 * and adding or reordering items in the arrays.
 */
export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  try {
    const { text, mode } = await loadSource()
    return NextResponse.json({ text, mode }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 })
  }
}

export async function PUT(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const body = (await req.json().catch(() => null)) as { text?: unknown } | null
  if (typeof body?.text !== 'string') {
    return NextResponse.json({ error: 'Missing content.' }, { status: 400 })
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(body.text)
  } catch (err) {
    return NextResponse.json({ error: `Invalid JSON — ${(err as Error).message}` }, { status: 400 })
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return NextResponse.json({ error: 'The content file must be a JSON object.' }, { status: 400 })
  }

  let source
  try {
    source = await loadSource()
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 })
  }

  const next = serialize(parsed)
  if (next === source.text) return NextResponse.json({ error: 'Nothing changed.' }, { status: 400 })

  const saved = await saveSource(next, source.sha, 'Content: edit via raw JSON panel')
  if (!saved.ok) {
    return NextResponse.json({ error: saved.error }, { status: saved.conflict ? 409 : 502 })
  }
  return NextResponse.json({ ok: true, mode: saved.mode, commit: saved.commit, url: saved.url })
}
