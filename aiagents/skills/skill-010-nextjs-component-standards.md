---
name: skill-010-nextjs-component-standards
description: >
  Defines the exact standards for writing Next.js 14 (App Router) components
  for the Pranav PT website. Covers Server vs Client component rules, TypeScript
  prop typing, Tailwind class conventions, image handling, external links,
  scroll-reveal animation, and the section component pattern that powers all
  pages. Apply this skill every time a new component or page file is being
  written for this project. Do not use general Next.js knowledge as a substitute
  — this skill overrides defaults where the project has made a specific decision.
license: Proprietary — Efficient Corporates Internal Use Only
metadata:
  skill_id: "SKILL-010"
  euadf_version: "1.0"
  last_validated: "2026-05-27"
  category: Frontend Standards
  deterministic_triggers: |
    Apply this skill if ANY of the following are true:
    - A new .tsx or .ts file is being created for this project
    - A Next.js page file is being created or modified
    - A section component is being built
    - A UI primitive (Button, Card, Badge) is being implemented
    - The developer is unsure whether to use 'use client' or not
---

## Key Principles

### Server vs Client Component Rule
**Default to Server Components.** Add `'use client'` ONLY when the component needs:
- `useState` or `useReducer`
- `useEffect` or `useRef`
- Browser event handlers (`onClick`, `onChange`, `onSubmit`)
- Browser-only APIs (`window`, `localStorage`)

Components that are ALWAYS client:
- `ContactForm` (form state + submit handler)
- Navbar (mobile menu toggle state)
- Any component with hover/scroll animation via JS

Components that are ALWAYS server:
- All page files (`app/*/page.tsx`)
- `HeroFullscreen`, `PageHero`, `CTABanner`, `Timeline`, `ProfileBlock`
- `CourseGrid`, `ToolsGrid`, `ResourcesGrid` (data display only)

---

### TypeScript Props Pattern
Every section component must define and export its Props type:

```tsx
// Good
export type HeroFullscreenProps = {
  id: string
  badge: string
  headline: { line_1: string; line_2: string }
  subheadline: string
  cta_primary: { text: string; href: string; variant: string }
  cta_secondary?: { text: string; href: string; variant: string }
  visual?: { type: string; alt: string; description: string }
}

export default function HeroFullscreen(props: HeroFullscreenProps) { ... }
```

Never use `any`. Never use untyped object spread without a type.
The Props type must match the shape of the JSON section object exactly.

---

### Section Component Pattern
All pages use the same render loop. Section components must be compatible:

```tsx
// components/sections/index.ts
import HeroFullscreen from './HeroFullscreen'
import PageHero from './PageHero'
// ... all components

export const sectionComponents: Record<string, React.ComponentType<any>> = {
  HeroFullscreen,
  PageHero,
  // ... key must match 'component' field in page JSON exactly
}
```

```tsx
// app/page.tsx (example page pattern)
import homeConfig from '@/config/pages/home.json'
import { sectionComponents } from '@/components/sections'

export default function HomePage() {
  return (
    <main>
      {homeConfig.sections.map((section) => {
        const Component = sectionComponents[section.component]
        if (!Component) return null
        return <Component key={section.id} {...section} />
      })}
    </main>
  )
}
```

---

### Tailwind Class Rules

**NEVER use:**
- Default Tailwind colors: `text-blue-600`, `bg-gray-100`, `border-gray-300`
- Arbitrary values when a token exists: `text-[#2F7EBF]` when `text-primary-500` exists
- Inline `style` attribute for values that exist in design-tokens.json

**ALWAYS use:**
- Token-mapped Tailwind classes: `text-primary-500`, `bg-neutral-background`, `shadow-md`
- Spacing scale from design-tokens.json: `p-8` (32px), `p-6` (24px), `p-4` (16px)
- Radius scale: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`

```tsx
// Bad
<div className="bg-blue-600 text-white rounded-[16px] shadow-[0_4px_10px_rgba(0,0,0,0.08)]">

// Good
<div className="bg-primary-500 text-white rounded-xl shadow-md">
```

---

### Tailwind Config — Token Mapping
The tailwind.config.ts must extend with these exact keys:

```ts
import tokens from './config/design-tokens.json'

