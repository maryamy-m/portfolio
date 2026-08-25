'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * The inline editor. Loaded only for a signed-in owner — `EditorMount` checks
 * for the hint cookie before importing this module, so a visitor never
 * downloads it.
 *
 * How it works: every string on the site is rendered by `<Ed>`, which leaves
 * its content/site.json path in the HTML as `data-cms`. Turning on edit mode
 * makes those elements contentEditable and collects `{ path: newText }`.
 * Publishing posts that map to /api/cms/save, which commits site.json to
 * GitHub — and the commit is what makes Vercel rebuild.
 *
 * Everything here is styled inline or through one injected stylesheet rather
 * than Tailwind, so the editor chrome stays independent of the site's design
 * tokens and adds nothing to the CSS visitors download.
 */

type Changes = Record<string, string>
type Mode = 'github' | 'local'

const PENDING_KEY = 'cms:pending'
const SELECTOR = '[data-cms]'
const IMAGE_SELECTOR = 'img[data-cms-image]'

/** Uploads are downscaled to this before leaving the browser. */
const MAX_IMAGE_DIM = 2400
/** Anything already smaller than this is sent untouched rather than re-encoded. */
const REENCODE_ABOVE_BYTES = 900 * 1024

/** Publishing waits on a Vercel rebuild; give it three minutes before giving up. */
const POLL_INTERVAL_MS = 5000
const POLL_TIMEOUT_MS = 3 * 60 * 1000

const NAVY = '#00003c'

function readPending(): Changes {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    return raw ? (JSON.parse(raw) as Changes) : {}
  } catch {
    return {}
  }
}

function writePending(changes: Changes) {
  try {
    if (Object.keys(changes).length === 0) sessionStorage.removeItem(PENDING_KEY)
    else sessionStorage.setItem(PENDING_KEY, JSON.stringify(changes))
  } catch {
    /* private mode — pending edits just won't survive a navigation */
  }
}

/** Collapses the whitespace contentEditable leaves behind (nbsp, stray newlines). */
function normalize(text: string): string {
  return text.replace(/ /g, ' ').replace(/\s+/g, ' ').trim()
}

/**
 * Shrinks a picture in the browser before upload.
 *
 * A photo straight off a phone is 4–12 MB, over the serverless request limit
 * once base64 inflates it by a third, and far larger than any slot on this site
 * renders at. Small files are passed through untouched so an already-optimised
 * asset isn't re-encoded for nothing. PNGs become WebP rather than JPEG so a
 * transparent logo keeps its transparency.
 */
async function prepareImage(file: File): Promise<{ data: string; preview: string }> {
  const original = await file.arrayBuffer()
  const toBase64 = (buf: ArrayBuffer) => {
    const bytes = new Uint8Array(buf)
    let binary = ''
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
    }
    return btoa(binary)
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error('That file isn’t an image this browser can read.')
  }

  const scale = Math.min(1, MAX_IMAGE_DIM / Math.max(bitmap.width, bitmap.height))
  if (scale === 1 && original.byteLength <= REENCODE_ABOVE_BYTES) {
    bitmap.close()
    return { data: toBase64(original), preview: URL.createObjectURL(file) }
  }

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return { data: toBase64(original), preview: URL.createObjectURL(file) }
  }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const type = file.type === 'image/png' ? 'image/webp' : 'image/jpeg'
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85))
  if (!blob) throw new Error('Could not process that image.')

  return { data: toBase64(await blob.arrayBuffer()), preview: URL.createObjectURL(blob) }
}

