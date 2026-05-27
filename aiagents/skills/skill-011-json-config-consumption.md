---
name: skill-011-json-config-consumption
description: >
  Defines how a developer agent must consume the /config JSON files on the
  Pranav PT website project. The entire site is driven by JSON config — colors,
  copy, layout, components, navigation, and page content all live in /config.
  No value from these files should ever be hardcoded in a component. This skill
  covers: which file to read for which purpose, the exact Tailwind config wiring,
  SEO metadata wiring, the section render loop pattern, dynamic route slug
  generation, and the markdown rendering pattern for /resources/[slug]. Apply
  every time any component or page is being implemented. Violations of these
  rules produce code that cannot be content-updated without touching component
  files — the opposite of this project's architecture goal.
license: Proprietary — Efficient Corporates Internal Use Only
metadata:
  skill_id: "SKILL-011"
  euadf_version: "1.0"
  last_validated: "2026-05-27"
  category: Frontend Standards
  deterministic_triggers: |
    Apply this skill if ANY of the following are true:
    - A page file is being created and needs content from config/pages/
    - A component needs a color, spacing, font, or shadow value
    - A navigation component is being built
    - A dynamic route ([slug]) is being implemented
    - A developer is about to hardcode any text, color, or URL
---

## Key Principles

### The Config Map — Which File For What

| What you need | Read from |
|---|---|
| Brand name, tagline, tech stack, page list | `config/meta.json` |
| Any color, font, spacing, shadow, transition | `config/design-tokens.json` |
| Max widths, grid columns, breakpoints | `config/layout.json` |
| Navbar items, footer content, button/card styles | `config/components.json` |
| Scroll-reveal, hover animation rules | `config/animation.json` |
| Accessibility, SEO defaults, performance rules | `config/rules.json` |
| Architecture guide, component registry | `config/_dev_guide.json` |
| Home page sections | `config/pages/home.json` |
| About page + timeline | `config/pages/about.json` |
| Resources grid + article list | `config/pages/resources.json` |
| Courses + full syllabus | `config/pages/learnings.json` |
| Tools + features | `config/pages/my-builts.json` |
| Social links + contact form fields | `config/pages/talk-to-me.json` |

---

### Importing Config in Next.js

```tsx
// Always use @/ alias (configured in tsconfig.json paths)
import designTokens from '@/config/design-tokens.json'
import components   from '@/config/components.json'
import homeConfig   from '@/config/pages/home.json'

// Never use relative imports for config
// BAD: import tokens from '../../../config/design-tokens.json'
// GOOD: import tokens from '@/config/design-tokens.json'
```

Configure the alias in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./*"] }
  }
}
```

---

### Wiring design-tokens.json to tailwind.config.ts

This is a one-time setup in Phase 1. All subsequent components use Tailwind classes:

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import tokens from './config/design-tokens.json'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   tokens.colors.primary,
        secondary: tokens.colors.secondary,
        neutral:   {
          white:            tokens.colors.neutral.white,
          background:       tokens.colors.neutral.background,
          surface:          tokens.colors.neutral.surface,
          'muted-surface':  tokens.colors.neutral.muted_surface,
          border:           tokens.colors.neutral.border,
          'text-primary':   tokens.colors.neutral.text_primary,
          'text-secondary': tokens.colors.neutral.text_secondary,
          'text-muted':     tokens.colors.neutral.text_muted,
        },
        semantic: tokens.colors.semantic,
      },
      fontFamily: {
        heading: ['var(--font-manrope)', 'sans-serif'],
        body:    ['var(--font-inter)',   'sans-serif'],
        code:    ['var(--font-jetbrains-mono)', 'monospace'],
      },
      fontSize:     tokens.typography.font_size,
      fontWeight:   tokens.typography.font_weight,
      lineHeight:   tokens.typography.line_height,
      letterSpacing: tokens.typography.letter_spacing,
      borderRadius: tokens.radius,
      boxShadow:    tokens.shadow,
      transitionDuration: {
        fast:   '150',
        normal: '300',
        slow:   '500',
      },
      zIndex: tokens.z_index,
      spacing: tokens.spacing,
    },
  },
}
export default config
```

---

### Wiring Navbar from components.json

```tsx
// components/ui/Navbar.tsx — 'use client' required for mobile menu state
'use client'
import navConfig from '@/config/components.json'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const { navbar } = navConfig

  return (
    <header style={{ height: navbar.height }} className="sticky top-0 z-navbar backdrop-blur-sm bg-white/85 border-b border-neutral-border">
      <nav className="max-w-[1280px] mx-auto px-8 h-full flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-xl text-neutral-text-primary">
          {navbar.logo.text}
        </Link>
        <ul className="hidden md:flex gap-6">
          {navbar.menu_items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href ? 'text-primary-500' : 'text-neutral-text-secondary hover:text-primary-500'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Mobile menu toggle here */}
      </nav>
    </header>
  )
}
```

---

### Wiring Page SEO from _page_meta

Apply this pattern to every page file. Never manually type the title or description:

```tsx
// app/about/page.tsx
import aboutConfig from '@/config/pages/about.json'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       aboutConfig._page_meta.title,
  description: aboutConfig._page_meta.description,
  openGraph: {
    title:       aboutConfig._page_meta.title,
    description: aboutConfig._page_meta.description,
    images:      [{ url: aboutConfig._page_meta.og_image }],
  },
}
```

---

### Section Render Loop Pattern

Every page file must follow this exact pattern:

```tsx
// app/about/page.tsx
import aboutConfig from '@/config/pages/about.json'
import { sectionComponents } from '@/components/sections'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       aboutConfig._page_meta.title,
  description: aboutConfig._page_meta.description,
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {aboutConfig.sections.map((section) => {
        const Component = sectionComponents[section.component]
        if (!Component) {
          console.warn(`No component found for type: ${section.component}`)
          return null
        }
        return <Component key={section.id} {...section} />
      })}
    </main>
  )
}
```

---

### Dynamic Routes — generateStaticParams

For `/learnings/[slug]`, `/my-builts/[slug]`, `/resources/[slug]`:

```tsx
// app/learnings/[slug]/page.tsx
import learningsConfig from '@/config/pages/learnings.json'

