import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: "About Pranav PT \u2014 The Non-Coder Who Taught Himself to Build",
  description: "From a Chartered Accountant to a Finance Technologist \u2014 Pranav's journey of self-teaching Python, building 20+ tools, and proving that coding is a learnable skill.",
};

import sectionsData from '@/config/pages/about.json';
import * as SectionComponents from '@/components/sections';

type SectionKey = keyof typeof SectionComponents;

export default function About_Page() {
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