export default function Editor({ mode }: { mode: Mode }) {
  const pathname = usePathname()

  const [editing, setEditing] = useState(true)
  const [changes, setChanges] = useState<Changes>({})
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<{ kind: 'info' | 'error' | 'ok'; text: string } | null>(null)
  const [publish, setPublish] = useState<{ commit: string | null; url: string | null; live: boolean } | null>(null)
  const [rawOpen, setRawOpen] = useState(false)

  /** Which image field the file picker is currently acting on. */
  const imageTarget = useRef<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  /** Pre-edit text per path, so Discard and Escape can put it back. */
  const originals = useRef<Map<string, string>>(new Map())
  /** Mirrors `changes` for the delegated DOM listeners, which are registered once. */
  const changesRef = useRef<Changes>({})
  const editingRef = useRef(true)
  const applying = useRef(false)

  changesRef.current = changes
  editingRef.current = editing

  const dirty = Object.keys(changes).length > 0

  useEffect(() => {
    setChanges(readPending())
  }, [])

  const update = useCallback((next: Changes) => {
    setChanges(next)
    writePending(next)
  }, [])

  /* ---------------------------------------------------------------- bindings */

  /**
   * Makes every `[data-cms]` element editable (or puts it back), and re-applies
   * unsaved edits. Runs again after any client-side navigation, because React
   * rebuilds the DOM and would otherwise show the published text.
   */
  const sync = useCallback(() => {
    applying.current = true
    const pending = changesRef.current
    const on = editingRef.current

    document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
      const path = el.dataset.cms
      if (!path) return

      if (!originals.current.has(path)) originals.current.set(path, el.textContent ?? '')

      const want = pending[path]
      if (want !== undefined && el.textContent !== want) el.textContent = want

      if (on) {
        if (!el.isContentEditable) {
          // Firefox before 136 throws on an unsupported value instead of
          // ignoring it, so this can't be a bare assignment.
          try {
            el.contentEditable = 'plaintext-only'
          } catch {
            /* falls through to 'true' below */
          }
          if (!el.isContentEditable) el.contentEditable = 'true'
        }
        el.spellcheck = true
        el.dataset.cmsOn = ''
      } else if (el.isContentEditable) {
        el.removeAttribute('contenteditable')
        delete el.dataset.cmsOn
      }

      if (want !== undefined) el.dataset.cmsDirty = ''
      else delete el.dataset.cmsDirty
    })

    document.querySelectorAll<HTMLImageElement>(IMAGE_SELECTOR).forEach((el) => {
      if (on) {
        el.dataset.cmsImageOn = ''
        el.title = 'Click to replace this picture'
      } else {
        delete el.dataset.cmsImageOn
        el.removeAttribute('title')
      }
    })

    applying.current = false
  }, [])

  useEffect(() => {
    sync()
  }, [sync, pathname, editing, changes])

  // React re-renders and route transitions replace these nodes; watch for them
  // rather than guessing when navigation has settled.
  useEffect(() => {
    let queued = 0
    const observer = new MutationObserver(() => {
      if (applying.current || queued) return
      queued = window.setTimeout(() => {
        queued = 0
        sync()
      }, 50)
    })
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      if (queued) clearTimeout(queued)
    }
  }, [sync])

  /* ------------------------------------------------------------- interaction */

  useEffect(() => {
    const target = (e: Event) => (e.target as HTMLElement | null)?.closest<HTMLElement>(SELECTOR) ?? null

    const onInput = (e: Event) => {
      const el = target(e)
      const path = el?.dataset.cms
      if (!el || !path || !editingRef.current) return
      const original = originals.current.get(path) ?? ''
      const value = el.textContent ?? ''
      const next = { ...changesRef.current }
      if (normalize(value) === normalize(original)) delete next[path]
      else next[path] = value
      update(next)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const el = target(e)
      if (!el || !editingRef.current || !el.isContentEditable) return
      if (e.key === 'Enter') {
        // Every editable field here is a single string; a newline would only
        // ever be an accident.
        e.preventDefault()
        el.blur()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        const path = el.dataset.cms
        if (path) {
          el.textContent = originals.current.get(path) ?? ''
          const next = { ...changesRef.current }
          delete next[path]
          update(next)
        }
        el.blur()
      }
    }

    const onPaste = (e: ClipboardEvent) => {
      const el = target(e)
      if (!el || !editingRef.current || !el.isContentEditable) return
      e.preventDefault()
      const text = e.clipboardData?.getData('text/plain') ?? ''
      document.execCommand('insertText', false, normalize(text))
    }

    const onBlur = (e: FocusEvent) => {
      const el = target(e)
      const path = el?.dataset.cms
      if (!el || !path) return
      // An emptied headline reads as a broken page rather than an edit.
      if (normalize(el.textContent ?? '') === '') {
        el.textContent = originals.current.get(path) ?? ''
        const next = { ...changesRef.current }
        delete next[path]
        update(next)
        setNote({ kind: 'error', text: 'A field can’t be left empty — the previous text was restored.' })
      }
    }

    /**
     * In edit mode a click on editable text means "edit this", and a click on a
     * picture means "replace this" — not "follow this link" or "open this
     * card". Hold ⌘/Ctrl to navigate anyway.
     */
    const onClick = (e: MouseEvent) => {
      if (!editingRef.current || e.metaKey || e.ctrlKey) return

      const img = (e.target as HTMLElement | null)?.closest<HTMLImageElement>(IMAGE_SELECTOR)
      if (img?.dataset.cmsImage) {
        e.preventDefault()
        e.stopPropagation()
        imageTarget.current = img.dataset.cmsImage
        fileInput.current?.click()
        return
      }

      const el = target(e)
      if (!el || !el.isContentEditable) return
      const interactive = el.closest('a,button')
      if (!interactive) return
      e.preventDefault()
      e.stopPropagation()
      el.focus()
    }

    document.addEventListener('input', onInput)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('paste', onPaste)
    document.addEventListener('focusout', onBlur)
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('input', onInput)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('paste', onPaste)
      document.removeEventListener('focusout', onBlur)
      document.removeEventListener('click', onClick, true)
    }
  }, [update])

  // Closing the tab mid-edit would lose work that only exists in the DOM.
  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  /* ------------------------------------------------------------------ actions */

  /** Polls until the running deployment is built from the commit just pushed. */
  const waitForDeploy = useCallback(() => {
    const started = Date.now()
    const tick = async () => {
      if (Date.now() - started > POLL_TIMEOUT_MS) {
        setNote({ kind: 'info', text: 'Still building. Check the Vercel dashboard if it doesn’t appear.' })
        return
      }
      try {
        const res = await fetch('/api/cms/status', { cache: 'no-store' })
        const body = await res.json()
        if (body.live) {
          setPublish((p) => (p ? { ...p, live: true } : p))
          return
        }
      } catch {
        /* transient — the deployment swap drops requests briefly */
      }
      window.setTimeout(tick, POLL_INTERVAL_MS)
    }
    window.setTimeout(tick, POLL_INTERVAL_MS)
  }, [])

  const save = useCallback(async () => {
    if (!dirty || busy) return
    setBusy(true)
    setNote(null)
    setPublish(null)
    try {
      // contentEditable inserts U+00A0 at line ends; normalise on the way out so
      // the committed JSON never carries one. Not on every keystroke — stripping
      // a trailing space mid-typing would fight the caret.
      const payload = Object.fromEntries(
        Object.entries(changes).map(([path, value]) => [path, normalize(value)]),
      )
      const res = await fetch('/api/cms/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changes: payload }),
      })
      const body = await res.json()
      if (!res.ok) {
        setNote({ kind: 'error', text: body.error ?? 'Save failed.' })
        return
      }
      // Adopt the normalised text as the new baseline so Discard and the dirty
      // check compare against what was actually saved.
      Object.entries(payload).forEach(([path, value]) => originals.current.set(path, value))
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        const path = el.dataset.cms
        if (path && payload[path] !== undefined) el.textContent = payload[path]
      })
      update({})
      if (body.mode === 'local') {
        setNote({ kind: 'ok', text: 'Saved to content/site.json. The dev server will reload.' })
      } else {
        setPublish({ commit: body.commit, url: body.url, live: false })
        waitForDeploy()
      }
    } catch (err) {
      setNote({ kind: 'error', text: (err as Error).message })
    } finally {
      setBusy(false)
    }
  }, [busy, changes, dirty, update, waitForDeploy])

  /**
   * Sends a replacement picture. The server commits the file and repoints
   * site.json at it in one commit, then the new src is swapped in locally so
   * the change is visible immediately rather than only after the rebuild.
   */
  const uploadImage = useCallback(
    async (file: File) => {
      const path = imageTarget.current
      imageTarget.current = null
      if (!path || busy) return

      setBusy(true)
      setPublish(null)
      setNote({ kind: 'info', text: 'Preparing picture…' })
      let preview: string | null = null

      try {
        const prepared = await prepareImage(file)
        preview = prepared.preview
        setNote({ kind: 'info', text: 'Uploading…' })

        const res = await fetch('/api/cms/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path, data: prepared.data }),
        })
        const body = await res.json()
        if (!res.ok) {
          setNote({ kind: 'error', text: body.error ?? 'Upload failed.' })
          return
        }

        if (body.unchanged) {
          setNote({ kind: 'ok', text: 'That is already the picture in this slot.' })
          return
        }

        // next/image renders a srcset, which would win over a plain src swap.
        document.querySelectorAll<HTMLImageElement>(`img[data-cms-image="${path}"]`).forEach((img) => {
          img.removeAttribute('srcset')
          img.src = preview as string
        })
        preview = null

        if (body.mode === 'local') {
          setNote({ kind: 'ok', text: `Saved as ${body.src}` })
        } else {
          setPublish({ commit: body.commit, url: body.url, live: false })
          waitForDeploy()
        }
      } catch (err) {
        setNote({ kind: 'error', text: (err as Error).message })
      } finally {
        if (preview) URL.revokeObjectURL(preview)
        setBusy(false)
      }
    },
    [busy, waitForDeploy],
  )

  const discard = useCallback(() => {
    if (!dirty) return
    document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
      const path = el.dataset.cms
      if (path && changesRef.current[path] !== undefined) {
        el.textContent = originals.current.get(path) ?? ''
      }
    })
    update({})
    setNote(null)
  }, [dirty, update])

  const signOut = useCallback(async () => {
    if (dirty && !window.confirm('You have unpublished edits. Sign out and lose them?')) return
    await fetch('/api/cms/logout', { method: 'POST' })
    writePending({})
    window.location.reload()
  }, [dirty])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        void save()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [save])

  /* --------------------------------------------------------------------- view */

  const count = Object.keys(changes).length

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: EDITOR_CSS }} />

      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = '' // so picking the same file twice still fires
          if (file) void uploadImage(file)
        }}
      />

      <div className="cms-bar" role="region" aria-label="Content editor">
        <button
          type="button"
          className="cms-toggle"
          aria-pressed={editing}
          onClick={() => setEditing((v) => !v)}
          title="Turn off to click through the site normally"
        >
          <span className={editing ? 'cms-dot cms-dot-on' : 'cms-dot'} aria-hidden="true" />
          {editing ? 'Editing' : 'Browsing'}
        </button>

        <span className="cms-status">
          {publish ? (
            publish.live ? (
              <>
                Published.{' '}
                <button type="button" className="cms-link" onClick={() => window.location.reload()}>
                  Reload page
                </button>
              </>
            ) : (
              <>
                Committed{publish.commit ? ` ${publish.commit}` : ''} — building on Vercel…
                {publish.url && (
                  <>
                    {' '}
                    <a className="cms-link" href={publish.url} target="_blank" rel="noopener noreferrer">
                      view commit
                    </a>
                  </>
                )}
              </>
            )
          ) : note ? (
            <span className={note.kind === 'error' ? 'cms-err' : undefined}>{note.text}</span>
          ) : count > 0 ? (
            `${count} unpublished ${count === 1 ? 'change' : 'changes'}`
          ) : editing ? (
            'Click any text or picture to change it · ⌘-click to follow a link'
          ) : (
            'Edit mode off'
          )}
        </span>

        <div className="cms-actions">
          <button type="button" className="cms-btn" onClick={() => setRawOpen(true)}>
            Raw JSON
          </button>
          <button type="button" className="cms-btn" onClick={discard} disabled={!dirty || busy}>
            Discard
          </button>
          <button type="button" className="cms-btn cms-primary" onClick={save} disabled={!dirty || busy}>
            {busy ? 'Working…' : mode === 'local' ? 'Save' : 'Publish'}
          </button>
          <button type="button" className="cms-btn cms-ghost" onClick={signOut} title="Sign out">
            Sign out
          </button>
        </div>
      </div>

      {rawOpen && <RawPanel mode={mode} dirty={dirty} onClose={() => setRawOpen(false)} onPublished={waitForDeploy} />}
    </>
  )
}

