'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import SectionHeader from '@/components/ui/SectionHeader';
import Link from 'next/link';

interface AboutTeaserProps {
  data: Record<string, unknown>;
}

export default function AboutTeaser({ data }: AboutTeaserProps) {
  const { eyebrow, title, body, link, stats } = data as {
    eyebrow?: string;
    title?: string;
    body?: string;
    link?: { text: string; href: string };
    stats?: Array<{ value: string; label: string; icon: string }>;
  };

  const statsArray = stats ?? [];
  const ctaLink = link ?? { text: '', href: '/' };
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section ref={ref} className="scroll-reveal bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid gap-16 md:grid-cols-2 items-center">
        <div>
          <SectionHeader eyebrow={eyebrow} title={title ?? ''} align="left" />
          {body && (
            <p className="font-body text-body-md text-neutral-text-secondary mt-6 leading-relaxed">
              {body}
            </p>
          )}
          {ctaLink?.href && (
            <Link
              href={ctaLink.href}
              className="font-body text-body-md text-primary-500 hover:text-primary-700 transition-colors mt-4 inline-block"
            >
              {ctaLink.text}
            </Link>
          )}
        </div>

        <div>
          <div className="grid grid-cols-2 gap-8">
            {statsArray.map((stat) => (
              <div key={stat.label}>
                <p className="font-heading font-extrabold text-display-md text-primary-500">
                  {stat.value}
                </p>
                <p className="font-body text-body-sm text-neutral-text-secondary mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
