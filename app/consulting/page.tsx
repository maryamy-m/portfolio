import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { site } from '@/lib/site'

const { hero, tiers, break: visualBreak, cta, meta } = site.consulting

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

const TIER_SURFACE: Record<string, string> = {
  default: 'bg-surface-container',
  sparkline: 'bg-surface-container-highest',
  accent: 'bg-primary text-on-primary shadow-lg hover:shadow-xl',
}

/** Splits a title on \n so the JSON stays readable while keeping the designed line breaks. */
function TitleLines({ title, className }: { title: string; className: string }) {
  const lines = title.split('\n')
  return (
    <h2 className={className}>
      {lines.map((line, i) => (
        <span key={line}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </h2>
  )
}

export default function ConsultingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-section-gap flex flex-col lg:flex-row items-start justify-between gap-stack-lg lg:gap-section-gap relative">
        <div className="w-full lg:w-3/5 flex flex-col">
          <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            {hero.eyebrow}
          </span>
          <h1 className="font-display-xl text-headline-lg-mobile md:text-display-xl text-on-background break-words">{hero.headline}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-stack-lg max-w-xl">{hero.body}</p>
        </div>

        <div className="w-full lg:w-2/5 relative h-64 lg:h-96 rounded-xl overflow-hidden shadow-lg bg-surface-container group">
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>
      </section>

      {/* Service tiers */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-stack-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {tiers.map((tier) => {
            const accent = tier.style === 'accent'
            return (
              <article
                key={tier.label}
                className={`flex flex-col rounded-xl p-margin-desktop shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group ${
                  TIER_SURFACE[tier.style] ?? TIER_SURFACE.default
                }`}
              >
                {tier.style === 'default' && (
                  <div
                    className="absolute top-0 right-0 p-stack-md opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                    aria-hidden="true"
                  >
                    <svg className="text-primary" fill="none" height="120" viewBox="0 0 120 120" width="120">
                      <circle
                        className="animate-[spin_20s_linear_infinite] origin-center"
                        cx="60"
                        cy="60"
                        r="58"
                        stroke="currentColor"
                        strokeDasharray="8 8"
                        strokeWidth="4"
                      />
                      <path
                        d="M30 60L50 80L90 40"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="6"
                      />
                    </svg>
                  </div>
                )}

                {accent && (
                  <div
                    className="absolute -right-16 -top-16 w-64 h-64 bg-surface-tint rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700"
                    aria-hidden="true"
                  />
                )}

                <span
                  className={`font-label-caps text-label-caps mb-stack-md relative z-10 ${
                    accent ? 'text-on-primary opacity-80' : 'text-on-surface-variant opacity-60'
                  }`}
                >
                  {tier.label}
                </span>

                <TitleLines
                  title={tier.title}
                  className={`font-headline-lg text-headline-lg mb-stack-md relative z-10 ${
                    accent ? 'text-on-primary' : 'text-on-surface'
                  }`}
                />

                <p
                  className={`font-body-md text-body-md mb-stack-lg relative z-10 ${
                    accent ? 'text-on-primary opacity-90' : 'text-on-surface-variant'
                  }`}
                >
                  {tier.body}
                </p>

                {tier.chips.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-stack-sm relative z-10">
                    {tier.chips.map((chip) => (
                      <span
                        key={chip}
                        className="bg-surface-bright text-on-surface px-3 py-1 rounded-full font-label-caps text-label-caps shadow-sm"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}

                {tier.style === 'sparkline' && (
                  <div
                    className="w-full h-16 mt-auto relative z-10 opacity-70 group-hover:opacity-100 transition-opacity"
                    aria-hidden="true"
                  >
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 40">
                      <path
                        className="text-tertiary"
                        d="M0,35 Q20,35 40,25 T80,15 T120,20 T160,5 T200,2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        className="text-tertiary opacity-10"
                        d="M0,40 L0,35 Q20,35 40,25 T80,15 T120,20 T160,5 T200,2 L200,40 Z"
                        fill="currentColor"
                      />
                      <circle className="text-primary animate-pulse" cx="200" cy="2" fill="currentColor" r="4" />
                    </svg>
                  </div>
                )}

                {accent && 'ctaLabel' in tier && tier.ctaLabel && (
                  <div className="mt-auto relative z-10">
                    <Link
                      href={tier.ctaHref ?? '/contact'}
                      className="inline-flex items-center gap-2 bg-on-primary text-primary px-4 py-2 rounded-lg font-label-caps text-label-caps hover:bg-surface-container-lowest transition-colors"
                    >
                      {tier.ctaLabel}
                      <span className="msym text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>

      {/* Visual break */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-section-gap">
        <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-md relative">
          <Image
            src={visualBreak.image}
            alt={visualBreak.imageAlt}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-on-background/20 mix-blend-multiply" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 rounded-full backdrop-blur-md bg-surface/30 shadow-2xl flex items-center justify-center">
              <span className="msym text-[72px] text-on-primary">{visualBreak.icon}</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-surface-container-low py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop text-center flex flex-col items-center">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-stack-lg">
            {cta.eyebrow}
          </span>
          <Link href={cta.href} className="group inline-flex flex-col items-center cursor-pointer">
            <h2 className="font-metric-huge text-headline-lg md:text-metric-huge text-on-background group-hover:text-primary transition-colors duration-300 flex items-center gap-stack-md">
              {cta.headline}
              <span className="msym text-[40px] md:text-[48px] transform group-hover:translate-x-4 transition-transform duration-300">
                arrow_forward
              </span>
            </h2>
            <div
              className="w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left mt-stack-sm"
              aria-hidden="true"
            />
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant mt-stack-lg max-w-md">{cta.body}</p>
        </div>
      </section>
    </div>
  )
}
