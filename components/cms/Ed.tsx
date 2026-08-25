import { createElement } from 'react'
import { site } from '@/lib/site'
import { getPath } from '@/lib/cms'

/**
 * Renders one string from content/site.json and stamps its path into the HTML
 * as `data-cms`, which is how the inline editor knows what a click on that text
 * is editing. For a visitor this is a plain element plus one short attribute;
 * nothing is fetched and no script is involved.
 *
 * The value is read from the path rather than passed in, so the rendered text
 * and the address the editor writes back to can never drift apart. A path that
 * doesn't resolve to a string or a number throws during `next build` — every
 * page is prerendered, so a typo is a failed build, not a blank spot on the
 * live site.
 */
type Props = {
  /** Dot path into site.json, e.g. `home.hero.headline`. */
  p: string
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'li' | 'strong'
  className?: string
}

export default function Ed({ p, as = 'span', className }: Props) {
  const value = getPath(site, p)
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(`<Ed p="${p}" /> — content/site.json has no text at that path.`)
  }
  return createElement(as, { 'data-cms': p, className }, String(value))
}
