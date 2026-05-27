'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface HeroFullscreenProps {
  data: Record<string, unknown>;
}

export default function HeroFullscreen({ data }: HeroFullscreenProps) {
  const {
    badge,
    headline,
    subheadline,
    cta_primary,
    cta_secondary,
    visual,
  } = data as {
    badge?: string;
    headline?: { line_1: string; line_2: string };
    subheadline?: string;
    cta_primary?: { text: string; href: string; variant?: 'primary' | 'secondary' | 'ghost' };
    cta_secondary?: { text: string; href: string; variant?: 'primary' | 'secondary' | 'ghost' };
    visual?: { type?: string; alt?: string; description?: string };
  };

  const ctaPrimary = cta_primary ?? { text: '', href: '', variant: 'primary' };
  const ctaSecondary = cta_secondary;
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center px-6 md:px-8 py-20 md:py-24">
      <div className="mx-auto w-full max-w-7xl grid gap-12 md:grid-cols-2 items-center">
        <div ref={ref} className="scroll-reveal flex flex-col justify-center gap-8">
          {badge && <Badge>{badge}</Badge>}

          {headline && (
            <h1 className="font-heading font-extrabold text-display-md md:text-display-lg text-neutral-text-primary leading-tight">
              <span className="block">{headline.line_1}</span>
              <span className="block">{headline.line_2}</span>
            </h1>
          )}

          {subheadline && (
            <p className="font-body text-body-md md:text-body-lg text-neutral-text-secondary leading-relaxed">
              {subheadline}
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            <Button href={ctaPrimary.href} variant={ctaPrimary.variant ?? 'primary'}>
              {ctaPrimary.text}
            </Button>
            {ctaSecondary && (
              <Button href={ctaSecondary.href} variant={ctaSecondary.variant ?? 'secondary'}>
                {ctaSecondary.text}
              </Button>
            )}
          </div>
        </div>

        <div className="w-full">
          <div
            className="bg-primary-100 rounded-2xl w-full aspect-square flex items-center justify-center p-8"
            aria-label={visual?.alt ?? 'Illustration placeholder'}
          >
            <p className="font-body text-body-md text-primary-700 text-center">
              {visual?.alt ?? 'Illustration placeholder'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
