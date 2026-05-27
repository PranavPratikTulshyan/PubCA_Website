# Frontend-EUADF v1.0
## Efficient Universally Applicable Development Framework — Frontend Edition

**Author:** Pranav PT + Claude (Tech Lead)
**Version:** 1.0
**Date:** 2026-05-27
**Project Origin:** pranavpt.com (Next.js Personal Brand Website)

---

## What Is Frontend-EUADF?

Frontend-EUADF is a framework for building production-quality frontend websites using a **JSON-first, AI-assisted, human-reviewed** development pipeline.

The core idea: **separate what the site says and looks like (JSON) from how it is built (code).** Once the JSON specification is complete enough, any developer — human or AI — can build the site without asking a single question. A Tech Lead AI writes precise prompts. A Developer AI writes the code. A human PM reviews and approves. Everything is traceable, reviewable, and repeatable.

This is not just a workflow. It is a discipline. The quality of the output is directly proportional to the quality of the JSON specification written before a single line of code is touched.

---

## The Problem This Solves

Traditional frontend projects fail in predictable ways:

| Problem | Why It Happens |
|---|---|
| Developer asks the same questions across sessions | No persistent specification |
| Colors and spacing differ across pages | Design decisions not centralized |
| Content changes require touching component code | Copy hardcoded inside components |
| AI-generated code is inconsistent across prompts | No shared context between sessions |
| Reviews catch different things each time | No structured verification checklist |
| New team member takes weeks to onboard | No self-explaining documentation |

Frontend-EUADF solves all of these with one principle: **the `/config` folder is the single source of truth for everything.** Color, copy, layout, navigation, page structure — all defined in JSON before code exists. Code is an implementation of the spec, not the spec itself.

---

## Core Principles

1. **JSON before code.** No component is written before its section spec exists in a page JSON file.
2. **No hardcoded values anywhere.** Color, text, spacing, and navigation all come from JSON files consumed at build time.
3. **Self-explaining keys.** Every JSON key and value must be understandable by a developer who has never seen the project before.
4. **AI agents are developers, not architects.** The Tech Lead (Claude) makes decisions. The Developer Agent (Gemini) implements them. Roles never swap.
5. **Human in the loop at every checkpoint.** No code is committed without a human PM reviewing it. No phase begins without the previous phase gate passing.
6. **Skills encode institutional knowledge.** Every lesson learned, every mistake made, every rule established lives in a Skill file — not in someone's memory.

---

## The Three Layers

Frontend-EUADF operates in three layers. Each layer must be complete before the next begins.

```
┌─────────────────────────────────────────────┐
│  LAYER 3 — AI AGENT SKILLS                  │
│  skill-010, skill-011, ai-context.json      │
│  Skills that govern how agents write code   │
├─────────────────────────────────────────────┤
│  LAYER 2 — CONTENT & PAGE SPEC              │
│  config/pages/*.json                        │
│  What every page says and how it's sectioned│
├─────────────────────────────────────────────┤
│  LAYER 1 — DESIGN SYSTEM                   │
│  config/design-tokens.json + components.json│
│  Every color, font, spacing, component style│
└─────────────────────────────────────────────┘
```

**Layer 1** answers: *What does it look like?*
**Layer 2** answers: *What does it say and how is it structured?*
**Layer 3** answers: *How should an AI agent write the code?*

Only when all three layers are complete does the actual coding begin.

---

## Step-by-Step: How We Built This

### Step 1 — Define the Brand Identity

Before any JSON, we read and understood the brand:
- Who is this site for?
- What feeling should a visitor have?
- What is the brand personality, tone, and identity?
- What should the site explicitly NOT feel like?

These answers lived in `brand_base_data.json` — a pre-existing brand strategy document. We read it, understood it, and let it inform every design decision that followed.

**Key output:** A clear, written understanding of the brand identity that cannot be misinterpreted.

---

### Step 2 — Design System JSON (Layer 1)

We built the design system as pure JSON before writing any Tailwind config or CSS. This forced every design decision to be explicit and named.

