import { NextResponse } from 'next/server'
import { isAuthed } from '@/lib/cms-auth'
import { applyChanges, getPath, isSafePath, serialize } from '@/lib/cms'
import { checkImage, isImageField } from '@/lib/cms-images'
import { commitFiles, loadSource } from '@/lib/cms-github'

export const dynamic = 'force-dynamic'

/**
 * Replaces one picture.
 *
 * Writes the new file into `public/images/` and repoints the site.json field at
 * it in a single commit, so the JSON never names a file that doesn't exist yet.
 * The target must be a field that already holds an `/images/…` path — an upload
 * can retarget a picture the design already has, never introduce a new one
 * somewhere arbitrary.
 */
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const body = (await req.json().catch(() => null)) as { path?: unknown; data?: unknown } | null
  const path = body?.path
  const data = body?.data
  if (typeof path !== 'string' || !isSafePath(path)) {
    return NextResponse.json({ error: 'Invalid image field.' }, { status: 400 })
  }
  if (typeof data !== 'string' || data.length === 0) {
    return NextResponse.json({ error: 'No image data received.' }, { status: 400 })
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

  const current = getPath(parsed, path)
  if (!isImageField(current)) {
    return NextResponse.json({ error: `${path} is not an image field.` }, { status: 400 })
  }

  const image = checkImage(data, current)
  if (!image.ok) return NextResponse.json({ error: image.error }, { status: 400 })

  // Same bytes as the picture already there — nothing to commit.
  if (image.publicPath === current) {
    return NextResponse.json({ ok: true, unchanged: true, src: current, mode: source.mode })
  }

  const updated = applyChanges(parsed, { [path]: image.publicPath })
  if (!updated.ok) return NextResponse.json({ error: updated.error }, { status: 400 })

  const result = await commitFiles(
    [
      { path: image.repoPath, base64: image.buffer.toString('base64') },
      { path: 'content/site.json', text: serialize(updated.data) },
    ],
    `Content: replace image at ${path}`,
  )

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.conflict ? 409 : 502 })
  }

  return NextResponse.json({
    ok: true,
    src: image.publicPath,
    mode: result.mode,
    commit: result.commit,
    url: result.url,
  })
}
