"use client";

// ============================================================
// UI PRIMITIVE SHELL — implement this component.
// Config source: components.json → navbar
// Read: aiagents/ai-context.json + aiagents/skills/skill-010-nextjs-component-standards.md
// ============================================================

interface NavbarProps {
  [key: string]: unknown;
}

export default function Navbar(_props: NavbarProps) {
  return (
    <div className="flex items-center justify-center min-h-[48px] border border-dashed border-neutral-300 rounded px-4 py-2 bg-neutral-50">
      <span className="font-body text-xs text-neutral-400">Navbar shell</span>
    </div>
  );
}
