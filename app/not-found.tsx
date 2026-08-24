import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-section-gap min-h-[60vh] flex flex-col justify-center gap-stack-lg">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-[0.2em]">
        Error 404
      </span>
      <h1 className="font-display-xl text-headline-lg-mobile md:text-display-xl text-on-surface tracking-tighter max-w-3xl">
        This page isn&apos;t part of the system.
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
        The link may be out of date. Everything worth reading is one step away.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded font-body-md self-start hover:bg-on-primary-fixed-variant transition-all hover:-translate-y-1"
      >
        Back to the start
        <span className="msym text-[18px]">arrow_forward</span>
      </Link>
    </div>
  )
}
