import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: "Pranav PT \u2014 Bringing Technology Closer to Humans",
  description: "A Finance professional who taught himself Python, built 20+ tools, and grew a community of 6,000+ learners. This is his space to share everything.",
};

import sectionsData from '@/config/pages/home.json';
import * as SectionComponents from '@/components/sections';

type SectionKey = keyof typeof SectionComponents;

export default function Home_Page() {
  return (
    <>
      {sectionsData.sections.map((section: { id: string; component: string; [key: string]: unknown }) => {
        const Component = SectionComponents[section.component as SectionKey];
        if (!Component) return null;
        return <Component key={section.id} data={section} />;
      })}
    </>
  );
}
