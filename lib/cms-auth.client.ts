/**
 * The one auth constant the browser needs. Split out from `lib/cms-auth.ts`
 * because that module imports node:crypto and next/headers, neither of which
 * can be pulled into a client bundle.
 *
 * The cookie's value is the editor's secret sign-in path, so a returning owner
 * whose session has lapsed can be offered a link back to it. Only a browser
 * that has already signed in ever receives it.
 */
export const HINT_COOKIE = 'cms_hint'
