import Image from 'next/image'
import type { Metadata } from 'next'
import { site, identity, channelValue } from '@/lib/site'

const { hero, asideLabels, channels, map, reserve, meta } = site.contact

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function ContactPage() {
  const rfpHref = `mailto:${identity.email}?subject=${encodeURIComponent('RFP — engagement enquiry')}`

  return (
    <div className="flex flex-col w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pb-section-gap pt-section-gap gap-section-gap">
      {/* Hero */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-8 flex flex-col gap-stack-lg">
          <h1 className="font-headline-lg text-headline-lg-mobile md:font-display-xl md:text-display-xl text-on-background break-words max-w-[800px] leading-[0.9]">
            {hero.headline}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[600px]">{hero.body}</p>
        </div>

        <div className="md:col-span-4 flex flex-col gap-stack-md mt-stack-lg md:mt-0 justify-end md:items-end">
          <div className="flex flex-col gap-unit">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
              {asideLabels.response}
            </span>
            <span className="font-body-md text-body-md text-on-background font-medium">{identity.responseTime}</span>
          </div>
          <div className="h-px w-full max-w-[200px] bg-secondary-fixed" aria-hidden="true" />
          <div className="flex flex-col gap-unit">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
              {asideLabels.base}
            </span>
            <span className="font-body-md text-body-md text-on-background font-medium">{identity.location}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Channels */}
        <div className="flex flex-col gap-gutter">
          {channels.map((channel) => {
            const { label, href } = channelValue(channel.valueFrom)
            const external = href.startsWith('http')
            return (
              <a
                key={channel.label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex flex-col p-stack-lg bg-surface-container hover:bg-surface-container-high transition-colors rounded-lg border border-outline-variant/30"
              >
                <div className="flex items-center justify-between mb-stack-lg">
                  <span className="msym text-primary text-[32px]">{channel.icon}</span>
                  <span className="msym text-on-surface-variant group-hover:text-primary transition-colors">
                    arrow_outward
                  </span>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface-variant mb-unit uppercase">
                  {channel.label}
                </span>
                <span className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface break-words">
                  {label}
                </span>
              </a>
            )
          })}
        </div>

        {/* Map + reserve */}
        <div className="flex flex-col gap-gutter">
          <div className="w-full h-[400px] rounded-lg overflow-hidden border border-outline-variant/30 shadow-sm relative">
            <div className="absolute top-stack-sm left-stack-sm z-10 bg-surface/90 backdrop-blur px-stack-md py-stack-sm rounded border border-outline-variant/50">
              <span className="font-label-caps text-label-caps text-on-surface flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                {identity.locationCode}
              </span>
            </div>
            <Image src={map.image} alt={map.imageAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>

          <div className="bg-primary text-on-primary p-stack-lg rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-stack-lg shadow-md">
            <div className="flex flex-col gap-stack-sm">
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-primary/80">
                {reserve.eyebrow}
              </span>
              <span className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-primary">
                {reserve.headline}
              </span>
            </div>
            <a
              href={rfpHref}
              className="bg-surface text-primary px-stack-lg py-stack-md rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container-low transition-colors whitespace-nowrap"
            >
              {reserve.ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
