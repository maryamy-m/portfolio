'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { HINT_COOKIE } from '@/lib/cms-auth.client'

const Editor = dynamic(() => import('./Editor'), { ssr: false })

type State =
  | { kind: 'off' }
  | { kind: 'expired'; signInPath: string }
  | { kind: 'on'; mode: 'github' | 'local' }

/**
 * Decides whether the inline editor loads, and is the only editor code on a
 * normal page.
 *
 * A visitor has no hint cookie, so this returns null on the first render and
 * never fetches or imports anything — the editor bundle stays off the critical
 * path entirely. The cookie is a convenience flag with no authority of its own;
 * every write is re-checked against the signed httpOnly session server-side.
 *
 * Its value is the secret sign-in path, which is how a lapsed session can offer
 * a link back. Only a browser that has already signed in has that cookie, so
 * the address isn't disclosed to anyone new.
 */
export default function EditorMount() {
  const [state, setState] = useState<State>({ kind: 'off' })

  useEffect(() => {
    const hint = document.cookie
      .split('; ')
      .find((c) => c.startsWith(`${HINT_COOKIE}=`))
      ?.slice(HINT_COOKIE.length + 1)
    if (!hint) return

    let cancelled = false
    fetch('/api/cms/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((body: { enabled?: boolean; authed?: boolean; mode?: 'github' | 'local' }) => {
        if (cancelled) return
        if (body.authed) setState({ kind: 'on', mode: body.mode ?? 'github' })
        else if (body.enabled) setState({ kind: 'expired', signInPath: `/${hint}` })
      })
      .catch(() => {
        /* offline or a cold start — leaving the editor unmounted is the safe default */
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (state.kind === 'on') return <Editor mode={state.mode} />

  if (state.kind === 'expired') {
    return (
      // A plain anchor, not next/link: the target is a runtime value the router
      // has no route entry for until the page is actually requested.
      <a
        href={state.signInPath}
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 2147483000,
          background: '#00003c',
          color: '#fff',
          padding: '10px 14px',
          borderRadius: 999,
          font: '500 12px/1 ui-monospace, SFMono-Regular, Menlo, monospace',
          textDecoration: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,.25)',
        }}
      >
        Editor session expired — sign in
      </a>
    )
  }

  return null
}
