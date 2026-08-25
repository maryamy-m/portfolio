'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { identity, nav } from '@/lib/site'

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => pathname === href

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <Image src="/images/logo.jpg" alt="" width={32} height={32} className="h-8 w-8 object-contain rounded" />
          <span className="font-label-mono text-label-mono uppercase tracking-[0.1em] text-on-surface group-hover:text-primary transition-colors">
            Portfolio
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={
                isActive(item.href)
                  ? 'font-label-mono text-label-mono text-primary font-bold underline underline-offset-8 decoration-2 transition-all duration-300'
                  : 'font-label-mono text-label-mono font-semibold text-on-surface-variant hover:text-primary transition-all duration-300'
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
              className="font-label-mono text-label-mono font-semibold text-on-surface-variant hover:text-primary transition-all duration-300 flex items-center gap-1"
            >
              Résumé <span className="msym text-[14px]">north_east</span>
            </a>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <Image
            src="/images/portrait.jpg"
            alt=""
            width={32}
            height={32}
            className="hidden md:block w-8 h-8 rounded-full object-cover border border-outline-variant"
          />
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
      </div>

      {open && (
        <nav className="md:hidden border-t border-outline-variant/30 bg-surface/95 backdrop-blur-md px-margin-mobile py-6 flex flex-col gap-6">
          {nav.map((item) => (
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
              {item.label}
            </Link>
          ))}
          {identity.resumeUrl && (
            <a
              href={identity.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest"
            >
              Résumé ↗
            </a>
          )}
        </nav>
      )}
    </header>
  )
}
