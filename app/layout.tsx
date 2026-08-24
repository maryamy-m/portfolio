import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { identity, site, ICON_FONT_HREF } from '@/lib/site'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(identity.siteUrl),
  title: {
    default: `${identity.name} — ${site.home.meta.title}`,
    template: `%s — ${identity.name}`,
  },
  description: site.home.meta.description,
  openGraph: {
    title: `${identity.name} — ${site.home.meta.title}`,
    description: site.home.meta.description,
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Subsetted to only the icons this site uses — see ICONS in lib/site.ts */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href={ICON_FONT_HREF} rel="stylesheet" />
      </head>
      <body className="bg-background font-body-md text-body-md text-on-background antialiased">
        <Header />
        {/* overflow-x-clip (not hidden) contains the decorative blobs that sit past the
            right edge on narrow screens, without creating a scroll container —
            which would break the About page's sticky heading. */}
        <main className="w-full pt-20 bg-background overflow-x-clip">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
