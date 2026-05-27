import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: "Resources \u2014 Pranav PT",
  description: "Curated reads on Python, AI, Automation, and Finance Technology. Articles and guides written to make complex concepts simple.",
};

import sectionsData from '@/config/pages/resources.json';
import * as SectionComponents from '@/components/sections';

type SectionKey = keyof typeof SectionComponents;

export default function Resources_Page() {
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
