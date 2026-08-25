import type { Metadata } from 'next'
import { site, channelValue } from '@/lib/site'
import Ed from '@/components/cms/Ed'

const { aside, meta } = site.contact

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pt-20 pb-stack-gap">
      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-7 flex flex-col">
          <Ed
            p="contact.hero.eyebrow"
            className="font-label-mono text-label-mono text-primary uppercase tracking-widest mb-6"
          />
          <Ed
            as="h1"
            p="contact.hero.headline"
            className="text-[40px] sm:text-[56px] lg:text-[72px] font-display-lg text-primary text-balance font-bold leading-[1.1]"
          />
          <Ed as="p" p="contact.hero.body" className="font-body-lg text-body-lg text-on-surface-variant mt-8 max-w-xl" />
          <Ed
            as="p"
            p="contact.hero.bodySupporting"
            className="font-body-md text-body-md text-on-surface-variant mt-4 max-w-xl"
          />
        </div>

        {/* Aside — direct / network / base / status */}
        <div className="lg:col-span-4 lg:col-start-9 flex flex-col gap-6 mt-stack-gap lg:mt-0">
          {aside.map((row, i) => {
            const resolved = 'valueFrom' in row && row.valueFrom ? channelValue(row.valueFrom) : null
            const label = resolved ? resolved.label : row.value
            const href = resolved ? resolved.href : undefined
            const external = href?.startsWith('http')
            return (
              <div key={row.label} className="flex flex-col border-t border-outline-variant/40 pt-4">
                <Ed
                  p={`contact.aside.${i}.label`}
                  className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-2"
                />
                {href ? (
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="font-body-md text-body-md text-primary font-semibold hover:underline flex items-center gap-1 break-words"
                  >
                    {label}
                    {external && <span className="msym text-[14px]">north_east</span>}
                  </a>
                ) : (
                  <Ed
                    p={`contact.aside.${i}.value`}
                    className="font-body-md text-body-md text-on-surface font-semibold"
                  />
                )}
                <Ed
                  p={`contact.aside.${i}.sub`}
                  className="font-label-mono text-label-mono text-on-surface-variant mt-1"
                />
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
