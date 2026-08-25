import Image from 'next/image'
import type { Metadata } from 'next'
import { site } from '@/lib/site'

const { hero, principles, wild, timeline, education, meta } = site.about

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-6 mb-12">
      <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest">{children}</span>
      <span className="flex-grow h-px bg-outline-variant/50" aria-hidden="true" />
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pt-20 pb-stack-gap">
        <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] font-display-lg text-primary text-balance font-bold leading-[1.1] max-w-5xl">
          {hero.headline}
        </h1>
      </section>

      {/* 01 — Principles */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pb-stack-gap">
        <SectionLabel>{principles.label}</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {principles.items.map((p) => (
            <article
              key={p.tag}
              className="bg-surface-container border border-outline-variant/30 rounded-xl p-8 flex flex-col hover:border-primary/50 transition-colors"
            >
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-6">{p.tag}</span>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">{p.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 02 — Me in the wild */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pb-stack-gap">
        <SectionLabel>{wild.label}</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          <div className="lg:col-span-7 relative w-full aspect-video rounded-xl overflow-hidden bg-surface-container-high group">
            <Image
              src={wild.image}
              alt={wild.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="msym text-[64px] text-white drop-shadow-lg">play_arrow</span>
            </span>
          </div>
          <div className="lg:col-span-5 flex flex-col">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">{wild.title}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">{wild.body}</p>
          </div>
        </div>
      </section>

      {/* 03 — Timeline */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pb-stack-gap">
        <SectionLabel>{timeline.label}</SectionLabel>
        <div className="flex flex-col">
          {timeline.items.map((item) => (
            <article
              key={item.period}
              className="grid grid-cols-1 md:grid-cols-12 gap-gutter py-8 border-t border-outline-variant/40 last:border-b"
            >
              <span className="md:col-span-3 font-label-mono text-label-mono text-on-surface-variant uppercase pt-1">
                {item.period}
              </span>
              <div className="md:col-span-9 flex flex-col">
                <h3 className="font-headline-md text-headline-md text-primary">{item.role}</h3>
                <h4 className="font-label-mono text-label-mono text-on-surface-variant uppercase mt-2 mb-4">
                  {item.org}
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 04 — Education */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pb-stack-gap">
        <SectionLabel>{education.label}</SectionLabel>
        <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-8 lg:p-12">
          <h2 className="font-display-lg text-[32px] lg:text-[40px] text-primary font-bold">{education.degree}</h2>
          <h3 className="font-label-mono text-label-mono text-on-surface-variant uppercase mt-3">{education.school}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mt-10">
            <div>
              <span className="font-label-mono text-label-mono text-primary uppercase">{education.focusLabel}</span>
              <ul className="mt-4 flex flex-col gap-3">
                {education.focus.map((f) => (
                  <li key={f} className="font-body-md text-body-md text-on-surface-variant flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-label-mono text-label-mono text-primary uppercase">
                {education.achievementsLabel}
              </span>
              <ul className="mt-4 flex flex-col gap-3">
                {education.achievements.map((a) => (
                  <li
                    key={a.label}
                    className="font-body-md text-body-md text-on-surface-variant flex items-center gap-3"
                  >
                    <span className="msym text-[20px] text-primary shrink-0">{a.icon}</span>
                    {a.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
