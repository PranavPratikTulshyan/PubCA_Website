'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Link from 'next/link';

interface JourneyTeaserProps {
  data: Record<string, unknown>;
}

export default function JourneyTeaser({ data }: JourneyTeaserProps) {
  const { eyebrow, title, subtitle, milestones, link } = data as {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    milestones?: Array<{ date: string; title: string; tag: string; tag_color: string }>;
    link?: { text: string; href: string };
  };

  const milestoneItems = milestones ?? [];
  const ctaLink = link ?? { text: '', href: '/' };
  const ref = useScrollReveal<HTMLDivElement>();

  const badgeVariant = (tagColor: string) => {
    switch (tagColor) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <section className="bg-neutral-50 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow={eyebrow}
          title={title ?? ''}
          subtitle={subtitle}
          align="center"
        />

        <div ref={ref} className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {milestoneItems.map((milestone) => (
            <Card key={milestone.title} className="p-5 flex flex-col gap-3">
              <p className="font-body text-body-sm text-neutral-text-muted">{milestone.date}</p>
              <p className="font-heading font-semibold text-heading-sm text-neutral-text-primary">
                {milestone.title}
              </p>
              <Badge variant={badgeVariant(milestone.tag_color)}>{milestone.tag}</Badge>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href={ctaLink.href}
            className="font-body text-body-md text-primary-500 hover:text-primary-700 transition-colors"
          >
            {ctaLink.text}
          </Link>
        </div>
      </div>
    </section>
  );
}
