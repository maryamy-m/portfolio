import data from '@/content/site.json'

/**
 * Single source of truth for all site copy.
 * Edit content/site.json — never edit strings inside components.
 */
export const site = data
export type Site = typeof data

export const identity = data.identity
export const nav = data.nav
export const footer = data.footer

/** Resolves a contact channel's `valueFrom` key against the identity block. */
export function channelValue(key: string): { label: string; href: string } {
  switch (key) {
    case 'email':
      return { label: identity.email, href: `mailto:${identity.email}` }
    case 'phone':
      return { label: identity.phone, href: identity.phoneHref }
    case 'linkedin':
      return { label: identity.linkedinLabel, href: identity.linkedin }
    default:
      return { label: key, href: '#' }
  }
}

/**
 * Every Material Symbol name used across the site. Google Fonts subsets the
 * icon font to exactly these glyphs, so the download stays a few KB.
 * Add a name here whenever you use a new icon in content/site.json.
 */
export const ICONS = [
  'arrow_forward',
  'attach_money',
  'calendar_month',
  'chat',
  'close',
  'emoji_events',
  'groups',
  'link',
  'mail',
  'menu',
  'north_east',
  'play_arrow',
  'workspace_premium',
] as const

export const ICON_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1' +
  `&icon_names=${ICONS.join(',')}` +
  '&display=block'
