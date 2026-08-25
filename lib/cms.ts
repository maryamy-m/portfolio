/**
 * Content-path plumbing shared by the inline editor and the save API.
 *
 * A "path" is a dot-separated address into content/site.json, with numeric
 * segments for array indices — `home.hero.headline`, `home.metrics.0.label`.
 * The same string is emitted into the static HTML as `data-cms` by
 * `components/cms/Ed.tsx`, so the browser and the server agree on exactly which
 * leaf an edit belongs to without any schema in between.
 */

/** Keys that would let a crafted path walk out of the JSON and onto Object.prototype. */
const FORBIDDEN = new Set(['__proto__', 'constructor', 'prototype'])

export function isSafePath(path: string): boolean {
  if (!path || path.length > 200) return false
  const parts = path.split('.')
  return parts.every((p) => p.length > 0 && !FORBIDDEN.has(p) && /^[A-Za-z0-9_]+$/.test(p))
}

/** Reads `path` out of `root`, or undefined if any segment is missing. */
export function getPath(root: unknown, path: string): unknown {
  if (!isSafePath(path)) return undefined
  let cur: unknown = root
  for (const key of path.split('.')) {
    if (cur === null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[key]
  }
  return cur
}

/**
 * Returns a copy of `root` with `path` set to `value`, sharing every untouched
 * branch. Only the containers along the path are cloned, so a save rewrites the
 * one leaf it means to and leaves the rest of the file byte-identical.
 */
function setPath<T>(root: T, path: string, value: string | number): T {
  const keys = path.split('.')
  const clone = (node: unknown, depth: number): unknown => {
    if (depth === keys.length) return value
    const key = keys[depth]
    if (Array.isArray(node)) {
      const next = node.slice()
      next[Number(key)] = clone(node[Number(key)], depth + 1)
      return next
    }
    const obj = node as Record<string, unknown>
    return { ...obj, [key]: clone(obj[key], depth + 1) }
  }
  return clone(root, 0) as T
}

export type Changes = Record<string, string>

export type ApplyResult<T> = { ok: true; data: T; applied: string[] } | { ok: false; error: string }

/** Upper bound on a single field, generous for prose but not a payload vector. */
const MAX_VALUE_LENGTH = 20_000
const MAX_CHANGES = 500

/**
 * Applies inline edits to the parsed site.json.
 *
 * Deliberately narrow: a change may only overwrite a path that already holds a
 * string or a number, and it writes back the type it found. That makes the
 * editor incapable of adding keys, changing types or reshaping arrays — a
 * malformed or hostile payload can at worst rewrite copy that was already copy,
 * and every page keeps the shape `lib/site.ts` infers.
 *
 * The number case exists for the metric figures (`home.metrics.0.value` is 60,
 * not "60"); typing a non-number into one is rejected rather than quietly
 * turning the field into a string.
 */
export function applyChanges<T>(data: T, changes: Changes): ApplyResult<T> {
  const entries = Object.entries(changes)
  if (entries.length === 0) return { ok: false, error: 'No changes submitted.' }
  if (entries.length > MAX_CHANGES) return { ok: false, error: 'Too many changes in one save.' }

  let next = data
  const applied: string[] = []

  for (const [path, raw] of entries) {
    if (!isSafePath(path)) return { ok: false, error: `Invalid path: ${path}` }
    if (typeof raw !== 'string') return { ok: false, error: `Value for ${path} is not text.` }
    if (raw.length > MAX_VALUE_LENGTH) return { ok: false, error: `Value for ${path} is too long.` }

    const current = getPath(next, path)
    let value: string | number

    if (typeof current === 'string') {
      value = raw
    } else if (typeof current === 'number') {
      const parsed = Number(raw.trim().replace(/,/g, ''))
      if (raw.trim() === '' || !Number.isFinite(parsed)) {
        return { ok: false, error: `${path} is a number — “${raw}” isn’t one.` }
      }
      value = parsed
    } else {
      return { ok: false, error: `${path} is not an editable field.` }
    }

    if (current === value) continue
    next = setPath(next, path, value)
    applied.push(path)
  }

  if (applied.length === 0) return { ok: false, error: 'Nothing changed.' }
  return { ok: true, data: next, applied }
}

/** How content/site.json is written back: 2-space indent, trailing newline. */
export function serialize(data: unknown): string {
  return JSON.stringify(data, null, 2) + '\n'
}

/**
 * A short content fingerprint. The editor compares the hash baked into the
 * running deployment against the hash of the file on GitHub to tell whether
 * Vercel has finished rebuilding — see app/api/cms/status/route.ts.
 */
export function contentHash(text: string): string {
  let h1 = 0x811c9dc5
  let h2 = 0x01000193
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i)
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0
    h2 = Math.imul(h2 + c, 0x85ebca6b) >>> 0
  }
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0')
}
