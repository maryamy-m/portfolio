import { NextResponse } from 'next/server'
import { isAuthed } from '@/lib/cms-auth'
import { applyChanges, serialize, type Changes } from '@/lib/cms'
import { loadSource, saveSource } from '@/lib/cms-github'

export const dynamic = 'force-dynamic'

/** Human-readable commit subject, so the repo history reads like an edit log. */
function commitMessage(applied: string[]): string {
  if (applied.length === 1) return `Content: edit ${applied[0]}`
  const pages = Array.from(new Set(applied.map((p) => p.split('.')[0]))).sort()
  return `Content: ${applied.length} edits (${pages.join(', ')})`
}

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const body = (await req.json().catch(() => null)) as { changes?: Changes } | null
  const changes = body?.changes
  if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
    return NextResponse.json({ error: 'No changes submitted.' }, { status: 400 })
  }

  let source
  try {
    source = await loadSource()
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 })
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(source.text)
  } catch {
    return NextResponse.json({ error: 'The stored content file is not valid JSON.' }, { status: 500 })
  }

  const result = applyChanges(parsed, changes)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })

  const saved = await saveSource(serialize(result.data), source.sha, commitMessage(result.applied))
  if (!saved.ok) {
    return NextResponse.json({ error: saved.error }, { status: saved.conflict ? 409 : 502 })
  }

  return NextResponse.json({
    ok: true,
    mode: saved.mode,
    commit: saved.commit,
    url: saved.url,
    applied: result.applied,
  })
}
