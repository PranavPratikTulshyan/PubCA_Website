import Button from '@/components/ui/Button';

interface CTABannerProps {
  data: Record<string, unknown>;
}

export default function CTABanner({ data }: CTABannerProps) {
  const { title, subtitle, cta_primary, cta_secondary } = data as {
    title?: string;
    subtitle?: string;
    cta_primary?: { text: string; href: string; variant?: 'primary' | 'secondary' | 'ghost' };
    cta_secondary?: { text: string; href: string; variant?: 'primary' | 'secondary' | 'ghost' };
  };

  const ctaPrimary = cta_primary ?? { text: '', href: '/', variant: 'primary' };
  const ctaSecondary = cta_secondary ?? { text: '', href: '/', variant: 'secondary' };

  return (
    <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-heading font-extrabold text-heading-xl md:text-display-md text-neutral-text-primary mb-6">
          {title}
        </h2>
        <p className="font-body text-body-md md:text-body-lg text-neutral-text-secondary mb-10 leading-relaxed">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href={ctaPrimary.href} variant={ctaPrimary.variant ?? 'primary'}>
            {ctaPrimary.text}
          </Button>
          <Button href={ctaSecondary.href} variant={ctaSecondary.variant ?? 'secondary'}>
            {ctaSecondary.text}
          </Button>
        </div>
      </div>
    </section>
  );
}
