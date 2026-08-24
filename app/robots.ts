import type { MetadataRoute } from 'next'
import { identity } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${identity.siteUrl.replace(/\/$/, '')}/sitemap.xml`,
  }
}
