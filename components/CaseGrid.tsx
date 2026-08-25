'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { site } from '@/lib/site'

const { cases } = site.home.selectedWork

/** Tailwind needs literal class names, so bento widths map through a lookup. */
const SPAN: Record<string, string> = {
  wide: 'lg:col-span-2',
  narrow: 'lg:col-span-1',
}

export default function CaseGrid() {
  const [openId, setOpenId] = useState<string | null>(null)
  const active = cases.find((c) => c.id === openId)

  useEffect(() => {
    if (!openId) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenId(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openId])

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter auto-rows-[280px] lg:auto-rows-[320px]">
        {cases.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpenId(item.id)}
            className={`${SPAN[item.span] ?? SPAN.narrow} text-left rounded-lg overflow-hidden flex flex-col justify-end p-8 group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
          >
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
              aria-hidden="true"
            />
            <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-2">
              <h3 className="font-headline-md text-[24px] lg:text-[28px] text-white font-bold text-balance leading-tight">
                {item.title}
              </h3>
              <div className="flex items-center justify-between mt-4 gap-4">
                <span className="font-label-mono text-label-mono text-gray-300 uppercase font-bold">
                  {item.category}
                </span>
                <span className="msym text-white transition-transform group-hover:translate-x-1">arrow_forward</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={(e) => e.target === e.currentTarget && setOpenId(null)}
          className="fixed inset-0 z-[100] bg-on-background/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-surface rounded-xl max-w-2xl w-full p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setOpenId(null)}
              aria-label="Close"
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary"
            >
              <span className="msym">close</span>
            </button>
            <h3 className="font-headline-md text-headline-md text-primary mb-4 pr-10">{active.title}</h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant">{active.detail}</p>
          </div>
        </div>
      )}
    </>
  )
}
