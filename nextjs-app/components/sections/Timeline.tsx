'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export interface TimelineProps {
  data: Record<string, unknown>;
}

export default function Timeline({ data }: TimelineProps) {
  const { anchor_id, eyebrow, title, subtitle, events } = data as {
    anchor_id?: string;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    events?: Array<{
      date: string;
      title: string;
      description: string;
      tag: string | null;
      tag_color?: string;
      link?: { text: string; href: string; external: boolean };
      milestones_in_period?: string[];
    }>;
  };

  const eventsArray = events ?? [];
  const ref = useScrollReveal<HTMLDivElement>();

  const badgeVariant = (tagColor?: string) => {
    switch (tagColor) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const dotClass = (tagColor?: string) =>
    tagColor === 'primary' ? 'bg-primary-500' : 'bg-neutral-400';

  return (
    <section id={anchor_id as string} className="bg-neutral-50 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow={eyebrow}
          title={title ?? ''}
          subtitle={subtitle}
          align="center"
        />

        <div ref={ref} className="scroll-reveal relative mt-16 max-w-3xl mx-auto">
          {eventsArray.map((event) => (
            <div key={`${event.date}-${event.title}`} className="relative pl-10 pb-12 border-l-2 border-neutral-200">
              <span
                className={`absolute left-[-5px] top-1 w-3 h-3 rounded-full ${dotClass(event.tag_color)}`}
              />

              <p className="font-body text-body-sm text-neutral-text-muted mb-1">
                {event.date}
              </p>
              <h3 className="font-heading font-semibold text-heading-sm text-neutral-text-primary">
                {event.title}
              </h3>
              {event.tag !== null && event.tag !== undefined && (
                <div className="mt-3">
                  <Badge variant={badgeVariant(event.tag_color)}>{event.tag}</Badge>
                </div>
              )}
              <p className="font-body text-body-md text-neutral-text-secondary mt-2 leading-relaxed">
                {event.description}
              </p>
              {event.milestones_in_period && event.milestones_in_period.length > 0 && (
                <ul className="mt-3 space-y-1 list-disc list-inside">
                  {event.milestones_in_period.map((milestone) => (
                    <li
                      key={milestone}
                      className="font-body text-body-sm text-neutral-text-secondary"
                    >
                      {milestone}
                    </li>
                  ))}
                </ul>
              )}
              {event.link && (
                <Link
                  href={event.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-body-sm text-primary-500 hover:text-primary-700 transition-colors mt-2 inline-block"
                >
                  {event.link.text} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
