import type { Metadata } from 'next';
import myBuiltsData from '@/config/pages/my-builts.json';
import PageHero from '@/components/sections/PageHero';
import ToolsGrid from '@/components/sections/ToolsGrid';

export const metadata: Metadata = {
  title: "My Builts \u2014 Pranav PT",
  description: "Tools and apps built by Pranav PT for Finance professionals \u2014 covering document management, GST automation, Excel workflows, and more.",
};

export default function MyBuiltsPage() {
  return (
    <>
      <PageHero data={myBuiltsData.page_hero} />
      <ToolsGrid data={{ tools: myBuiltsData.tools }} />
    </>
  );
}
