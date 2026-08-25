'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { identity, nav } from '@/lib/site'
import Ed from '@/components/cms/Ed'
import EdImage from '@/components/cms/EdImage'

/**
 * Two groups, not three. The old header sat brand / nav / avatar in a
 * justify-between row, which left the nav floating in the middle with unequal
 * gaps either side — it read as three unrelated things. Everything actionable
 * now sits in one right-hand cluster, so the bar has a single axis: identity
 * left, actions right.
 */
export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => pathname === href
  const mailHref = `mailto:${identity.email}`

  const linkClass = (href: string) =>
    isActive(href)
      ? 'font-label-mono text-label-mono text-primary font-bold underline underline-offset-8 decoration-2 transition-all duration-300'
      : 'font-label-mono text-label-mono font-semibold text-on-surface-variant hover:text-primary transition-all duration-300'

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <EdImage p="identity.logo" alt="" width={32} height={32} className="h-8 w-8 object-contain rounded" />
          <Ed
            p="identity.wordmark"
            className="font-label-mono text-label-mono uppercase tracking-[0.1em] text-on-surface group-hover:text-primary transition-colors whitespace-nowrap"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            {nav.map((item, i) => (
              <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} className={linkClass(item.href)}>
                <Ed p={`nav.${i}.label`} />
              </Link>
            ))}
          </nav>
          <span className="h-5 w-px bg-outline-variant/60" aria-hidden="true" />
          <a
            href={mailHref}
            aria-label={`Email ${identity.name}`}
            title={`Email ${identity.name}`}
            className="block rounded-full ring-1 ring-outline-variant hover:ring-primary transition-all hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <EdImage
              p="identity.avatar"
              alt=""
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="md:hidden flex items-center text-on-surface"
        >
          <span className="msym">{open ? 'close' : 'menu'}</span>
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-outline-variant/30 bg-surface/95 backdrop-blur-md px-margin-mobile py-6 flex flex-col gap-6">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={
                isActive(item.href)
                  ? 'font-label-mono text-label-mono text-primary font-bold uppercase tracking-widest'
                  : 'font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest'
              }
            >
              <Ed p={`nav.${i}.label`} />
            </Link>
          ))}
          <a
            href={mailHref}
            onClick={() => setOpen(false)}
            className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest"
          >
            Email
          </a>
        </nav>
      )}
    </header>
  )
}
