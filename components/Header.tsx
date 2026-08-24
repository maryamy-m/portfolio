'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { identity, nav } from '@/lib/site'

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => pathname === href

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
      <div className="h-20 max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop flex items-center justify-between">
        <Link href="/" className="flex flex-col items-start group">
          <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest group-hover:text-primary transition-colors">
            {identity.volume}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-gutter">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={
                isActive(item.href)
                  ? 'font-label-caps text-label-caps text-on-surface font-semibold underline underline-offset-8 transition-all'
                  : 'font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-all'
              }
            >
              {item.label}
            </Link>
          ))}
          {identity.resumeUrl && (
            <a
              href={identity.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-stack-md flex items-center gap-1 font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors"
            >
              [Résumé <span className="msym text-[12px]">north_east</span>]
            </a>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="md:hidden flex items-center text-on-surface"
        >
          <span className="msym">{open ? 'close' : 'menu'}</span>
        </button>

        <div className="hidden md:flex w-8 h-8 rounded-full bg-primary items-center justify-center ml-stack-lg shrink-0">
          <span className="msym text-on-primary text-[18px]">person</span>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-outline-variant/30 bg-background/95 backdrop-blur-xl px-margin-mobile py-stack-md flex flex-col gap-stack-md">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={
                isActive(item.href)
                  ? 'font-label-caps text-label-caps text-on-surface font-semibold uppercase tracking-widest'
                  : 'font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest'
              }
            >
              {item.label}
            </Link>
          ))}
          {identity.resumeUrl && (
            <a
              href={identity.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-label-caps text-label-caps text-primary uppercase tracking-widest"
            >
              [Résumé ↗]
            </a>
          )}
        </nav>
      )}
    </header>
  )
}