theme: {
  extend: {
    colors: {
      primary:   tokens.colors.primary,    // primary-50 through primary-900
      secondary: tokens.colors.secondary,  // secondary-50 through secondary-900
      neutral: {
        white:        tokens.colors.neutral.white,
        background:   tokens.colors.neutral.background,
        surface:      tokens.colors.neutral.surface,
        'muted-surface': tokens.colors.neutral.muted_surface,
        border:       tokens.colors.neutral.border,
        'text-primary':   tokens.colors.neutral.text_primary,
        'text-secondary': tokens.colors.neutral.text_secondary,
        'text-muted':     tokens.colors.neutral.text_muted,
      }
    },
    fontFamily: {
      heading: ['Manrope', 'sans-serif'],
      body:    ['Inter', 'sans-serif'],
      code:    ['JetBrains Mono', 'monospace'],
    },
    borderRadius: {
      sm: tokens.radius.sm, md: tokens.radius.md,
      lg: tokens.radius.lg, xl: tokens.radius.xl,
      '2xl': tokens.radius['2xl'], full: tokens.radius.full
    },
    boxShadow: tokens.shadow,
    zIndex: tokens.z_index,
  }
}
```

---

### Image Handling
- Use `next/image` for ALL images. Never `<img>`.
- Always provide `alt` — sourced from the JSON, never empty.
- Use `sizes` prop for responsive images.
- Placeholder strategy for missing thumbnails: a `div` with `bg-primary-100` and the title text centered.

```tsx
// Thumbnail with fallback
{tool.thumbnail.src !== 'PLACEHOLDER' ? (
  <Image src={tool.thumbnail.src} alt={tool.thumbnail.alt} width={800} height={450} />
) : (
  <div className="w-full aspect-video bg-primary-100 flex items-center justify-center rounded-xl">
    <span className="text-primary-600 font-heading font-semibold text-lg">{tool.title}</span>
  </div>
)}
```

---

### External Links
All external links must have both attributes. No exceptions:

```tsx
<a href={link.href} target="_blank" rel="noopener noreferrer">
  {link.text}
</a>
```

---

### Scroll-Reveal Animation
Use Intersection Observer API — no external library:

```tsx
// Custom hook — create once in hooks/useScrollReveal.ts
import { useEffect, useRef } from 'react'

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('revealed') },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}
```

```css
/* In globals.css */
.scroll-reveal { opacity: 0; transform: translateY(24px); transition: opacity 500ms ease, transform 500ms ease; }
.scroll-reveal.revealed { opacity: 1; transform: translateY(0); }
```

This respects `prefers-reduced-motion` — add:
```css
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal { opacity: 1; transform: none; transition: none; }
}
```

---

### Placeholder Value Handling
Config values prefixed with `PLACEHOLDER_` must not break the build:

```tsx
// Pattern for URLs
const isPlaceholder = (href: string) => href.startsWith('PLACEHOLDER')
<a
  href={isPlaceholder(platform.href) ? '#' : platform.href}
  className={isPlaceholder(platform.href) ? 'opacity-50 cursor-not-allowed' : ''}
  target={isPlaceholder(platform.href) ? undefined : '_blank'}
>
```

---

### Acceptance Test for Every Component
A component is complete when:
1. `npm run build` passes with zero TypeScript errors
2. `npm run dev` renders the component without console errors
3. The component matches the design spec in `config/components.json` or the relevant page JSON
4. No hardcoded colors, copy, or spacing values exist in the component
5. All props are typed and match the JSON section shape

## When NOT to Apply

- Writing the Python generator script — that is a Python context, not a Next.js context.
- Writing the ai-context.json or skill files — not component code.
- One-line config changes (updating package.json, next.config.ts).

## Example

Building `Timeline.tsx` for the About page:
- Props type derives from `about.json` sections[2] (the Timeline section) shape
- `'use client'` NOT needed — no interactivity required
- Each timeline event with `link` renders an `<a>` with `target="_blank" rel="noopener noreferrer"`
- Anchor `id="journey"` on the section wrapper so `/about#journey` deep-links work
- PLACEHOLDER Discord link renders with `href="#"` and `opacity-50 cursor-not-allowed`

## Gotchas

- **Adding `'use client'` to every component** — most components are Server Components. Only add when strictly needed.
- **Using Tailwind's default color names** — the project's tokens alias `primary-500`, not `blue-500`. They look similar but are different values.
- **Forgetting `rel="noopener noreferrer"` on external links** — security requirement, not optional.
- **Using `<img>` instead of `next/image`** — triggers a Next.js lint warning and skips optimization.
- **Typing props as `any`** — defeats TypeScript and makes TL code review impossible.
- **Not handling PLACEHOLDER values** — builds break if a missing URL throws a hydration error.
