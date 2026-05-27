import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

type Tool = {
  slug: string;
  thumbnail: { src: string; alt: string };
  title: string;
  tagline: string;
  tags: string[];
  pricing: { amount: string; currency: string };
  cta: { text: string };
};

interface ToolsGridProps {
  data: Record<string, unknown>;
}

export default function ToolsGrid({ data }: ToolsGridProps) {
  const { tools } = data as { tools: Tool[] };

  return (
    <section className="bg-neutral-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => {
            const isComingSoon = tool.pricing.amount === 'PLACEHOLDER_PRICE';

            return (
              <Link key={tool.slug} href={`/my-builts/${tool.slug}`}>
                <Card className="overflow-hidden hover:shadow-card-hover transition-shadow cursor-pointer h-full flex flex-col">
                  <div className="bg-primary-100 w-full aspect-video flex items-center justify-center px-4">
                    <span className="font-body text-body-sm text-primary-700 text-center">
                      {tool.thumbnail.alt}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map((tag) => (
                        <Badge key={tag} variant="default">{tag}</Badge>
                      ))}
                    </div>
                    <h3 className="font-heading font-bold text-heading-md text-neutral-text-primary">
                      {tool.title}
                    </h3>
                    <p className="font-body text-body-md text-neutral-text-secondary leading-relaxed flex-1">
                      {tool.tagline}
                    </p>
                    <div className="mt-auto pt-4 border-t border-neutral-border flex flex-col gap-2">
                      {isComingSoon ? (
                        <span className="font-body text-body-sm text-neutral-text-muted">Coming Soon</span>
                      ) : (
                        <span className="font-heading font-semibold text-heading-sm text-neutral-text-primary">{tool.pricing.currency} {tool.pricing.amount}</span>
                      )}
                      <span className="font-body text-body-sm text-primary-500 font-medium">View Details →</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
