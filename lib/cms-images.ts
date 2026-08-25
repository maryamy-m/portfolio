import { createHash } from 'node:crypto'

/**
 * Validation and naming for pictures uploaded through the editor.
 *
 * Uploads are committed into `public/images/` under a new, content-hashed
 * filename rather than overwriting the existing file. Two reasons: the URL
 * changes, so no browser or CDN can keep serving the old picture from cache;
 * and the previous image stays in git history instead of being destroyed by
 * the replacement.
 */

/** Decoded size cap. Serverless request bodies top out at 4.5 MB and base64 adds a third. */
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024

const TYPES = [
  { ext: 'jpg', mime: 'image/jpeg', magic: [0xff, 0xd8, 0xff] },
  { ext: 'png', mime: 'image/png', magic: [0x89, 0x50, 0x4e, 0x47] },
  { ext: 'webp', mime: 'image/webp', magic: [0x52, 0x49, 0x46, 0x46] },
] as const

export const ACCEPT = TYPES.map((t) => t.mime).join(',')

/**
 * Identifies the format from the bytes themselves. The browser's declared MIME
 * type is a claim by the client, so it doesn't get a say in what lands in the
 * repo or what extension the file is given.
 */
function sniff(buf: Buffer): (typeof TYPES)[number] | null {
  for (const type of TYPES) {
    if (type.magic.every((byte, i) => buf[i] === byte)) {
      // RIFF also fronts .wav and .avi — WEBP is confirmed at offset 8.
      if (type.ext === 'webp' && buf.subarray(8, 12).toString('ascii') !== 'WEBP') continue
      return type
    }
  }
  return null
}

export type ImageCheck =
  | { ok: true; buffer: Buffer; ext: string; filename: string; publicPath: string; repoPath: string }
  | { ok: false; error: string }

/** Strips a previously appended content hash so repeated replacements don't grow the name. */
function stemOf(currentPath: string): string {
  const base = currentPath.split('/').pop() ?? 'image'
  const withoutExt = base.replace(/\.[a-z0-9]+$/i, '')
  const withoutHash = withoutExt.replace(/-[0-9a-f]{8}$/i, '')
  const safe = withoutHash.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/^-+|-+$/g, '')
  return safe || 'image'
}

/**
 * Checks an uploaded image and works out where it should live.
 * `currentPath` is the value already in site.json, e.g. `/images/portrait.jpg`.
 */
export function checkImage(base64: string, currentPath: string): ImageCheck {
  let buffer: Buffer
  try {
    buffer = Buffer.from(base64, 'base64')
  } catch {
    return { ok: false, error: 'Could not read the uploaded file.' }
  }

  if (buffer.length === 0) return { ok: false, error: 'The file is empty.' }
  if (buffer.length > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      error: `That image is ${(buffer.length / 1024 / 1024).toFixed(1)} MB — the limit is ${MAX_IMAGE_BYTES / 1024 / 1024} MB.`,
    }
  }

  const type = sniff(buffer)
  if (!type) return { ok: false, error: 'Only JPEG, PNG and WebP images can be uploaded.' }

  const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 8)
  const filename = `${stemOf(currentPath)}-${hash}.${type.ext}`

  return {
    ok: true,
    buffer,
    ext: type.ext,
    filename,
    publicPath: `/images/${filename}`,
    repoPath: `public/images/${filename}`,
  }
}

/** Only paths that already point into `/images/` may be retargeted by an upload. */
export function isImageField(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('/images/') && !value.includes('..')
}
