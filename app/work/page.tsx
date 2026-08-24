import Image from 'next/image'
import type { Metadata } from 'next'
import { site } from '@/lib/site'

const { hero, metrics, sectionLabel, cases, meta } = site.work

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

/** Tailwind needs literal class names, so span widths map through a lookup. */
const SPAN: Record<number, string> = {
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  7: 'md:col-span-7',
  8: 'md:col-span-8',
}

const HEIGHT: Record<string, string> = {
  'h-64': 'h-64',
  'h-80': 'h-80',
  'h-96': 'h-96',
  'h-[26rem]': 'h-[26rem]',
}

const OFFSET: Record<string, string> = {
  '': '',
  'md:mt-16': 'md:mt-16',
  'md:-mt-16': 'md:-mt-16',
}

export default function WorkPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop w-full pt-section-gap pb-stack-lg flex flex-col gap-stack-lg relative">
        <h1 className="font-display-xl text-headline-lg-mobile md:text-display-xl text-on-surface max-w-5xl tracking-tight break-words relative z-10">
          {hero.headline}
        </h1>
        <div className="flex flex-col md:flex-row gap-stack-lg md:gap-section-gap font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mt-stack-lg relative z-10">
          {hero.facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-stack-sm">
              <span className="text-on-surface">{fact.label}</span>
              {'live' in fact && fact.live ? (
                <span className="text-primary flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                  {fact.value}
                </span>
              ) : (
                <span>{fact.value}</span>
              )}
            </div>
          ))}
        </div>
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/20 blur-3xl rounded-full -z-0 pointer-events-none transform translate-x-1/3 -translate-y-1/4"
          aria-hidden="true"
        />
      </section>

      {/* Proof metrics */}
      <section className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop w-full mt-stack-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {metrics.map((metric) => {
            const accent = 'accent' in metric && metric.accent
            return (
              <div
                key={metric.label}
                className={`flex flex-col p-stack-lg rounded-xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden cursor-default ${
                  accent
                    ? 'bg-primary shadow-lg hover:shadow-primary/30'
                    : 'bg-surface-container-lowest shadow-md hover:shadow-xl'
                }`}
              >
                <div
                  className={`absolute -right-8 -top-8 transition-colors duration-500 ${
                    accent ? 'text-on-primary/10' : 'text-on-surface-variant/5 group-hover:text-primary/5'
                  }`}
                  aria-hidden="true"
                >
                  <span className="msym msym-filled text-[160px] leading-none">{metric.icon}</span>
                </div>
                <div
                  className={`font-metric-huge text-metric-huge relative z-10 ${
                    accent ? 'text-on-primary' : 'text-on-surface group-hover:text-primary transition-colors duration-300'
                  }`}
                >
                  {metric.value}
                </div>
                <div
                  className={`font-label-caps text-label-caps uppercase mt-stack-sm relative z-10 ${
                    accent
                      ? 'text-on-primary/80'
                      : 'text-on-surface-variant group-hover:text-on-surface transition-colors duration-300'
                  }`}
                >
                  {metric.label}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Selected work */}
      <section className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop w-full mt-section-gap mb-section-gap flex flex-col gap-stack-lg">
        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest flex items-center gap-stack-sm">
          <span className="w-8 h-px bg-on-surface-variant/50" aria-hidden="true" />
          {sectionLabel}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
          {cases.map((item) => (
            <article
              key={item.id}
              className={`${SPAN[item.span] ?? 'md:col-span-6'} ${
                OFFSET[item.offset] ?? ''
              } group flex flex-col bg-surface-container-lowest shadow-md rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl`}
            >
              <div className={`relative w-full overflow-hidden bg-surface-variant ${HEIGHT[item.imageHeight] ?? 'h-80'}`}>
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                {item.tags.length > 0 && (
                  <>
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"
                      aria-hidden="true"
                    />
                    <div className="absolute bottom-stack-md left-stack-md flex gap-stack-sm">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-surface-bright/90 backdrop-blur text-on-surface font-label-caps text-label-caps uppercase px-3 py-1 rounded-sm shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className={`p-stack-lg flex flex-col ${item.clearOverlap ? 'md:pb-24' : ''}`}>
                <div className="flex justify-between items-baseline mb-stack-sm">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    {item.caseLabel}
                  </span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">{item.year}</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface group-hover:text-primary transition-colors">
                  {item.title}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-stack-md max-w-2xl">{item.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
