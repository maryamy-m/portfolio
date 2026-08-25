'use client'

import { useState } from 'react'

export default function SignInForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/cms/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error ?? 'Sign in failed.')
        return
      }
      // Full navigation, not a router push — the editor mounts off the cookie
      // that this response just set.
      window.location.href = '/'
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md flex flex-col">
      <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest mb-6">Site Editor</span>
      <h1 className="text-[40px] lg:text-[56px] font-display-lg text-primary font-bold leading-[1.1] mb-4">
        Sign in to edit.
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-8">
        Once you&rsquo;re in, click any text or picture on any page to change it, then publish.
      </p>

      <label htmlFor="cms-password" className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-2">
        Password
      </label>
      <input
        id="cms-password"
        type="password"
        autoComplete="current-password"
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-outline-variant rounded px-4 py-3 font-body-md text-body-md text-on-surface bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />

      {error && <p className="font-body-md text-[14px] text-red-700 mt-3">{error}</p>}

      <button
        type="submit"
        disabled={busy || password.length === 0}
        className="mt-6 self-start bg-primary hover:bg-on-primary-fixed-variant disabled:opacity-40 text-on-primary font-headline-md text-[14px] px-6 py-4 rounded transition-colors"
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
