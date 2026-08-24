import { footer } from '@/lib/site'

export default function Footer() {
  return (
    <footer className="w-full bg-background pt-section-gap pb-stack-lg">
      <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop border-t border-outline-variant pt-stack-lg">
        <div className="flex flex-col md:flex-row justify-between items-start gap-stack-lg">
          <div className="flex flex-col gap-unit">
            <span className="font-label-caps text-label-caps text-on-surface">{footer.eyebrow}</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant opacity-60 uppercase">
              {footer.copyright}
            </span>
          </div>
          <div className="flex gap-gutter">
            {footer.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
