import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/lib/site'
import Metrics from '@/components/Metrics'
import CaseGrid from '@/components/CaseGrid'
import HeroFrame from '@/components/HeroFrame'

const { hero, metrics, selectedWork } = site.home

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pb-stack-gap pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1 z-10">
            <h1 className="text-[48px] sm:text-[64px] lg:text-[80px] font-display-lg text-primary text-balance mb-4 font-bold leading-[1.05]">
              {hero.headline}
            </h1>
            <h2 className="text-[28px] lg:text-[40px] font-headline-md text-primary text-balance mb-4 leading-[1.2]">
              {hero.subhead}
            </h2>
            <Link
              href={hero.inlineLink.href}
              className="inline-block self-start text-primary font-semibold text-[18px] lg:text-[20px] hover:underline underline-offset-8 decoration-2 transition-all mb-6"
            >
              {hero.inlineLink.label}
            </Link>

            <div className="flex flex-wrap items-center gap-6 mt-4">
              <Link
                href={hero.ctaPrimary.href}
                className="bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-headline-md text-[14px] px-6 py-4 rounded transition-colors flex items-center gap-2 group"
              >
                {hero.ctaPrimary.label}
                <span className="msym text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link
                href={hero.ctaSecondary.href}
                className="border border-outline-variant hover:border-primary text-primary bg-transparent font-headline-md text-[14px] px-6 py-4 rounded transition-colors"
              >
                {hero.ctaSecondary.label}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 relative order-1 lg:order-2 mt-stack-gap lg:mt-0">
            <HeroFrame />
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
              <span className="absolute top-4 left-4 font-label-mono text-label-mono text-on-primary uppercase tracking-widest bg-primary px-4 py-2 rounded-full shadow-md z-10">
                {hero.badgeRole}
              </span>
              <span className="absolute bottom-4 left-4 font-label-mono text-label-mono text-primary uppercase tracking-widest bg-white px-4 py-2 rounded-full shadow-md z-10">
                {hero.badgeLocation}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="w-full py-stack-gap relative overflow-hidden mt-stack-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop relative z-10">
          <Metrics items={metrics} />
        </div>
      </section>

      {/* Selected work */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pt-8 pb-stack-gap">
        <div className="flex items-center gap-6 mb-10">
          <span className="font-headline-md text-primary uppercase tracking-widest text-[28px] lg:text-[36px]">
            {selectedWork.label}
          </span>
          <span className="flex-grow h-px bg-outline-variant/50" aria-hidden="true" />
        </div>
        <CaseGrid />
      </section>
    </div>
  )
}
