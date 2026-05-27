// ============================================================
// SHELL — implement this component.
// Config source: config/pages/about.json → sections[0]
// Read: aiagents/ai-context.json + aiagents/skills/skill-010-nextjs-component-standards.md
// ============================================================

interface PageHeroProps {
  data: Record<string, unknown>;
}

export default function PageHero({ data }: PageHeroProps) {
  return (
    <div
      id="pagehero-shell"
      className="flex items-center justify-center min-h-[200px] border-2 border-dashed border-primary-500 rounded-lg m-4 p-8 bg-primary-50"
    >
      <div className="text-center">
        <p className="font-heading text-lg text-primary-700 font-semibold">PageHero</p>
        <p className="font-body text-sm text-neutral-500 mt-1">Shell — replace with implementation</p>
      </div>
    </div>
  );
}
