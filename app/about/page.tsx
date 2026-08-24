import Image from 'next/image'
import type { Metadata } from 'next'
import { site } from '@/lib/site'

const { hero, philosophy, timeline, meta } = site.about

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pt-32 pb-section-gap relative">
        <div
          className="absolute top-0 right-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"
          aria-hidden="true"
        />
        <div className="flex flex-col w-full md:w-10/12">
          <h1 className="font-display-xl text-headline-lg-mobile md:text-display-xl text-on-background tracking-tighter break-words md:-ml-2 leading-[0.9]">
            {hero.lineOne}
            <br />
            <span className="text-primary">{hero.lineTwo}</span>
          </h1>
        </div>
      </section>

      {/* Philosophy + toolkit */}
      <section className="w-full bg-surface-container-low py-section-gap relative overflow-hidden shadow-sm">
        <div
          className="absolute -left-32 top-1/2 w-[500px] h-[500px] bg-inverse-primary/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"
          aria-hidden="true"
        />
        <div className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter items-center relative z-10">
          <div className="md:col-span-5 flex flex-col gap-stack-lg">
            <div className="flex flex-col gap-stack-sm">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">
                {philosophy.eyebrow}
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">{philosophy.headline}</h2>
            </div>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-prose">{philosophy.body}</p>

            <div className="mt-stack-md flex flex-col gap-stack-sm">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase opacity-60">
                {philosophy.toolkitLabel}
              </span>
              <div className="flex flex-wrap gap-unit">
                {philosophy.toolkit.map((tool) => (
                  <div
                    key={tool}
                    className="bg-surface px-4 py-2 shadow-sm rounded-sm hover:shadow-md transition-shadow"
                  >
                    <span className="font-label-caps text-label-caps text-on-surface">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7 relative mt-stack-lg md:mt-0 mb-12 md:mb-0">
            <div className="w-full aspect-[4/5] relative shadow-2xl rounded-lg overflow-hidden">
              <Image
                src={philosophy.image}
                alt={philosophy.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 left-4 md:-left-8 bg-surface p-stack-md shadow-xl rounded-lg flex flex-col gap-unit">
              <span className="font-metric-huge text-metric-huge text-on-surface">{philosophy.statValue}</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                {philosophy.statLabel}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-section-gap">
        <div className="flex flex-col md:flex-row gap-gutter">
          <div className="md:w-1/3 flex flex-col gap-stack-sm">
            <h2 className="font-headline-lg text-headline-lg text-on-background md:sticky md:top-32">
              {timeline.headlineTop}
              <br />
              {timeline.headlineBottom}
            </h2>
          </div>

          <div className="md:w-2/3 flex flex-col gap-stack-md mt-stack-lg md:mt-0">
            {timeline.items.map((item) => (
              <div
                key={item.year}
                className="group bg-surface-container-lowest p-stack-lg shadow-sm hover:shadow-lg transition-all duration-300 rounded-lg flex flex-col md:flex-row gap-stack-md justify-between items-start cursor-default"
              >
                <div className="flex flex-col gap-unit w-full md:w-3/4">
                  {item.badge && (
                    <span className="font-label-caps text-label-caps text-primary uppercase">{item.badge}</span>
                  )}
                  <h3 className="font-body-lg text-body-lg text-on-surface font-semibold">{item.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{item.body}</p>
                </div>
                <span className="font-metric-huge text-metric-huge text-surface-dim opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all duration-500">
                  {item.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
