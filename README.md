# Pranav PT — Website

Personal brand website for Pranav PT (`pranavpt.com`). A learning space for Finance professionals who want to understand and build with technology.

Built with **Next.js 14 (App Router)** + **TailwindCSS** + **Heroicons**. Deployed on **Vercel**.

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run start
```

Open [http://localhost:3000](http://localhost:3000).

---

## The Core Idea: JSON-Driven UI

**All content, design, and layout decisions live in `/config`.** No text, color, spacing, or copy should be hardcoded inside any component.

A Next.js page reads its JSON config, maps each `section.component` to a React component, and renders them in order:

```tsx
// app/about/page.tsx — example pattern for every page
import pageConfig from '@/config/pages/about.json'
import { sectionComponents } from '@/components/sections'

export default function AboutPage() {
  return (
    <main>
      {pageConfig.sections.map((section) => {
        const Component = sectionComponents[section.component]
        return <Component key={section.id} {...section} />
      })}
    </main>
  )
}
```

Every section component receives its full JSON object as props. Components are typed to match their JSON shape.

---

## Folder Structure

```
/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # / — Home
│   ├── about/page.tsx            # /about
│   ├── resources/
│   │   ├── page.tsx              # /resources — article grid
│   │   └── [slug]/page.tsx       # /resources/[slug] — renders MD file
│   ├── learnings/
│   │   ├── page.tsx              # /learnings — course grid
│   │   └── [slug]/page.tsx       # /learnings/[slug] — course detail
│   ├── my-builts/
│   │   ├── page.tsx              # /my-builts — tools grid
│   │   └── [slug]/page.tsx       # /my-builts/[slug] — tool detail
│   ├── talk-to-me/page.tsx       # /talk-to-me
│   ├── api/contact/route.ts      # POST — contact form handler
│   └── layout.tsx                # Root layout (navbar + footer)
│
├── components/
│   ├── sections/                 # One file per 'component' type in JSON
│   │   ├── HeroFullscreen.tsx
│   │   ├── AboutTeaser.tsx
│   │   ├── JourneyTeaser.tsx
│   │   ├── Timeline.tsx
│   │   ├── ProfileBlock.tsx
│   │   ├── PageHero.tsx
│   │   ├── CTABanner.tsx
│   │   ├── ResourcesGrid.tsx
│   │   ├── CourseGrid.tsx
│   │   ├── CourseDetail.tsx
│   │   ├── ToolsGrid.tsx
│   │   ├── ToolDetail.tsx
│   │   ├── SocialLinksBlock.tsx
│   │   ├── ContactForm.tsx
│   │   └── index.ts              # Exports sectionComponents map
│   └── ui/                       # Reusable primitives
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── SectionHeader.tsx
│       └── Divider.tsx
│
├── config/                       # Single source of truth — read this before touching components
│   ├── _dev_guide.json           # START HERE — architecture, component registry, workflows
│   ├── meta.json                 # Brand, tech stack, all page routes, v1 scope
│   ├── design-tokens.json        # Colors, typography, spacing, radius, shadows, transitions
│   ├── layout.json               # Container widths, grid, breakpoints
│   ├── components.json           # Navbar, footer, buttons, cards, badges
│   ├── animation.json            # Hover/scroll animation rules, illustration guidelines
│   ├── rules.json                # Accessibility, performance targets, SEO, dev rules
│   └── pages/
│       ├── home.json
│       ├── about.json
│       ├── resources.json
│       ├── learnings.json
│       ├── my-builts.json
│       └── talk-to-me.json
│
├── content/
│   └── resources/                # Markdown articles — one .md file per resource slug
│       └── [slug].md
│
├── public/
│   ├── thumbnails/               # Course and tool thumbnail images (webp, 800x450)
│   └── og/                       # Open Graph images per page (png, 1200x630)
│
└── tailwind.config.ts            # Extend with values from config/design-tokens.json
```

---

## Config Files — What Each One Does

| File | Purpose |
|---|---|
| `_dev_guide.json` | Architecture overview, component registry, content update workflows |
| `meta.json` | Brand identity, tech stack decisions, all routes, v1 scope |
| `design-tokens.json` | Every color, font, spacing, shadow, transition value used on the site |
| `layout.json` | Max widths, grid columns, breakpoints, section padding |
| `components.json` | Navbar (menu items, logo), footer (links, social, copyright), button styles, card styles |
| `animation.json` | Scroll-reveal, hover, page transition settings. What to avoid. |
| `rules.json` | Accessibility requirements, Core Web Vitals targets, SEO defaults, developer rules |
| `pages/*.json` | Page-level content — sections array that drives the entire page render |

---

## Section Components

Each section in a page JSON has a `component` field. The component name maps 1:1 to a file in `components/sections/`.

| Component | Used On | What It Does |
|---|---|---|
| `HeroFullscreen` | Home | Full-screen (100vh) hero with headline, subheadline, 2 CTAs |
| `AboutTeaser` | Home | 2-col: bio text + 4 stats. Links to /about |
| `JourneyTeaser` | Home | 4 milestone cards showing the journey arc |
| `PageHero` | All inner pages | Badge + headline + subheadline. ~50vh. |
| `ProfileBlock` | About | Name, bio, expertise tags, hobbies, stats |
| `Timeline` | About | Vertical timeline with dates, events, external links |
| `ResourcesGrid` | Resources | Filterable grid of article cards (by category) |
| `CourseGrid` | Learnings | Grid of course cards with thumbnail + CTA |
| `CourseDetail` | Learnings/[slug] | Full course: outcomes, day-by-day syllabus, pricing |
| `ToolsGrid` | My Builts | Grid of tool cards with thumbnail + CTA |
| `ToolDetail` | My Builts/[slug] | Full tool: description, features, built_with, pricing |
| `SocialLinksBlock` | Talk to Me | Grid of platform cards (YT, LinkedIn, IG, Discord) |
| `ContactForm` | Talk to Me | Name/Email/Subject/Message form → POST /api/contact |
| `CTABanner` | Multiple | Full-width banner with headline + 1-2 CTA buttons |

Create `components/sections/index.ts` to export the map:

```ts
import HeroFullscreen from './HeroFullscreen'
import AboutTeaser from './AboutTeaser'
// ... etc

export const sectionComponents: Record<string, React.ComponentType<any>> = {
  HeroFullscreen,
  AboutTeaser,
  // ... etc
}
```

---

## TailwindCSS Setup

Extend `tailwind.config.ts` with values from `config/design-tokens.json` so Tailwind classes map to the design system:

```ts
// tailwind.config.ts
import tokens from './config/design-tokens.json'

export default {
  content: ['./app/**/*.tsx', './components/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        primary:   tokens.colors.primary,
        secondary: tokens.colors.secondary,
        neutral:   tokens.colors.neutral,
      },
      fontFamily: {
        heading: tokens.typography.font_family.heading,
        body:    tokens.typography.font_family.body,
        code:    tokens.typography.font_family.code,
      },
      borderRadius: tokens.radius,
      boxShadow:    tokens.shadow,
    },
  },
}
```

---

## Fonts (Google Fonts via next/font)

```tsx
// app/layout.tsx
import { Manrope, Inter, JetBrains_Mono } from 'next/font/google'