**Files created:**
- `config/design-tokens.json` — every color (primary, secondary, neutral, semantic), typography (font families, weights, sizes, line heights), spacing scale, border radius, shadows, transitions, and z-index
- `config/layout.json` — container max-widths, grid columns, breakpoints, section padding
- `config/components.json` — navbar, footer, button styles (primary/secondary/ghost), card styles, badge, section header, form inputs, icon sizing conventions
- `config/animation.json` — scroll-reveal rules, hover animation specs, illustration style guidelines, what to avoid
- `config/rules.json` — accessibility requirements, Core Web Vitals targets, SEO defaults, developer rules

**The discipline:** No token was added without a name. No value was left as an unlabeled hex code. Every decision was documented.

---

### Step 3 — Tech Stack Decision (also in JSON)

We did not assume the tech stack. We listed options and made a final decision — recorded in `config/meta.json`:

- **Framework:** Next.js 14 (App Router) — chosen for SSG, image optimization, and Vercel integration
- **Styling:** TailwindCSS — maps directly to design tokens
- **Icons:** Heroicons v2 — lightweight, aligns with calm professional aesthetic
- **Fonts:** Google Fonts via CDN — Manrope (headings), Inter (body)
- **Deployment:** Vercel

The `meta.json` also records what was *not* chosen and why — so future agents and developers never re-open these decisions.

---

### Step 4 — Page Architecture Decision

We defined the pages *before* speccing their content:

1. Home (`/`)
2. About (`/about`)
3. Resources (`/resources`)
4. Learnings (`/learnings`)
5. My Builts (`/my-builts`)
6. Talk to Me (`/talk-to-me`)

We also explicitly deleted 4 pages that were initially proposed but didn't serve the brand identity (AI, Apps, Automation, Explore — too platform-like for a personal brand).

**The lesson:** Fewer, focused pages that serve a clear purpose beats more pages that dilute the message.

---

### Step 5 — Page JSON Files (Layer 2)

Each page was specced as a JSON file with a consistent structure:

```json
{
  "_page_meta": {
    "route": "/about",
    "nextjs_file": "app/about/page.tsx",
    "title": "Page title for SEO",
    "description": "Meta description",
    "og_image": "/og/about.png",
    "rendering_strategy": "SSG"
  },
  "sections": [
    {
      "id": "hero",
      "component": "PageHero",
      "_dev_note": "Guidance for the developer on how to render this",
      "badge": "...",
      "headline": "...",
      "subheadline": "..."
    }
  ]
}
```

**Key disciplines enforced:**
- Every section has a `component` field — a PascalCase name that maps 1:1 to a React component file
- Every section has an `id` — used as the React key and for anchor links
- `_dev_note` fields guide the developer on complex rendering decisions without polluting the content
- `_content_todo` fields mark placeholders that need real content before launch

---

### Step 6 — Self-Sufficiency Review

After writing all JSON files, we did an **independent review** as if we were a developer picking up the project cold.

**Gaps found and fixed:**
- Z-index scale was missing (navbar sticky had no z-value spec)
- Form input styles were missing (ContactForm had no spec for input/textarea/select)
- Icon sizing conventions were absent
- Detail page layouts for `/resources/[slug]`, `/learnings/[slug]`, `/my-builts/[slug]` were unspecified
- Markdown frontmatter template was missing

**The standard:** A developer must be able to build the entire site using only the `/config` folder, with zero discovery calls.

---

### Step 7 — Developer README

We wrote `README.md` at the project root — a complete guide for any developer who picks up the project:
- Quick start commands
- The JSON-driven render pattern (with code example)
- Full folder structure
- Component registry table
- TailwindCSS setup
- Dynamic routes
- Contact form API
- Payment flow notes
- SEO wiring
- Content update workflows
- All placeholder locations

---

### Step 8 — AI Agent Skills (Layer 3)

We created two project-specific skill files following the EUADF skill format:

**`skill-010-nextjs-component-standards.md`**
Covers: Server vs Client component rules, TypeScript prop typing, Tailwind class conventions, image handling, external links, scroll-reveal animation pattern, placeholder value handling, acceptance test checklist.

