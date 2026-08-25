import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SignInForm from '@/components/cms/SignInForm'
import { signInSlug } from '@/lib/cms-auth'

/**
 * The editor's sign-in page, served from the secret path in CMS_PATH.
 *
 * `generateStaticParams` prerenders exactly that one segment and nothing else,
 * and `dynamicParams = false` makes every other single-segment URL fall through
 * to the normal 404. So this stays a static route with no runtime lookup, and
 * the address exists only in the environment — never in the repository, which
 * is public.
 *
 * With CMS_PATH unset no page is generated at all, which is part of what turns
 * the editor off for an unconfigured deployment.
 */
export const dynamicParams = false

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
}

export function generateStaticParams() {
  const slug = signInSlug()
  return slug ? [{ cmsPath: slug }] : []
}

export default async function EditorSignInPage({ params }: { params: Promise<{ cmsPath: string }> }) {
  const { cmsPath } = await params
  if (cmsPath !== signInSlug()) notFound()

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pt-20 pb-stack-gap min-h-[60vh] flex items-center">
      <SignInForm />
    </div>
  )
}