const manrope = Manrope({ subsets: ['latin'], weight: ['400','600','700','800'], variable: '--font-heading' })
const inter   = Inter({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-body' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-code' })
```

---

## Dynamic Routes

### Resources (`/resources/[slug]`)

1. Slugs are listed in `config/pages/resources.json` under each category's `items` array.
2. Article content lives in `content/resources/[slug].md`.
3. Use `generateStaticParams()` to pre-generate all slugs at build time.
4. Render MD using `next-mdx-remote` or `@tailwindcss/typography` prose styles.

### Learnings (`/learnings/[slug]`) and My Builts (`/my-builts/[slug]`)

1. Slugs come from `config/pages/learnings.json` (courses array) and `config/pages/my-builts.json` (tools array).
2. The detail page finds the matching object by slug and passes it to `CourseDetail` or `ToolDetail`.
3. No separate MD files — all content is in the JSON.

---

## Contact Form API

```ts
// app/api/contact/route.ts
// Reads CONTACT_EMAIL from .env
// Sends email using Nodemailer or Resend
// Returns { success: true } or { success: false, error }
```

Required environment variable:

```env
CONTACT_EMAIL=pranav@example.com   # Where contact form submissions are sent
```

---

## Payment Flow (v1 Placeholder)

Buttons with `"action": "payment_flow"` in `learnings.json` and `my-builts.json` are placeholders.

**For v1:** Link them to a Razorpay payment page, Google Form, or WhatsApp message.

**For v2:** Implement Razorpay / Stripe integration with post-payment email automation.

---

## SEO

Each page JSON has a `_page_meta` object. Use the Next.js Metadata API:

```tsx
// app/about/page.tsx
import pageConfig from '@/config/pages/about.json'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       pageConfig._page_meta.title,
  description: pageConfig._page_meta.description,
  openGraph: {
    images: [pageConfig._page_meta.og_image],
  },
}
```

---

## Content Updates (No Code Required)

| Task | What to edit |
|---|---|
| Change nav links | `config/components.json` → `navbar.menu_items` |
| Add a resource article | Add entry to `config/pages/resources.json` + create `content/resources/[slug].md` |
| Add a course | Add course object to `config/pages/learnings.json` → `courses` array |
| Add a tool | Add tool object to `config/pages/my-builts.json` → `tools` array |
| Update social links | `config/pages/talk-to-me.json` → `sections[social_links].platforms` |
| Update footer | `config/components.json` → `footer` |
| Change a color | `config/design-tokens.json` → `colors` (also update Tailwind config if adding new keys) |

---

## Placeholders to Fill Before Launch

Search for `PLACEHOLDER` across all config files to find every item that needs a real value:

```bash
grep -r "PLACEHOLDER" config/
```

Key ones:
- Social URLs in `config/pages/talk-to-me.json`
- Discord invite URL in `config/pages/about.json` (last timeline event)
- Pricing amounts in all `learnings.json` courses and `my-builts.json` tools
- Thumbnail images in `public/thumbnails/`
- OG images in `public/og/`
- Pranav's hobbies in `config/pages/about.json` → `sections[profile].hobbies.items`

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in Vercel dashboard
3. Set environment variable: `CONTACT_EMAIL`
4. Deploy — Vercel auto-detects Next.js, no build config needed

All pages are SSG (statically generated at build time). No server infrastructure required beyond the `/api/contact` serverless function.
