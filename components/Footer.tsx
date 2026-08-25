'use client'

import { usePathname } from 'next/navigation'
import { site, channelValue } from '@/lib/site'

const { headline, links, copyright } = site.footer

export default function Footer() {
  // /contact opens with this exact sentence — don't say it twice on one page.
  const showHeadline = usePathname() !== '/contact'

  return (
    <footer className="w-full bg-surface border-t border-outline-variant/30 text-on-surface font-body-md py-stack-gap">
      <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end w-full gap-12">
          <div className="max-w-2xl w-full">
            <div className="h-px w-full bg-outline-variant/50 mb-8" aria-hidden="true" />
            {showHeadline && (
              <h2 className="font-display-lg text-[40px] lg:text-[48px] text-primary leading-tight font-bold">
                {headline}
              </h2>
            )}
            <div className="flex flex-wrap gap-8 mt-10">
              {links.map((link) => {
                const { href } = channelValue(link.valueFrom)
                const external = href.startsWith('http')
                return (
                  <a
                    key={link.label}
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="flex items-center gap-3 text-primary hover:underline font-body-md text-[20px] lg:text-[24px]"
                  >
                    <span className="msym text-[32px]">{link.icon}</span>
                    {link.label}
                  </a>
                )
              })}
            </div>
          </div>
          <p className="font-label-mono text-label-mono text-on-surface-variant lg:self-end">{copyright}</p>
        </div>
      </div>
    </footer>
  )
}