**`skill-011-json-config-consumption.md`**
Covers: Which config file to read for which purpose, exact Tailwind config wiring code, navbar/footer implementation from JSON, SEO metadata wiring, section render loop pattern, dynamic route `generateStaticParams`, markdown rendering for resource articles.

These skills exist so Gemini never has to guess about project conventions. Every decision is pre-answered.

---

### Step 9 — AI Context File

We created `aiagents/ai-context.json` — the master context reference that every AI agent reads before touching the project.

It contains:
- Project identity (what this site is and is NOT)
- Tech stack with exact versions and what was rejected
- Complete folder structure
- Design system summary
- Component registry (the only valid `component` values)
- Naming conventions
- Config consumption rules
- SEO pattern
- Rendering rules
- External link requirements
- Placeholder value handling instructions
- Contact form API spec
- What was already decided (dark mode, photography, CMS, framework, etc.)
- Current build status
- Phase sequence (the order components must be built)

This file solves the **context drift problem** — when Gemini starts a new session with no memory of previous decisions, reading this file restores ~95% of necessary context.

---

## The Config Folder Structure

```
config/
├── _dev_guide.json        ← Architecture overview, component registry, update workflows
├── meta.json              ← Brand, final tech stack decisions, all page routes, v1 scope
├── design-tokens.json     ← Colors, typography, spacing, radius, shadows, transitions, z-index
├── layout.json            ← Container widths, grid columns, breakpoints, section padding
├── components.json        ← Navbar, footer, buttons, cards, badge, form inputs, icons
├── animation.json         ← Scroll/hover rules, illustration style guidelines
├── rules.json             ← Accessibility, performance, SEO, developer rules, file map
└── pages/
    ├── home.json          ← 4 sections: HeroFullscreen, AboutTeaser, JourneyTeaser, CTABanner
    ├── about.json         ← 3 sections: PageHero, ProfileBlock, Timeline (13 events)
    ├── resources.json     ← ResourcesGrid + detail page layout + MD frontmatter spec
    ├── learnings.json     ← CourseGrid + full 8-day syllabus + detail page layout
    ├── my-builts.json     ← ToolsGrid + 6 tools with features + detail page layout
    └── talk-to-me.json    ← SocialLinksBlock (4 platforms) + ContactForm (4 fields)
```

---

## The AI Team Structure

Frontend-EUADF uses three roles. Role clarity is non-negotiable — mixing them causes quality failures.

```
┌──────────────────────┐
│   PRODUCT MANAGER    │  ← Human (Pranav)
│   Pranav PT          │  Approves direction, reviews output,
│                      │  provides real content, gives feedback
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   TECH LEAD AI       │  ← Claude
│   Claude             │  Reviews specs, identifies gaps,
│                      │  writes precise prompts for Gemini,
│                      │  reviews Gemini's output, approves commits
└──────────┬───────────┘
           │  (Phase prompt)
           ▼
┌──────────────────────┐
│   DEVELOPER AGENT    │  ← Gemini
│   Gemini             │  Implements components and pages
│                      │  based on prompts from Claude.
│                      │  Does NOT make architectural decisions.
└──────────────────────┘
```

**The PM** never writes code. The PM provides content, approves direction, and is the final human gate before any commit.

**The Tech Lead** never writes implementation code. Claude makes decisions, reviews output, writes prompts, and approves or rejects Gemini's work.

**The Developer Agent** never makes architectural decisions. Gemini reads the prompt, reads the skills, reads ai-context.json, and implements exactly what is specified.

---

## The Build Workflow

### Pre-Build Phase (Done Once)
```
1. Define brand identity         → brand_base_data.json
2. Build design system JSON      → config/design-tokens.json, layout.json
3. Define tech stack             → config/meta.json
4. Spec all pages               → config/pages/*.json
5. Self-sufficiency review      → fix all gaps
6. Write README                  → README.md
7. Write AI skills              → aiagents/skills/skill-010, skill-011
8. Write AI context             → aiagents/ai-context.json
9. Python generator runs        → scaffolds Next.js project
10. Claude reviews scaffold     → gate: npm run dev must start cleanly
```

### Build Phase (Per Component/Page)

