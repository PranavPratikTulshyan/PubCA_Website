'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import Badge from '@/components/ui/Badge';

export interface ProfileBlockProps {
  data: Record<string, unknown>;
}

export default function ProfileBlock({ data }: ProfileBlockProps) {
  const {
    name,
    designation,
    identity_tags,
    bio_paragraphs,
    hobbies,
    stats,
    expertise_areas,
  } = data as {
    name?: string;
    designation?: string;
    identity_tags?: string[];
    bio_paragraphs?: string[];
    hobbies?: { section_label?: string; items: string[] };
    stats?: Array<{ value: string; label: string; icon: string }>;
    expertise_areas?: string[];
  };

  const statsArray = stats ?? [];
  const bioParagraphs = bio_paragraphs ?? [];
  const expertiseAreas = expertise_areas ?? [];
  const hobbyItems = hobbies?.items ?? [];
  const hobbiesLabel = hobbies?.section_label ?? '';
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-white py-20 md:py-28">
      <div ref={ref} className="scroll-reveal max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid gap-16 md:grid-cols-2 items-start">
          <div>
            <h2 className="font-heading font-extrabold text-heading-xl md:text-display-md text-neutral-text-primary">
              {name}
            </h2>
            <p className="font-body text-body-md text-neutral-text-secondary mt-2">
              {designation}
            </p>

            {identity_tags && identity_tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {identity_tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            )}

            {bioParagraphs.length > 0 && (
              <div className="mt-8">
                {bioParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="font-body text-body-md text-neutral-text-secondary leading-relaxed mb-4"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {hobbyItems.length > 0 && (
              <div className="mt-8">
                <h3 className="font-heading font-semibold text-heading-sm text-neutral-text-primary mb-4">
                  {hobbiesLabel}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hobbyItems.map((item) => (
                    <Badge key={item} variant="primary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

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

        <div className="mt-16">
          <h3 className="font-heading font-semibold text-heading-md text-neutral-text-primary mb-6">
            Areas of Expertise
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {expertiseAreas.map((area) => (
              <div key={area} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                <span className="font-body text-body-md text-neutral-text-secondary">
                  {area}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
