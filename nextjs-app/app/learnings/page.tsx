import type { Metadata } from 'next';
import learningsData from '@/config/pages/learnings.json';
import PageHero from '@/components/sections/PageHero';
import CourseGrid from '@/components/sections/CourseGrid';

export const metadata: Metadata = {
  title: "Learnings \u2014 Pranav PT",
  description: "Structured batches and courses on Python, Automation, and AI for Finance professionals. Learn by doing \u2014 with real projects.",
};

export default function LearningsPage() {
  return (
    <>
      <PageHero data={learningsData.page_hero} />
      <CourseGrid data={{ courses: learningsData.courses }} />
    </>
  );
}