```
STEP 1 — Claude writes phase prompt
  ├── References ai-context.json
  ├── References required skills (SKILL-010, SKILL-011)
  ├── States exactly which file to create
  ├── States which existing files must be imported
  ├── States what NOT to do (from prior session lessons)
  └── States the acceptance test

STEP 2 — PM gives prompt to Gemini
  └── Gemini reads context → reads skills → implements → submits

STEP 3 — PM brings Gemini's output to Claude
  └── Claude reviews using SKILL-007 (Developer Output Verification):
      ├── Does it match the JSON spec?
      ├── Are all values from config files (no hardcoding)?
      ├── Are TypeScript types correct?
      ├── Are external links correct?
      ├── Are PLACEHOLDER values handled gracefully?
      └── Does npm run build pass with zero errors?

STEP 4 — Gate decision
  ├── PASS → Claude approves → PM commits → move to next component
  └── FAIL → Claude writes fix prompt → back to Step 2
```

### Post-Build Phase
```
1. All pages built and rendering
2. SEO meta verified on all pages
3. Accessibility audit (contrast, focus rings, touch targets)
4. Performance check (Core Web Vitals, image optimization)
5. All PLACEHOLDER values replaced with real content
6. npm run build — zero errors, zero warnings
7. Deploy to Vercel
```

---

## The Phase Sequence

Components must be built in this order. Each phase has a gate that must pass before the next begins.

| Phase | What Gets Built | Gate |
|---|---|---|
| 1 | Project scaffold (package.json, next.config.ts, tailwind.config.ts, tsconfig.json) | `npm run dev` starts without errors |
| 2 | UI primitives — Button, Card, Badge, SectionHeader, Divider | Each renders correctly in isolation |
| 3 | Navbar + Footer from components.json | Every nav link works. Footer renders. |
| 4 | Home page — all 4 sections | Full home page visible on localhost |
| 5 | About page — ProfileBlock + Timeline | Timeline anchor `/about#journey` works |
| 6 | Resources page + /resources/[slug] | MD file renders with prose styling |
| 7 | Learnings page + /learnings/[slug] | Course detail with syllabus accordion renders |
| 8 | My Builts page + /my-builts/[slug] | Tool detail with features list renders |
| 9 | Talk to Me + /api/contact | Form submits and sends email |
| 10 | Final review — SEO, a11y, performance | `npm run build` zero errors. Vercel deploy succeeds. |

---

## What Makes a Good Phase Prompt

A phase prompt that Gemini can execute without clarification contains:

```markdown
## Phase N — [Component Name]

### Read First
- aiagents/ai-context.json (full read required)
- SKILL-010 (Next.js Component Standards)
- SKILL-011 (JSON Config Consumption)

### Context — What Already Exists
[List every file already created, with their key exports]

### What To Build
File: components/sections/[ComponentName].tsx
Props type: [exact TypeScript type derived from the JSON section shape]
Behavior: [exact description from _dev_guide.json component registry]

### Design Spec
[Paste the relevant section from the page JSON]
[Paste the relevant token values from design-tokens.json]

### What NOT To Do
- Do not use any Tailwind default color names
- Do not add 'use client' unless the component needs state/effects
- Do not hardcode any text — all copy comes from props
- [Add lessons from previous phase if any]

### Acceptance Test
1. npm run build passes with zero TypeScript errors
2. Component renders on localhost without console errors
3. All prop values come from the section JSON object
4. No hardcoded colors, text, or spacing
```

---

## Things to Take Care Of

### JSON Quality Rules
- Every key must be readable without explanation — `text_primary` not `tp`
- Every value must be precise — `"16px"` not `"medium"`
- `_dev_note` for developer guidance, `_content_todo` for missing real content, `_note` for general notes
- PLACEHOLDER values are intentional — they signal "real value needed before launch"
- `_page_meta` must exist on every page JSON with `title`, `description`, `og_image`, `rendering_strategy`

### Agent Quality Rules
- The Tech Lead (Claude) never skips the review step even when Gemini's output looks correct
- The Developer Agent (Gemini) must state: "I have verified against ai-context.json — no discrepancies found"
- If Gemini makes an architectural decision not covered by the spec, the Tech Lead rejects the output and adds the missing spec to the JSON before re-delegating
- No commit happens without `npm run build` passing

