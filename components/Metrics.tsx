import { site } from '@/lib/site'

type Metric = (typeof site.home.metrics)[number]

/** Shared metric strip — same four figures on Home and Work, ordered per screen. */
export default function Metrics({ items }: { items: readonly Metric[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter lg:gap-8">
      {items.map((m) => (
        <div
          key={m.label}
          className="bg-surface-container border border-outline-variant/30 rounded-xl p-8 flex flex-col group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10" aria-hidden="true">
            <span className="msym text-[64px] text-primary">{m.icon}</span>
          </div>
          <div className="font-display-lg text-primary flex items-baseline z-10 mb-2 gap-1">
            {m.prefix && <span className="text-3xl font-bold">{m.prefix}</span>}
            <span className="text-[64px] font-display-lg leading-none">{m.value}</span>
            {'arrowTo' in m && m.arrowTo !== undefined && (
              <>
                <span className="msym text-[32px] text-primary self-center">arrow_right_alt</span>
                <span className="text-[64px] font-display-lg leading-none">{m.arrowTo}</span>
              </>
            )}
            {m.suffix && <span className="text-3xl font-bold">{m.suffix}</span>}
          </div>
          <p className="font-body-md text-on-surface-variant uppercase tracking-widest text-[14px] z-10">{m.label}</p>
        </div>
      ))}
    </div>
  )
}
