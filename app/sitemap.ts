import type { MetadataRoute } from 'next'
import { identity, nav } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = identity.siteUrl.replace(/\/$/, '')
  const routes = ['/', ...nav.map((item) => item.href)]

  return routes.map((route) => ({
    url: `${base}${route === '/' ? '' : route}`,
    changeFrequency: 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }))
}
