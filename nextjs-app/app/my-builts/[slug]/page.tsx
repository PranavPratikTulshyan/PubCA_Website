import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import myBuiltsData from '@/config/pages/my-builts.json';
import ToolDetail from '@/components/sections/ToolDetail';

export async function generateStaticParams() {
  return myBuiltsData.tools.map((t: { slug: string }) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tool = myBuiltsData.tools.find((t: { slug: string }) => t.slug === params.slug);
  if (!tool) return {};
  return { title: tool.title + ' — Pranav PT', description: tool.tagline };
}

export default function ToolDetailPage({ params }: { params: { slug: string } }) {
  const tool = myBuiltsData.tools.find((t: { slug: string }) => t.slug === params.slug);
  if (!tool) notFound();
  return <ToolDetail data={tool} />;
}
