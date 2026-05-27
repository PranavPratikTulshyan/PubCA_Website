// ============================================================
// UI PRIMITIVE SHELL — implement this component.
// Config source: components.json → footer
// Read: aiagents/ai-context.json + aiagents/skills/skill-010-nextjs-component-standards.md
// ============================================================

interface FooterProps {
  [key: string]: unknown;
}

export default function Footer(_props: FooterProps) {
  return (
    <div className="flex items-center justify-center min-h-[48px] border border-dashed border-neutral-300 rounded px-4 py-2 bg-neutral-50">
      <span className="font-body text-xs text-neutral-400">Footer shell</span>
    </div>
  );
}