/* ------------------------------------------------------------------ raw panel */

/**
 * Direct access to the whole content file. Inline editing only reaches visible
 * text and pictures, so this is where links, SEO metadata, image alt text and
 * the shape of the arrays (adding a case study, reordering metrics) get changed.
 */
function RawPanel({
  mode,
  dirty,
  onClose,
  onPublished,
}: {
  mode: Mode
  dirty: boolean
  onClose: () => void
  onPublished: () => void
}) {
  const [text, setText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [ok, setOk] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/cms/source', { cache: 'no-store' })
      .then((r) => r.json())
      .then((b) => (b.text ? setText(b.text) : setError(b.error ?? 'Could not load the content file.')))
      .catch((e) => setError((e as Error).message))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const parseError = (() => {
    if (text === null) return null
    try {
      JSON.parse(text)
      return null
    } catch (e) {
      return (e as Error).message
    }
  })()

  const submit = async () => {
    if (text === null || parseError || busy) return
    setBusy(true)
    setError(null)
    setOk(null)
    try {
      const res = await fetch('/api/cms/source', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const body = await res.json()
      if (!res.ok) {
        setError(body.error ?? 'Save failed.')
        return
      }
      setOk(
        body.mode === 'local'
          ? 'Saved to content/site.json.'
          : `Committed${body.commit ? ` ${body.commit}` : ''} — building…`,
      )
      if (body.mode !== 'local') onPublished()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="cms-modal" role="dialog" aria-modal="true" aria-label="Edit content file">
      <div className="cms-modal-inner">
        <header className="cms-modal-head">
          <strong>content/site.json</strong>
          <button type="button" className="cms-btn cms-ghost" onClick={onClose}>
            Close
          </button>
        </header>

        {dirty && (
          <p className="cms-warn">
            You have unpublished inline edits. Publishing from here writes the file below and those edits are lost —
            close this, publish first, then reopen.
          </p>
        )}

        {text === null ? (
          <p className="cms-modal-msg">{error ?? 'Loading…'}</p>
        ) : (
          <>
            <textarea
              className="cms-textarea"
              spellCheck={false}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <footer className="cms-modal-foot">
              <span className={parseError ? 'cms-err' : 'cms-ok'}>
                {parseError ? `Invalid JSON — ${parseError}` : error ? error : ok ? ok : 'Valid JSON'}
              </span>
              <button
                type="button"
                className="cms-btn cms-primary"
                onClick={submit}
                disabled={busy || Boolean(parseError)}
              >
                {busy ? 'Saving…' : mode === 'local' ? 'Save file' : 'Publish file'}
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------- css */

const EDITOR_CSS = `
[data-cms-on] { outline: 1px dashed rgba(0,0,60,.28); outline-offset: 3px; border-radius: 2px; cursor: text; }
[data-cms-on]:hover { outline-style: solid; outline-color: rgba(0,0,60,.5); background: rgba(0,0,60,.04); }
[data-cms-on]:focus { outline: 2px solid ${NAVY}; background: rgba(0,0,60,.06); }
[data-cms-dirty] { outline-color: #b45309 !important; background: rgba(180,83,9,.08) !important; }
/* Pictures sit on photos as often as on white, so the marker needs to read on both. */
[data-cms-image-on] {
  cursor: pointer;
  outline: 2px dashed rgba(255,255,255,.9); outline-offset: -4px;
  box-shadow: inset 0 0 0 4px rgba(0,0,60,.35);
}
[data-cms-image-on]:hover { outline-color: #fff; box-shadow: inset 0 0 0 4px rgba(0,0,60,.65); }
body { padding-bottom: 64px; }

.cms-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 2147483000;
  display: flex; align-items: center; gap: 16px;
  padding: 10px 16px; background: ${NAVY}; color: #fff;
  font: 500 12px/1.4 ui-monospace, "JetBrains Mono", SFMono-Regular, Menlo, monospace;
  box-shadow: 0 -2px 20px rgba(0,0,0,.25);
}
.cms-toggle {
  display: inline-flex; align-items: center; gap: 8px; flex: none;
  background: rgba(255,255,255,.1); color: #fff; border: 0; cursor: pointer;
  padding: 7px 12px; border-radius: 999px; font: inherit; text-transform: uppercase; letter-spacing: .08em;
}
.cms-toggle:hover { background: rgba(255,255,255,.18); }
.cms-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.35); }
.cms-dot-on { background: #4ade80; box-shadow: 0 0 0 3px rgba(74,222,128,.25); }
.cms-status { flex: 1 1 auto; min-width: 0; opacity: .9; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cms-actions { display: flex; gap: 8px; flex: none; }
.cms-btn {
  background: rgba(255,255,255,.12); color: #fff; border: 0; cursor: pointer;
  padding: 7px 12px; border-radius: 4px; font: inherit;
}
.cms-btn:hover:not(:disabled) { background: rgba(255,255,255,.22); }
.cms-btn:disabled { opacity: .35; cursor: default; }
.cms-primary { background: #fff; color: ${NAVY}; font-weight: 700; }
.cms-primary:hover:not(:disabled) { background: #e8e8f2; }
.cms-ghost { background: transparent; opacity: .7; }
.cms-link { background: none; border: 0; padding: 0; color: #fff; text-decoration: underline; cursor: pointer; font: inherit; }
.cms-err { color: #fca5a5; }
.cms-ok { color: #86efac; }

.cms-modal {
  position: fixed; inset: 0; z-index: 2147483001; display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,60,.6); backdrop-filter: blur(4px); padding: 24px;
}
.cms-modal-inner {
  background: #fff; color: ${NAVY}; border-radius: 12px; width: min(900px, 100%); max-height: 85vh;
  display: flex; flex-direction: column; overflow: hidden;
  font: 500 13px/1.5 ui-monospace, "JetBrains Mono", SFMono-Regular, Menlo, monospace;
}
.cms-modal-head, .cms-modal-foot {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 14px 16px; border-bottom: 1px solid rgba(0,0,60,.12);
}
.cms-modal-foot { border-bottom: 0; border-top: 1px solid rgba(0,0,60,.12); }
.cms-modal-head .cms-btn, .cms-modal-foot .cms-btn { background: rgba(0,0,60,.08); color: ${NAVY}; }
.cms-modal-head .cms-btn:hover, .cms-modal-foot .cms-btn:hover:not(:disabled) { background: rgba(0,0,60,.16); }
.cms-modal-foot .cms-primary { background: ${NAVY}; color: #fff; }
.cms-modal-foot .cms-primary:hover:not(:disabled) { background: #1a1a5c; }
.cms-modal-msg { padding: 32px 16px; text-align: center; opacity: .7; }
.cms-warn { margin: 0; padding: 12px 16px; background: #fef3c7; color: #7c2d12; border-bottom: 1px solid rgba(0,0,60,.12); }
.cms-textarea {
  flex: 1 1 auto; min-height: 45vh; width: 100%; resize: none; border: 0; outline: 0;
  padding: 16px; font: 400 12px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; color: ${NAVY};
  background: #fbfbfd; tab-size: 2;
}
.cms-modal-foot .cms-err { color: #b91c1c; }
.cms-modal-foot .cms-ok { color: #15803d; }

@media (max-width: 720px) {
  .cms-bar { flex-wrap: wrap; gap: 8px; }
  .cms-status { order: 3; flex-basis: 100%; }
  body { padding-bottom: 96px; }
}
`
