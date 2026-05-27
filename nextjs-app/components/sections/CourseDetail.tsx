import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface CourseDetailProps {
  data: Record<string, unknown>;
}

type SyllabusDay = {
  day: number | string;
  title: string;
  description?: string;
  topics: string[];
  tags: string[];
  sample_projects?: Array<{ title: string; description: string }>;
};

export default function CourseDetail({ data }: CourseDetailProps) {
  const {
    title,
    tagline,
    badge,
    level,
    duration,
    schedule,
    description,
    what_you_learn,
    outcomes,
    syllabus,
    pricing,
    cta,
    contact_cta,
  } = data as {
    title: string;
    tagline: string;
    badge: string;
    level: string;
    duration: string;
    schedule: { type: string; format: string };
    description: string;
    what_you_learn: string[];
    outcomes: string[];
    syllabus: SyllabusDay[];
    pricing: { amount: string; currency: string };
    cta: { text: string; variant: string };
    contact_cta: { text: string; href: string };
  };

  const isComingSoon = pricing.amount === 'PLACEHOLDER_PRICE';

  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <Link
            href="/learnings"
            className="font-body text-body-sm text-primary-500 hover:text-primary-700 transition-colors"
          >
            ← All Learnings
          </Link>
          <div className="mt-6">
            <Badge>{badge}</Badge>
          </div>
          <h1 className="font-heading font-extrabold text-display-md md:text-display-lg text-neutral-text-primary mt-4 leading-tight">
            {title}
          </h1>
          <p className="font-body text-body-lg text-neutral-text-secondary mt-3 leading-relaxed">
            {tagline}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-4 font-body text-body-sm text-neutral-text-muted">
            <span>{level}</span>
            <span aria-hidden="true">·</span>
            <span>{duration}</span>
            <span aria-hidden="true">·</span>
            <span>{schedule.type}</span>
            <span aria-hidden="true">·</span>
            <span>{schedule.format}</span>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <p className="font-body text-body-lg text-neutral-text-secondary leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>
      </section>

      {/* What You Learn */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2 className="font-heading font-bold text-heading-xl text-neutral-text-primary">
            What You'll Learn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {what_you_learn.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                <span className="font-body text-body-md text-neutral-text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Syllabus */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2 className="font-heading font-bold text-heading-xl text-neutral-text-primary">
            Day-by-Day Syllabus
          </h2>
          <div className="flex flex-col gap-4 mt-8 max-w-3xl">
            {syllabus.map((dayItem) => (
              <Card key={String(dayItem.day)} className="p-6">
                <p className="font-body text-body-sm text-primary-500 font-semibold">
                  Day {dayItem.day}
                </p>
                <h3 className="font-heading font-semibold text-heading-sm text-neutral-text-primary mt-1">
                  {dayItem.title}
                </h3>
                {dayItem.description && (
                  <p className="font-body text-body-md text-neutral-text-secondary mt-2 leading-relaxed">
                    {dayItem.description}
                  </p>
                )}
                <ul className="mt-3 space-y-1">
                  {dayItem.topics.map((topic) => (
                    <li
                      key={topic}
                      className="font-body text-body-sm text-neutral-text-secondary flex items-start gap-2"
                    >
                      <span className="text-primary-500 mt-0.5 flex-shrink-0">→</span>
                      {topic}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-4">
                  {dayItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-body text-caption bg-neutral-100 text-neutral-text-secondary px-2 py-1 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {dayItem.sample_projects && dayItem.sample_projects.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {dayItem.sample_projects.map((project) => (
                      <div key={project.title} className="bg-neutral-50 rounded-lg p-3">
                        <p className="font-heading font-semibold text-body-sm text-neutral-text-primary">
                          {project.title}
                        </p>
                        <p className="font-body text-body-sm text-neutral-text-secondary mt-1">
                          {project.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-neutral-50 py-12">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2 className="font-heading font-bold text-heading-xl text-neutral-text-primary">
            What You'll Walk Away With
          </h2>
          <div className="flex flex-wrap gap-3 mt-6">
            {outcomes.map((outcome) => (
              <Badge key={outcome} variant="primary">{outcome}</Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing + CTA */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          {isComingSoon ? (
            <p className="font-body text-body-lg text-neutral-text-muted">Price: Coming Soon</p>
          ) : (
            <p className="font-heading font-extrabold text-display-md text-neutral-text-primary">
              {pricing.currency} {pricing.amount}
            </p>
          )}
          <div className="mt-8">
            <Button href="/talk-to-me" variant="primary" size="lg">
              {cta.text}
            </Button>
          </div>
          <Link
            href={contact_cta.href}
            className="font-body text-body-md text-primary-500 hover:text-primary-700 transition-colors mt-6 inline-block"
          >
            {contact_cta.text}
          </Link>
        </div>
      </section>

      {/* Mobile sticky CTA — CSS only, no JS */}
      <div className="fixed bottom-0 left-0 right-0 z-sticky bg-white border-t border-neutral-border px-6 py-4 md:hidden">
        <Button href="/talk-to-me" variant="primary" size="lg" className="w-full">
          {cta.text}
        </Button>
      </div>
    </main>
  );
}
