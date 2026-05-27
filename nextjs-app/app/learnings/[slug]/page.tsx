import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import learningsData from '@/config/pages/learnings.json';
import CourseDetail from '@/components/sections/CourseDetail';

export async function generateStaticParams() {
  return learningsData.courses.map((c: { slug: string }) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = learningsData.courses.find((c: { slug: string }) => c.slug === params.slug);
  if (!course) return {};
  return { title: course.title + ' — Pranav PT', description: course.description };
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = learningsData.courses.find((c: { slug: string }) => c.slug === params.slug);
  if (!course) notFound();
  return <CourseDetail data={course} />;
}
