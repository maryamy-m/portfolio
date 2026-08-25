import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'

/**
 * Session handling for the inline editor.
 *
 * One shared password (CMS_PASSWORD) exchanged for an HMAC-signed, httpOnly
 * cookie. No accounts, no database, no dependency — the only thing being
 * guarded is who may rewrite one JSON file in one repo.
 */

export const SESSION_COOKIE = 'cms_session'

/**
 * Non-secret companion cookie, defined in a client-safe module because the
 * browser needs it too. The editor bundle is only fetched when this is present,
 * so an ordinary visitor never pays for the editor and never makes a session
 * request. It carries no authority whatsoever: every write is checked against
 * the signed cookie above, server-side.
 */
export { HINT_COOKIE } from './cms-auth.client'

const SESSION_TTL_SECONDS = 60 * 60 * 12

/**
 * The hint cookie outlives the session on purpose, so a returning owner is
 * shown the way back to the sign-in page instead of having to remember a
 * 32-character URL.
 */
export const HINT_MAX_AGE = 60 * 60 * 24 * 30

function secret(): string | null {
  const s = process.env.CMS_SECRET
  return s && s.length >= 16 ? s : null
}

/**
 * The single URL segment the sign-in page lives at, from CMS_PATH.
 *
 * The editor has no fixed address: `/edit` is the first thing anyone would try,
 * so the page is served from a long random path kept in an environment variable
 * instead. That keeps it out of the repository, which is public — the only
 * places the URL exists are the env var and the owner's own browser.
 *
 * Returns null unless the value is a plausible single segment, so a typo or an
 * empty variable turns editing off rather than exposing it at some odd address.
 */
export function signInSlug(): string | null {
  const value = process.env.CMS_PATH?.trim()
  if (!value || !/^[A-Za-z0-9_-]{16,64}$/.test(value)) return null
  return value
}

/** Editing is only reachable once all three are set — unconfigured means off. */
export function isConfigured(): boolean {
  return Boolean(process.env.CMS_PASSWORD) && secret() !== null && signInSlug() !== null
}

function sign(payload: string, key: string): string {
  return createHmac('sha256', key).update(payload).digest('base64url')
}

export function createSessionToken(): string | null {
  const key = secret()
  if (!key) return null
  const payload = `${Date.now() + SESSION_TTL_SECONDS * 1000}.${randomBytes(9).toString('base64url')}`
  return `${payload}.${sign(payload, key)}`
}

function verifyToken(token: string | undefined): boolean {
  const key = secret()
  if (!key || !token) return false
  const cut = token.lastIndexOf('.')
  if (cut < 1) return false
  const payload = token.slice(0, cut)
  const given = Buffer.from(token.slice(cut + 1))
  const want = Buffer.from(sign(payload, key))
  if (given.length !== want.length || !timingSafeEqual(given, want)) return false
  const expires = Number(payload.split('.')[0])
  return Number.isFinite(expires) && expires > Date.now()
}

/** True when the caller holds a valid, unexpired editor session. */
export async function isAuthed(): Promise<boolean> {
  if (!isConfigured()) return false
  const jar = await cookies()
  return verifyToken(jar.get(SESSION_COOKIE)?.value)
}

/** Constant-time password comparison, length-safe. */
export function passwordMatches(given: unknown): boolean {
  const expected = process.env.CMS_PASSWORD
  if (!expected || typeof given !== 'string') return false
  const a = createHmac('sha256', 'pw').update(given).digest()
  const b = createHmac('sha256', 'pw').update(expected).digest()
  return timingSafeEqual(a, b)
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS
