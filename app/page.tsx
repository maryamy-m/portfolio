import Link from 'next/link'
import Image from 'next/image'
import { site } from '@/lib/site'

const { hero, proof, thesis, engagements, principles, capabilities } = site.home

export default function HomePage() {
  return (
    <div className="flex flex-col w-full relative">
      {/* Ambient rotating grid — decorative only */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40" aria-hidden="true">
        <svg
          className="absolute w-[200vw] h-[200vh] -top-[50vh] -left-[50vw] animate-[spin_120s_linear_infinite]"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <line opacity="0.5" stroke="#c3c5d9" strokeWidth="0.1" x1="0" x2="100" y1="50" y2="50" />
          <line opacity="0.5" stroke="#c3c5d9" strokeWidth="0.1" x1="50" x2="50" y1="0" y2="100" />
          <circle cx="50" cy="50" fill="none" r="40" stroke="#b6c4ff" strokeWidth="0.05" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop space-y-[160px] pb-[160px]">
        {/* Hero */}
        <section className="min-h-[80vh] flex flex-col justify-center items-start relative mt-32">
          <div className="w-full max-w-4xl space-y-stack-lg relative">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/5 blur-3xl rounded-full" aria-hidden="true" />
            <h1 className="font-display-xl text-headline-lg-mobile md:text-display-xl text-on-surface tracking-tighter break-words relative z-10 animate-fade-in-up">
              {hero.headline}
            </h1>
            <div className="flex flex-col md:flex-row gap-gutter pt-stack-lg border-t border-secondary-fixed/50">
              <div className="flex-1">
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                  <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase block mb-4">
                    {hero.eyebrow}
                  </span>
                  {hero.subhead}
                </p>
              </div>
              <div className="flex-none self-start">
                <Link
                  href={hero.ctaHref}
                  className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded font-body-md hover:bg-on-primary-fixed-variant transition-all hover:-translate-y-1 hover:shadow-lg shadow-primary/20"
                >
                  {hero.ctaLabel}
                  <span className="msym text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 hidden lg:block opacity-20 pointer-events-none" aria-hidden="true">
            <div
              className="font-metric-huge text-[120px] leading-none text-on-surface tracking-tighter"
              style={{ writingMode: 'vertical-rl' }}
            >
              {hero.ambientText}
            </div>
          </div>
        </section>

        {/* Proof */}
        <section className="w-full relative">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-stack-lg border-b border-secondary-fixed/50 pb-stack-sm">
            <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-[0.2em]">
              {proof.eyebrow}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {proof.metrics.map((metric) => (
              <div
                key={metric.label}
                className="bg-surface-container-low p-stack-lg rounded shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent -mr-16 -mt-16 rounded-full transition-transform group-hover:scale-150"
                  aria-hidden="true"
                />
                {'value' in metric && metric.value ? (
                  <div className="font-metric-huge text-metric-huge text-on-surface mb-stack-sm relative z-10">
                    {metric.value}
                  </div>
                ) : (
                  <div className="flex items-center mb-stack-sm relative z-10">
                    <span className="msym msym-filled text-metric-huge text-on-surface">
                      {'icon' in metric ? metric.icon : ''}
                    </span>
                  </div>
                )}
                <div className="font-label-caps text-label-caps text-on-surface-variant relative z-10">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Thesis */}
        <section className="w-full relative py-section-gap bg-surface-container-high rounded p-margin-desktop shadow-sm flex flex-col lg:flex-row gap-stack-lg items-center">
          <div className="lg:w-1/3">
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tighter">{thesis.headline}</h2>
          </div>
          <div className="lg:w-2/3 lg:border-l border-secondary-fixed/50 lg:pl-stack-lg">
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {thesis.bodyBefore}
              <strong>{thesis.bodyEmphasis}</strong>
              {thesis.bodyAfter}
            </p>
          </div>
        </section>

        {/* Selected engagements — bento */}
        <section className="w-full relative" id="work">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-stack-lg border-b border-secondary-fixed/50 pb-stack-sm">
            <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-[0.2em]">
              {engagements.eyebrow}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter md:auto-rows-[400px]">
            {/* Founding GTM */}
            <div className="col-span-1 md:col-span-8 bg-surface-container-lowest rounded shadow-md hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container-highest/20 pointer-events-none"
                aria-hidden="true"
              />
              <div className="p-stack-lg flex flex-col h-full z-10">
                <div className="flex justify-between items-start mb-auto">
                  <div>
                    <span className="font-label-caps text-label-caps bg-primary/10 text-primary px-2 py-1 rounded inline-block mb-stack-sm">
                      {engagements.founding.tag}
                    </span>
                    <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">
                      {engagements.founding.headline}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-gutter items-stretch sm:items-end mt-8">
                  <div className="flex-1 bg-surface rounded p-4 shadow-sm border border-secondary-fixed/20">
                    <div className="text-xs text-on-surface-variant mb-2">{engagements.founding.chartLabel}</div>
                    <div className="h-24 flex items-end gap-1" aria-hidden="true">
                      <div className="w-1/4 bg-primary/20 h-1/4 rounded-t" />
                      <div className="w-1/4 bg-primary/40 h-2/4 rounded-t" />
                      <div className="w-1/4 bg-primary/60 h-3/4 rounded-t" />
                      <div className="w-1/4 bg-primary h-full rounded-t" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    {engagements.founding.rows.map((row) => (
                      <div key={row.label} className="flex justify-between border-b border-secondary-fixed/50 pb-2">
                        <span className="font-label-caps text-label-caps text-on-surface-variant">{row.label}</span>
                        <span className="font-body-md text-body-md font-semibold text-on-surface">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Ecosystems */}
            <div className="col-span-1 md:col-span-4 bg-surface-container-lowest rounded shadow-md hover:shadow-xl transition-all p-stack-lg flex flex-col justify-between">
              <div>
                <span className="font-label-caps text-label-caps bg-primary/10 text-primary px-2 py-1 rounded inline-block mb-stack-sm">
                  {engagements.ecosystems.tag}
                </span>
                <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">
                  {engagements.ecosystems.headline}
                </h3>
              </div>
              <div className="mt-8 space-y-stack-sm">
                <div className="bg-surface-container-low p-4 rounded text-center shadow-sm">
                  <div className="font-metric-huge text-headline-lg text-primary">
                    {engagements.ecosystems.metricValue}
                  </div>
                  <div className="font-label-caps text-label-caps text-on-surface-variant">
                    {engagements.ecosystems.metricLabel}
                  </div>
                </div>
                <div className="bg-surface-container-low p-4 rounded text-center shadow-sm">
                  <div className="font-body-md text-body-md text-on-surface font-medium">
                    {engagements.ecosystems.note}
                  </div>
                </div>
              </div>
            </div>

            {/* Chief of Staff */}
            <div className="col-span-1 md:col-span-5 bg-primary text-on-primary rounded shadow-md hover:shadow-xl transition-all p-stack-lg flex flex-col justify-between relative overflow-hidden">
              <div
                className="absolute -right-20 -top-20 w-64 h-64 bg-on-primary/10 rounded-full blur-2xl"
                aria-hidden="true"
              />
              <div className="relative z-10">
                <span className="font-label-caps text-label-caps bg-on-primary/20 text-on-primary px-2 py-1 rounded inline-block mb-stack-sm">
                  {engagements.chiefOfStaff.tag}
                </span>
                <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-primary mb-4">
                  {engagements.chiefOfStaff.headline}
                </h3>
                <p className="font-body-md text-body-md text-on-primary/80">{engagements.chiefOfStaff.body}</p>
              </div>
              <div className="flex gap-4 mt-8 relative z-10">
                {engagements.chiefOfStaff.stats.map((stat, i) => (
                  <div key={stat.label} className="flex gap-4">
                    {i > 0 && <div className="w-px bg-on-primary/20" aria-hidden="true" />}
                    <div>
                      <div className="font-headline-lg text-headline-lg text-on-primary">{stat.value}</div>
                      <div className="font-label-caps text-label-caps text-on-primary/70">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Crisis ops */}
            <div className="col-span-1 md:col-span-7 bg-surface-container-lowest rounded shadow-md hover:shadow-xl transition-all relative overflow-hidden flex flex-col sm:flex-row">
              <div className="w-full sm:w-1/2 h-48 sm:h-auto relative">
                <Image
                  src={engagements.crisis.image}
                  alt={engagements.crisis.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-container-lowest"
                  aria-hidden="true"
                />
              </div>
              <div className="w-full sm:w-1/2 p-stack-lg flex flex-col justify-center">
                <span className="font-label-caps text-label-caps bg-primary/10 text-primary px-2 py-1 rounded inline-block mb-stack-sm self-start">
                  {engagements.crisis.tag}
                </span>
                <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">
                  {engagements.crisis.headline}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{engagements.crisis.body}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Principles + capabilities */}
        <section className="w-full relative flex flex-col lg:flex-row gap-margin-desktop">
          <div className="lg:w-1/2 space-y-stack-lg">
            <div className="border-b border-secondary-fixed/50 pb-stack-sm">
              <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-[0.2em]">
                {principles.eyebrow}
              </h2>
            </div>
            <ul className="space-y-stack-md">
              {principles.items.map((item) => (
                <li
                  key={item.number}
                  className="flex items-start gap-4 p-4 rounded hover:bg-surface-container-low transition-colors group"
                >
                  <div className="font-label-caps text-label-caps text-primary mt-1">{item.number}</div>
                  <div>
                    <h3 className="font-body-lg text-body-lg font-semibold text-on-surface group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-1/2 space-y-stack-lg">
            <div className="border-b border-secondary-fixed/50 pb-stack-sm">
              <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-[0.2em]">
                {capabilities.eyebrow}
              </h2>
            </div>
            <div className="bg-surface-container-lowest p-stack-lg shadow-sm rounded border border-secondary-fixed/20 relative">
              <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#e5e2e1_1px,transparent_1px),linear-gradient(to_bottom,#e5e2e1_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.15] pointer-events-none rounded"
                aria-hidden="true"
              />
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-y-stack-lg gap-x-gutter">
                {capabilities.groups.map((group) => (
                  <div key={group.title}>
                    <h3 className="font-body-md text-body-md font-semibold text-on-surface mb-3 flex items-center gap-2">
                      <span className="msym text-[16px] text-primary">{group.icon}</span>
                      {group.title}
                    </h3>
                    <ul className="space-y-2 font-body-md text-body-md text-on-surface-variant">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
