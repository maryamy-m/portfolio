import Image from 'next/image'
import type { Metadata } from 'next'
import { site } from '@/lib/site'
import Metrics from '@/components/Metrics'
import CaseGrid from '@/components/CaseGrid'

const { hero, metrics, sectionLabel, meta } = site.work

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function WorkPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pt-20 pb-stack-gap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          <div className="lg:col-span-5 relative order-1">
            <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-surface-container-high">
              <Image
                src={hero.image}
                alt={hero.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div
                className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-surface to-transparent"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center order-2 mt-stack-gap lg:mt-0">
            <h1 className="text-[40px] lg:text-[56px] font-display-lg text-primary text-balance font-bold leading-[1.1] mb-8">
              {hero.headline}
            </h1>
            {hero.body.map((para) => (
              <p key={para} className="font-body-lg text-body-lg text-on-surface-variant mb-6 last:mb-0">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="w-full py-stack-gap relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop relative z-10">
          <Metrics items={metrics} />
        </div>
      </section>

      {/* Case grid */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pt-8 pb-stack-gap">
        <div className="flex items-center gap-6 mb-10">
          <span className="font-headline-md text-primary uppercase tracking-widest text-[28px] lg:text-[36px]">
            {sectionLabel}
          </span>
          <span className="flex-grow h-px bg-outline-variant/50" aria-hidden="true" />
        </div>
        <CaseGrid />
      </section>
    </div>
  )
}
