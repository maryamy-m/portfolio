import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * The "database" behind the editor: content/site.json in the GitHub repo.
 *
 * Saving commits the file through the GitHub API, which is what triggers the
 * Vercel rebuild. Git supplies the things a database would otherwise have to —
 * history, authorship, diffs and rollback — and the site itself stays a fully
 * static prerender with no runtime data layer.
 *
 * With no GITHUB_TOKEN present (i.e. `npm run dev`) the same functions write
 * the local file instead, so the editor is usable offline against the working
 * tree and hot-reload shows the result immediately.
 */

export const CONTENT_PATH = 'content/site.json'

export type StorageMode = 'github' | 'local'

export function storageMode(): StorageMode {
  return process.env.GITHUB_TOKEN ? 'github' : 'local'
}

function repoSlug(): string {
  return process.env.GITHUB_REPO || 'maryamy-m/portfolio'
}

function branch(): string {
  return process.env.GITHUB_BRANCH || 'main'
}

function localFile(): string {
  return path.join(process.cwd(), CONTENT_PATH)
}

async function gh(url: string, init: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...init,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'portfolio-inline-editor',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  })
}

export type Source = {
  /** Raw file contents. */
  text: string
  /** Blob SHA — passed back on save so a concurrent edit conflicts instead of clobbering. */
  sha: string | null
  mode: StorageMode
}

/** Reads the current content file from whichever backend is active. */
export async function loadSource(): Promise<Source> {
  if (storageMode() === 'local') {
    return { text: await readFile(localFile(), 'utf8'), sha: null, mode: 'local' }
  }

  const url = `https://api.github.com/repos/${repoSlug()}/contents/${CONTENT_PATH}?ref=${encodeURIComponent(branch())}`
  const res = await gh(url)
  if (!res.ok) {
    throw new Error(`GitHub read failed (${res.status}). Check GITHUB_TOKEN, GITHUB_REPO and GITHUB_BRANCH.`)
  }
  const body = (await res.json()) as { content: string; encoding: string; sha: string }
  const text = Buffer.from(body.content, body.encoding === 'base64' ? 'base64' : 'utf8').toString('utf8')
  return { text, sha: body.sha, mode: 'github' }
}

export type SaveResult =
  | { ok: true; mode: StorageMode; commit: string | null; url: string | null }
  | { ok: false; conflict: boolean; error: string }

/**
 * Writes the content file back. `sha` must be the one that came from
 * `loadSource()`; GitHub rejects the write if the file moved underneath us,
 * which the caller surfaces as "reload and reapply" rather than silently
 * overwriting someone else's edit.
 */
export async function saveSource(text: string, sha: string | null, message: string): Promise<SaveResult> {
  if (storageMode() === 'local') {
    await writeFile(localFile(), text, 'utf8')
    return { ok: true, mode: 'local', commit: null, url: null }
  }

  const url = `https://api.github.com/repos/${repoSlug()}/contents/${CONTENT_PATH}`
  const res = await gh(url, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: Buffer.from(text, 'utf8').toString('base64'),
      sha: sha ?? undefined,
      branch: branch(),
      committer: {
        name: process.env.GITHUB_COMMIT_NAME || 'Portfolio Editor',
        email: process.env.GITHUB_COMMIT_EMAIL || 'editor@users.noreply.github.com',
      },
    }),
  })

  if (res.status === 409 || res.status === 422) {
    return {
      ok: false,
      conflict: true,
      error: 'The content file changed on GitHub since this page loaded. Reload and make the edit again.',
    }
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    return { ok: false, conflict: false, error: `GitHub write failed (${res.status}). ${detail.slice(0, 200)}` }
  }

  const body = (await res.json()) as { commit?: { sha?: string; html_url?: string } }
  return {
    ok: true,
    mode: 'github',
    commit: body.commit?.sha?.slice(0, 7) ?? null,
    url: body.commit?.html_url ?? null,
  }
}

/* -------------------------------------------------------------- multi-file */

export type FileWrite = { path: string; text: string } | { path: string; base64: string }

export type CommitResult =
  | { ok: true; mode: StorageMode; commit: string | null; url: string | null }
  | { ok: false; conflict: boolean; error: string }

/**
 * Commits several files as one commit, through the git data API.
 *
 * An image upload has to write two things — the picture into `public/images/`
 * and its new path into `content/site.json` — and they must land together. The
 * contents API used above can only do one file per call, which would mean two
 * commits, two rebuilds, and a window where the JSON points at a file that
 * isn't there yet.
 *
 * The final ref update is a non-forced fast-forward, so a concurrent push is
 * rejected rather than overwritten — the same guarantee the blob SHA gives
 * single-file saves.
 */
export async function commitFiles(files: FileWrite[], message: string): Promise<CommitResult> {
  if (files.length === 0) return { ok: false, conflict: false, error: 'Nothing to commit.' }

  if (storageMode() === 'local') {
    for (const file of files) {
      const target = path.join(process.cwd(), file.path)
      await mkdir(path.dirname(target), { recursive: true })
      if ('text' in file) await writeFile(target, file.text, 'utf8')
      else await writeFile(target, Buffer.from(file.base64, 'base64'))
    }
    return { ok: true, mode: 'local', commit: null, url: null }
  }

  const repo = repoSlug()
  const ref = `heads/${branch()}`

  const step = async (url: string, init?: RequestInit) => {
    const res = await gh(url, init)
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new Error(`${res.status} ${detail.slice(0, 200)}`)
    }
    return res.json()
  }

  try {
    const head = await step(`https://api.github.com/repos/${repo}/git/ref/${ref}`)
    const headSha: string = head.object.sha
    const headCommit = await step(`https://api.github.com/repos/${repo}/git/commits/${headSha}`)
    const baseTree: string = headCommit.tree.sha

    // Text can go inline in the tree; binary has to become a blob first.
    const tree = await Promise.all(
      files.map(async (file) => {
        const base = { path: file.path, mode: '100644' as const, type: 'blob' as const }
        if ('text' in file) return { ...base, content: file.text }
        const blob = await step(`https://api.github.com/repos/${repo}/git/blobs`, {
          method: 'POST',
          body: JSON.stringify({ content: file.base64, encoding: 'base64' }),
        })
        return { ...base, sha: blob.sha as string }
      }),
    )

    const newTree = await step(`https://api.github.com/repos/${repo}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({ base_tree: baseTree, tree }),
    })

    const commit = await step(`https://api.github.com/repos/${repo}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({
        message,
        tree: newTree.sha,
        parents: [headSha],
        author: {
          name: process.env.GITHUB_COMMIT_NAME || 'Portfolio Editor',
          email: process.env.GITHUB_COMMIT_EMAIL || 'editor@users.noreply.github.com',
          date: new Date().toISOString(),
        },
      }),
    })

    const update = await gh(`https://api.github.com/repos/${repo}/git/refs/${ref}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: commit.sha, force: false }),
    })
    if (!update.ok) {
      return {
        ok: false,
        conflict: true,
        error: 'The repository changed while this was uploading. Reload and try again.',
      }
    }

    return {
      ok: true,
      mode: 'github',
      commit: (commit.sha as string).slice(0, 7),
      url: `https://github.com/${repo}/commit/${commit.sha}`,
    }
  } catch (err) {
    return { ok: false, conflict: false, error: `GitHub write failed. ${(err as Error).message}` }
  }
}
