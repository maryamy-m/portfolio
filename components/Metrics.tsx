import { site } from '@/lib/site'
import Ed from '@/components/cms/Ed'

type Metric = (typeof site.home.metrics)[number]

/**
 * Shared metric strip — same four figures on Home and Work, ordered per screen.
 *
 * `path` is the base address of `items` in content/site.json (`home.metrics` or
 * `work.metrics`) so each figure can carry its own `data-cms` path for the
 * inline editor. The two screens order the same numbers differently, so the
 * index only means anything relative to that base.
 */
export default function Metrics({ items, path }: { items: readonly Metric[]; path: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter lg:gap-8">
      {items.map((m, i) => (
        <div
          key={m.label}
          className="bg-surface-container border border-outline-variant/30 rounded-xl p-8 flex flex-col group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10" aria-hidden="true">
            <span className="msym text-[64px] text-primary">{m.icon}</span>
          </div>
          <div className="font-display-lg text-primary flex items-baseline z-10 mb-2 gap-1">
            {m.prefix && <Ed p={`${path}.${i}.prefix`} className="text-3xl font-bold" />}
            <Ed p={`${path}.${i}.value`} className="text-[64px] font-display-lg leading-none" />
            {m.suffix && <Ed p={`${path}.${i}.suffix`} className="text-3xl font-bold" />}
          </div>
          <Ed
            as="p"
            p={`${path}.${i}.label`}
            className="font-body-md text-on-surface-variant uppercase tracking-widest text-[14px] z-10"
          />
        </div>
      ))}
    </div>
  )
}
