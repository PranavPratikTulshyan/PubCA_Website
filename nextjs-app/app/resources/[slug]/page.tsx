import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import resourcesData from '@/config/pages/resources.json';

// Collect all slugs from the config
const allSlugs = resourcesData.sections
  .find((s: { id: string }) => s.id === 'resources_grid')
  ?.categories?.flatMap((c: { items: { slug: string }[] }) => c.items.map((i) => i.slug)) ?? [];

export async function generateStaticParams() {
  return allSlugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const filePath = path.join(process.cwd(), 'content/resources', params.slug + '.md');
  if (!fs.existsSync(filePath)) return {};
  const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
  return { title: data.title, description: data.description };
}

export default function ResourceArticlePage({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), 'content/resources', params.slug + '.md');
  if (!fs.existsSync(filePath)) notFound();

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return (
    <article className="max-w-[720px] mx-auto px-8 py-24">
      <a href="/resources" className="font-body text-sm text-primary-500 hover:underline">
        &larr; All Resources
      </a>
      <div className="mt-6 flex gap-3 items-center">
        <span className="font-body text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full">
          {data.category}
        </span>
        <span className="font-body text-xs text-neutral-text-muted">{data.read_time}</span>
        <span className="font-body text-xs text-neutral-text-muted">{data.published_date}</span>
      </div>
      <div className="prose prose-lg font-body text-neutral-text-primary max-w-none mt-8">
        <MDXRemote source={content} />
      </div>
    </article>
  );
}
