import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface ToolDetailProps {
  data: Record<string, unknown>;
}

export default function ToolDetail({ data }: ToolDetailProps) {
  const {
    title,
    tagline,
    tags,
    what_it_solves,
    features,
    built_with,
    suitable_for,
    pricing,
    cta,
    contact_cta,
  } = data as {
    title: string;
    tagline: string;
    tags: string[];
    what_it_solves: string;
    features: string[];
    built_with: string[];
    suitable_for: string[];
    pricing: { amount: string; currency: string };
    cta: { text: string; variant: string };
    contact_cta: { text: string; href: string };
  };

  const isComingSoon = pricing.amount === 'PLACEHOLDER_PRICE';

  return (
    <main>
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <Link href="/my-builts" className="font-body text-body-sm text-primary-500 hover:text-primary-700 transition-colors">← All Builts</Link>
          <div className="flex flex-wrap gap-2 mt-6">
            {tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
          </div>
          <h1 className="font-heading font-extrabold text-display-md md:text-display-lg text-neutral-text-primary mt-4 leading-tight">
            {title}
          </h1>
          <p className="font-body text-body-lg text-neutral-text-secondary mt-3 leading-relaxed">
            {tagline}
          </p>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2 className="font-heading font-bold text-heading-xl text-neutral-text-primary mb-6">What It Solves</h2>
          <p className="font-body text-body-lg text-neutral-text-secondary leading-relaxed max-w-3xl">
            {what_it_solves}
          </p>
        </div>
      </section>

      <section className="bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2 className="font-heading font-bold text-heading-xl text-neutral-text-primary mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                <span className="font-body text-body-md text-neutral-text-secondary">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="max-w-4xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-heading font-semibold text-heading-md text-neutral-text-primary mb-4">Built With</h3>
            <div className="flex flex-wrap gap-2">
              {built_with.map(tech => <Badge key={tech} variant="primary">{tech}</Badge>)}
            </div>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-heading-md text-neutral-text-primary mb-4">Suitable For</h3>
            <div className="flex flex-wrap gap-2">
              {suitable_for.map(s => <Badge key={s} variant="default">{s}</Badge>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-16 text-center">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
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
          <div className="mt-6">
            <Link href={contact_cta.href} className="font-body text-body-md text-primary-500 hover:text-primary-700 transition-colors inline-block">
              {contact_cta.text}
            </Link>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-sticky bg-white border-t border-neutral-border px-6 py-4 md:hidden">
        <Button href="/talk-to-me" variant="primary" size="lg" className="w-full">
          {cta.text}
        </Button>
      </div>
    </main>
  );
}
