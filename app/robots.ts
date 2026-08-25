import type { MetadataRoute } from 'next'
import { identity } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    // /api/cms are the editor's write endpoints, not site content.
    // The sign-in page is deliberately absent: naming its path here would
    // publish the one thing that keeps it hidden. It carries a noindex
    // meta tag of its own instead.
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${identity.siteUrl.replace(/\/$/, '')}/sitemap.xml`,
  }
}
