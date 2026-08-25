import type { Metadata } from 'next'
import { site } from '@/lib/site'
import Ed from '@/components/cms/Ed'
import EdImage from '@/components/cms/EdImage'

const { principles, wild, timeline, education, meta } = site.about

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

/** Numbered rule above each section; `p` addresses its label in site.json. */
function SectionLabel({ p }: { p: string }) {
  return (
    <div className="flex items-center gap-6 mb-12">
      <Ed p={p} className="font-label-mono text-label-mono text-primary uppercase tracking-widest" />
      <span className="flex-grow h-px bg-outline-variant/50" aria-hidden="true" />
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pt-20 pb-stack-gap">
        <Ed
          as="h1"
          p="about.hero.headline"
          className="text-[40px] sm:text-[56px] lg:text-[72px] font-display-lg text-primary text-balance font-bold leading-[1.1] max-w-5xl"
        />
      </section>

      {/* 01 — Principles */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pb-stack-gap">
        <SectionLabel p="about.principles.label" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {principles.items.map((item, i) => (
            <article
              key={item.tag}
              className="bg-surface-container border border-outline-variant/30 rounded-xl p-8 flex flex-col hover:border-primary/50 transition-colors"
            >
              <Ed
                p={`about.principles.items.${i}.tag`}
                className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-6"
              />
              <Ed as="h3" p={`about.principles.items.${i}.title`} className="font-headline-md text-headline-md text-primary mb-4" />
              <Ed as="p" p={`about.principles.items.${i}.body`} className="font-body-md text-body-md text-on-surface-variant" />
            </article>
          ))}
        </div>
      </section>

      {/* 02 — Me in the wild */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pb-stack-gap">
        <SectionLabel p="about.wild.label" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          {/* The play button used to be decoration — it now opens about.wild.videoUrl. */}
          <a
            href={wild.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch: ${wild.title}`}
            className="lg:col-span-7 relative block w-full aspect-video rounded-xl overflow-hidden bg-surface-container-high group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <EdImage
              p="about.wild.image"
              altPath="about.wild.imageAlt"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" aria-hidden="true" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="msym text-[64px] text-white drop-shadow-lg transition-transform group-hover:scale-110">play_arrow</span>
            </span>
          </a>
          <div className="lg:col-span-5 flex flex-col">
            <Ed as="h2" p="about.wild.title" className="font-headline-md text-headline-md text-primary mb-4" />
            <Ed as="p" p="about.wild.body" className="font-body-lg text-body-lg text-on-surface-variant" />
          </div>
        </div>
      </section>

      {/* 03 — Timeline */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pb-stack-gap">
        <SectionLabel p="about.timeline.label" />
        <div className="flex flex-col">
          {timeline.items.map((item, i) => (
            <article
              key={item.period}
              className="grid grid-cols-1 md:grid-cols-12 gap-gutter py-8 border-t border-outline-variant/40 last:border-b"
            >
              <Ed
                p={`about.timeline.items.${i}.period`}
                className="md:col-span-3 font-label-mono text-label-mono text-on-surface-variant uppercase pt-1"
              />
              <div className="md:col-span-9 flex flex-col">
                <Ed as="h3" p={`about.timeline.items.${i}.role`} className="font-headline-md text-headline-md text-primary" />
                <Ed
                  as="h4"
                  p={`about.timeline.items.${i}.org`}
                  className="font-label-mono text-label-mono text-on-surface-variant uppercase mt-2 mb-4"
                />
                <Ed as="p" p={`about.timeline.items.${i}.body`} className="font-body-md text-body-md text-on-surface-variant" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 04 — Education */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pb-stack-gap">
        <SectionLabel p="about.education.label" />
        <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-8 lg:p-12">
          <Ed as="h2" p="about.education.degree" className="font-display-lg text-[32px] lg:text-[40px] text-primary font-bold" />
          <Ed
            as="h3"
            p="about.education.school"
            className="font-label-mono text-label-mono text-on-surface-variant uppercase mt-3"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mt-10">
            <div>
              <Ed p="about.education.focusLabel" className="font-label-mono text-label-mono text-primary uppercase" />
              <ul className="mt-4 flex flex-col gap-3">
                {education.focus.map((f, i) => (
                  <li key={f} className="font-body-md text-body-md text-on-surface-variant flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                    <Ed p={`about.education.focus.${i}`} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Ed p="about.education.achievementsLabel" className="font-label-mono text-label-mono text-primary uppercase" />
              <ul className="mt-4 flex flex-col gap-3">
                {education.achievements.map((a, i) => (
                  <li
                    key={a.label}
                    className="font-body-md text-body-md text-on-surface-variant flex items-center gap-3"
                  >
                    <span className="msym text-[20px] text-primary shrink-0">{a.icon}</span>
                    <Ed p={`about.education.achievements.${i}.label`} />
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
