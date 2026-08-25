import Image from 'next/image'
import { site } from '@/lib/site'
import { getPath } from '@/lib/cms'

/**
 * An image whose file can be replaced from the live site.
 *
 * Like `<Ed>`, the src is read from its path in content/site.json so the two
 * can't drift, and a path that doesn't resolve throws during `next build`.
 * `data-cms-image` lands on the underlying `<img>` rather than on a wrapper —
 * these images are `fill`-positioned inside containers the layout depends on,
 * so introducing an element would move things.
 */
type Props = {
  /** Path to the image path in site.json, e.g. `home.hero.image`. */
  p: string
  /** Path to its alt text in site.json. Omit with `alt=""` for decorative images. */
  altPath?: string
  alt?: string
  className?: string
  fill?: boolean
  sizes?: string
  width?: number
  height?: number
  priority?: boolean
}

export default function EdImage({ p, altPath, alt, className, fill, sizes, width, height, priority }: Props) {
  const src = getPath(site, p)
  if (typeof src !== 'string') {
    throw new Error(`<EdImage p="${p}" /> — content/site.json has no image path there.`)
  }

  let altText = alt ?? ''
  if (altPath) {
    const value = getPath(site, altPath)
    if (typeof value !== 'string') {
      throw new Error(`<EdImage altPath="${altPath}" /> — content/site.json has no text there.`)
    }
    altText = value
  }

  return (
    <Image
      src={src}
      alt={altText}
      className={className}
      fill={fill}
      sizes={sizes}
      width={width}
      height={height}
      priority={priority}
      data-cms-image={p}
    />
  )
}