export function generateStaticParams() {
  return learningsConfig.courses.map((course) => ({
    slug: course.slug,
  }))
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = learningsConfig.courses.find((c) => c.slug === params.slug)
  if (!course) return notFound()
  return <CourseDetail {...course} />
}
```

---

### Markdown Rendering for /resources/[slug]

```tsx
// app/resources/[slug]/page.tsx
import resourcesConfig from '@/config/pages/resources.json'
import { MDXRemote } from 'next-mdx-remote/rsc'
import fs from 'fs'
import path from 'path'

export function generateStaticParams() {
  return resourcesConfig.categories
    .flatMap((cat) => cat.items)
    .map((item) => ({ slug: item.slug }))
}

export default function ResourceDetailPage({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), 'content/resources', `${params.slug}.md`)
  const source = fs.readFileSync(filePath, 'utf8')
  return (
    <article className="max-w-[720px] mx-auto px-8 py-24 prose prose-lg font-body">
      <MDXRemote source={source} />
    </article>
  )
}
```

Markdown frontmatter format (every .md file in content/resources/ must have):
```md
---
title: "Article Title Here"
description: "One sentence description for SEO"
category: "Python"
read_time: "6 min"
published_date: "2026-05-27"
---

Article content starts here...
```

---

### Footer from components.json

```tsx
// components/ui/Footer.tsx
import footerConfig from '@/config/components.json'
import Link from 'next/link'

export default function Footer() {
  const { footer } = footerConfig
  return (
    <footer className="bg-neutral-background border-t border-neutral-border py-12">
      <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-3 gap-8">
        {/* Brand + tagline */}
        <div>
          <p className="font-heading font-bold text-neutral-text-primary">{footer.brand.text}</p>
          <p className="text-neutral-text-secondary text-sm mt-1">{footer.brand.tagline}</p>
        </div>
        {/* Nav links */}
        <div className="flex gap-6">
          {footer.links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-neutral-text-secondary hover:text-primary-500">
              {link.label}
            </Link>
          ))}
        </div>
        {/* Social */}
        <div className="flex gap-4 justify-end">
          {footer.social.map((s) => (
            <a key={s.platform} href={s.href} target="_blank" rel="noopener noreferrer"
               className="text-neutral-text-muted hover:text-primary-500 transition-colors">
              {s.platform}
            </a>
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-neutral-text-muted mt-8">{footer.copyright}</p>
    </footer>
  )
}
```

## When NOT to Apply

- Writing the Python generator script — Python context, not Next.js config consumption.
- Writing skill files or ai-context.json.

## Example

Building `ResourcesGrid.tsx`:
- Reads `config/pages/resources.json` for the full categories array
- Renders filter tabs from `filter_tabs` array — never hardcodes category names
- Each card's `title`, `description`, `read_time`, `category`, `slug` all come from the JSON item object
- Link href constructed as `/resources/${item.slug}` — never hardcoded

## Gotchas

- **Using relative imports for config** (`../../../config`) — breaks when files move. Always use `@/config/`.
- **Hardcoding nav items in Navbar.tsx** — nav items come from `config/components.json navbar.menu_items`. Adding a new page means updating the JSON, not the component.
- **Typing page config imports as `any`** — derive the type from the JSON shape or use `typeof import('@/config/pages/home.json')`.
- **Not calling `generateStaticParams()`** — dynamic routes 404 in production if slugs aren't pre-generated.
- **Writing markdown files without frontmatter** — the resource detail page expects frontmatter fields; missing fields cause runtime errors.
- **Forgetting to add new component to sectionComponents index** — the render loop silently skips the section with no error in dev mode, no content visible.
