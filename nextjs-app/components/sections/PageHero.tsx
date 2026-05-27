'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import Badge from '@/components/ui/Badge';

interface PageHeroProps {
  data: {
    badge?: string;
    headline?: string;
    subheadline?: string;
    [key: string]: unknown;
  };
}

export default function PageHero({ data }: PageHeroProps) {
  const { badge, headline, subheadline } = data;
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-gradient-to-br from-primary-50 to-primary-100 min-h-[50vh] flex items-center justify-center px-6 md:px-8 py-16 md:py-24">
      <div ref={ref} className="scroll-reveal max-w-[800px] mx-auto text-center">
        {badge && (
          <div className="mb-6 flex justify-center">
            <Badge>{badge as string}</Badge>
          </div>
        )}
        {headline && (
          <h1 className="font-heading font-extrabold text-display-md md:text-display-lg text-neutral-text-primary mb-6 leading-tight">
            {headline as string}
          </h1>
        )}
        {subheadline && (
          <p className="font-body text-body-md md:text-body-lg text-neutral-text-secondary leading-relaxed">
            {subheadline as string}
          </p>
        )}
      </div>
    </section>
  );
}
