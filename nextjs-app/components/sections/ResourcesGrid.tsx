'use client';

import { useState } from 'react';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Link from 'next/link';

interface ResourcesGridProps {
  data: Record<string, unknown>;
}

export default function ResourcesGrid({ data }: ResourcesGridProps) {
  const { filter_tabs, categories } = data as {
    filter_tabs?: string[];
    categories?: Array<{
      name: string;
      items: Array<{
        slug: string;
        title: string;
        description: string;
        category: string;
        read_time: string;
        published: boolean;
      }>;
    }>;
  };

  const tabs = filter_tabs ?? [];
  const allCategories = categories ?? [];
  const [activeTab, setActiveTab] = useState<string>('All');

  const allItems = allCategories.flatMap((cat) => cat.items);
  const filteredItems =
    activeTab === 'All' ? allItems : allItems.filter((item) => item.category === activeTab);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex gap-2 flex-wrap mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-text-secondary hover:bg-neutral-200'
              } font-body text-body-sm font-semibold px-4 py-2 rounded-full transition-colors`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Link key={item.slug} href={`/resources/${item.slug}`}>
              <Card className="p-6 h-full flex flex-col gap-4 hover:shadow-card-hover transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <Badge variant="default">{item.category}</Badge>
                  <span className="font-body text-body-sm text-neutral-text-muted">
                    {item.read_time}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-heading-sm text-neutral-text-primary leading-snug">
                  {item.title}
                </h3>
                <p className="font-body text-body-md text-neutral-text-secondary leading-relaxed flex-1">
                  {item.description}
                </p>
                <span className="font-body text-body-sm text-primary-500 font-medium mt-auto">
                  Read article →
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
