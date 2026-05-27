import Badge from '@/components/ui/Badge';

interface SocialLinksBlockProps {
  data: Record<string, unknown>;
}

type Platform = {
  platform: string;
  handle: string;
  description: string;
  cta_text: string;
  href: string;
  external: boolean;
  highlight?: boolean;
  highlight_label?: string;
};

function isPlaceholder(href: string): boolean {
  return href.startsWith('PLACEHOLDER');
}

export default function SocialLinksBlock({ data }: SocialLinksBlockProps) {
  const { platforms } = data as { platforms: Platform[] };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {platforms.map((p) => (
            <div
              key={p.platform}
              className={`bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow p-6 flex flex-col gap-4 ${
                p.highlight
                  ? 'border-2 border-primary-500'
                  : 'border border-neutral-border'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-heading font-bold text-heading-md text-neutral-text-primary">
                  {p.platform}
                </h3>
                {p.highlight && p.highlight_label && (
                  <Badge variant="primary">{p.highlight_label}</Badge>
                )}
              </div>

              <p className="font-body text-body-sm text-neutral-text-muted">{p.handle}</p>

              <p className="font-body text-body-md text-neutral-text-secondary leading-relaxed flex-1">
                {p.description}
              </p>

              {isPlaceholder(p.href) ? (
                <span className="font-body text-body-sm font-semibold text-neutral-text-muted cursor-not-allowed opacity-50 mt-auto">
                  {p.cta_text} (Coming Soon)
                </span>
              ) : (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-body-sm font-semibold text-primary-500 hover:text-primary-700 transition-colors mt-auto"
                >
                  {p.cta_text} →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
