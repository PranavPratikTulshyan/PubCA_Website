import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: "Talk to Me \u2014 Pranav PT",
  description: "Find Pranav PT on YouTube, LinkedIn, Instagram, and Discord. Or drop a message directly.",
};

import sectionsData from '@/config/pages/talk-to-me.json';
import * as SectionComponents from '@/components/sections';

type SectionKey = keyof typeof SectionComponents;

export default function TalkToMe_Page() {
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
