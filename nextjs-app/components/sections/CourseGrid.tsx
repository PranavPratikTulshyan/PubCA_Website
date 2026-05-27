import Link from 'next/link';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export type CourseGridProps = {
  data: Record<string, unknown>;
};

type Course = {
  slug: string;
  status: string;
  thumbnail: { src: string; alt: string };
  title: string;
  tagline: string;
  badge: string;
  level: string;
  duration: string;
  description: string;
  pricing: { amount: string; currency: string };
  cta: { text: string; variant: string; action: string };
};

export default function CourseGrid({ data }: CourseGridProps) {
  const { courses } = data as {
    courses: Course[];
  };

  return (
    <section className="bg-neutral-50 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 md:px-8">
        {courses.map((course) => {
          const isComingSoon = course.pricing.amount === 'PLACEHOLDER_PRICE';

          return (
            <Link key={course.slug} href={`/learnings/${course.slug}`}>
              <Card className="overflow-hidden hover:shadow-card-hover transition-shadow cursor-pointer">
                <div className="bg-primary-100 w-full aspect-video flex items-center justify-center">
                  <span className="font-body text-body-sm text-primary-700 font-semibold px-4 text-center">
                    {course.thumbnail.alt}
                  </span>
                </div>

                <div className="p-6">
                  <Badge>{course.badge}</Badge>

                  <h3 className="font-heading font-bold text-heading-md text-neutral-text-primary mt-3">
                    {course.title}
                  </h3>

                  <p className="font-body text-body-md text-neutral-text-secondary mt-2">
                    {course.tagline}
                  </p>

                  <div className="font-body text-body-sm text-neutral-text-muted mt-3 flex items-center gap-3">
                    <span>{course.level}</span>
                    <span aria-hidden="true">·</span>
                    <span>{course.duration}</span>
                  </div>

                  <div className="mt-4">
                    {isComingSoon ? (
                      <p className="font-body text-body-sm text-neutral-text-muted">Coming Soon</p>
                    ) : (
                      <p className="font-heading font-semibold text-heading-sm text-neutral-text-primary">
                        {course.pricing.currency} {course.pricing.amount}
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <span className="font-body text-body-sm text-primary-500 font-medium">
                      View Details →
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
