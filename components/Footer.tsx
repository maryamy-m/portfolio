'use client'

import { usePathname } from 'next/navigation'
import { site, channelValue } from '@/lib/site'
import Ed from '@/components/cms/Ed'

const { links } = site.footer

export default function Footer() {
  // /contact opens with this exact sentence — don't say it twice on one page.
  const showHeadline = usePathname() !== '/contact'

  return (
    // One rule only: the footer's own top border. An inner <hr> under it read as a doubled line.
    <footer className="w-full bg-surface border-t border-outline-variant/30 text-on-surface font-body-md pt-6 pb-8">
      <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
        {showHeadline && (
          // Held to a single line at every width: nowrap plus a viewport-scaled size.
          // 5vw keeps ~30 characters of Sora bold inside the margins down to 320px,
          // and the 48px ceiling stops it growing past the old desktop size.
          <Ed
            as="h2"
            p="footer.headline"
            className="font-display-lg text-[clamp(16px,5vw,48px)] text-primary leading-tight font-bold whitespace-nowrap"
          />
        )}
        <div
          className={`flex flex-col sm:flex-row justify-between items-start sm:items-end w-full gap-8 ${
            showHeadline ? 'mt-8' : ''
          }`}
        >
          <div className="flex flex-wrap gap-8">
            {links.map((link, i) => {
              const { href } = channelValue(link.valueFrom)
              const external = href.startsWith('http')
              return (
                <a
                  key={link.label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex items-center gap-3 text-primary hover:underline font-body-md text-[18px] lg:text-[22px]"
                >
                  <span className="msym text-[28px]">{link.icon}</span>
                  <Ed p={`footer.links.${i}.label`} />
                </a>
              )
            })}
          </div>
          <Ed
            as="p"
            p="footer.copyright"
            className="font-label-mono text-label-mono text-on-surface-variant"
          />
        </div>
      </div>
    </footer>
  )
}