### Workflow Rules
- One component = one phase = one Gemini session
- Never ask Gemini to build more than 3-5 files in one prompt
- Always bring the previous phase's output to Claude before starting the next phase
- Keep git commits small and named by phase

### Content Rules
- Real URLs go into the JSON; PLACEHOLDER values stay until real values exist
- Hobbies, pricing, social links — all marked clearly as `_content_todo` or `PLACEHOLDER_`
- A `grep -r "PLACEHOLDER" config/` before launch finds every unfilled value

---

## How to Apply This to a New Project

Frontend-EUADF is not tied to this specific project. It is a methodology. To apply it to any new frontend project:

**Step 1 — Understand the brand**
Read every brief, brand document, or conversation that describes what the site is for and who it serves. Write a one-paragraph identity statement before touching JSON.

**Step 2 — Build Layer 1 (Design System)**
Create `design-tokens.json` with every visual decision. Create `components.json` with every reusable component's spec. Create `layout.json` and `animation.json`. No vague values — every entry must be implementable.

**Step 3 — Define pages and sections**
List every page. For each page, list every section. For each section, name the React component that will render it. This forces visual thinking before code thinking.

**Step 4 — Write page JSONs**
Fill in every section's content. Write copy, define CTAs, specify layouts. A page JSON is complete when a developer can read it and build the page without asking a single question.

**Step 5 — Self-review**
Read every JSON file as if you are a developer seeing it for the first time. Find every gap. Fill it.

**Step 6 — Write the README and _dev_guide.json**
If you cannot explain the project in a README, the spec is not complete.

**Step 7 — Create the AI skills**
Write at least two project-specific skills: one for component standards, one for config consumption. Add the project's specific rules — naming conventions, forbidden patterns, required patterns.

**Step 8 — Create ai-context.json**
This file is the anchor. It must contain: project identity, tech stack, folder structure, component registry, naming conventions, what was already decided, current build status, phase sequence.

**Step 9 — Run the Python scaffold generator**
The generator creates the project shell. Claude reviews it before Gemini touches anything.

**Step 10 — Begin the phase-by-phase build**
One component at a time. One Gemini session at a time. One Claude review at a time.

---

## Why This Is Different

| Traditional Approach | Frontend-EUADF |
|---|---|
| Developer makes design decisions | Design decisions pre-made in JSON |
| AI generates inconsistent code | Skills + ai-context.json enforce consistency |
| Content changes require code changes | Content lives in JSON — no code touch needed |
| No audit trail for decisions | Every decision is recorded in meta.json and skills |
| New developer needs days to onboard | README + ai-context.json = full context in one read |
| AI session context lost between conversations | ai-context.json restores context on every new session |
| Review is informal and inconsistent | SKILL-007 defines a six-step verification sequence |
| "Build the whole site" prompt fails | Phase decomposition limits blast radius of any single failure |

---

## Checklist for Framework Compliance

Use this before declaring any phase complete:

- [ ] All content in this phase reads from JSON config — nothing hardcoded
- [ ] All colors use Tailwind aliases mapped to design-tokens.json — no default Tailwind color names
- [ ] All external links have `target="_blank"` and `rel="noopener noreferrer"`
- [ ] `'use client'` only added where state or browser events are needed
- [ ] All props are TypeScript-typed — no `any`
- [ ] Images use `next/image` — no `<img>` tags
- [ ] PLACEHOLDER values render gracefully — build does not break
- [ ] SEO metadata wired from `_page_meta` in page JSON
- [ ] `generateStaticParams()` defined for all dynamic routes
- [ ] `npm run build` passes with zero errors and zero TypeScript warnings
- [ ] Component added to `sectionComponents` index in `components/sections/index.ts`
- [ ] Git commit is scoped to one phase only

---

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-05-27 | Initial framework documentation. Derived from pranavpt.com build. |

---

*Frontend-EUADF was created during the development of pranavpt.com. It is a living framework — future versions will incorporate lessons from subsequent projects.*
