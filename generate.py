"""
generate.py — PranavPT.com scaffold generator
Reads config/ JSON files and writes a complete Next.js 14 App Router project
into the nextjs-app/ subfolder.

Run from the repo root:
    python generate.py

Re-running is safe:
  - Config copies, page files, root files: always overwritten (source of truth is JSON)
  - Shell component .tsx files: never overwritten (Gemini fills these in)
"""

import json
import os
import shutil
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

ROOT = Path(__file__).parent
CONFIG_SRC = ROOT / "config"
OUT = ROOT / "nextjs-app"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def write_file(path: Path, content: str, overwrite: bool = True) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and not overwrite:
        print(f"  SKIP  {path.relative_to(OUT)}")
        return
    path.write_text(content, encoding="utf-8")
    print(f"  WRITE {path.relative_to(OUT)}")


def touch(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.touch()
        print(f"  TOUCH {path.relative_to(OUT)}")


def load_json(rel: str) -> dict:
    return json.loads((CONFIG_SRC / rel).read_text(encoding="utf-8"))


# ---------------------------------------------------------------------------
# Component metadata
# (name → (config_source_hint, needs_use_client))
# overwrite=False so Gemini's implementations are never clobbered
# ---------------------------------------------------------------------------

SECTION_COMPONENTS = {
    "HeroFullscreen":   ("config/pages/home.json → sections[0]",           False),
    "AboutTeaser":      ("config/pages/home.json → sections[1]",           False),
    "JourneyTeaser":    ("config/pages/home.json → sections[2]",           False),
    "CTABanner":        ("config/pages/home.json → sections[3]",           False),
    "PageHero":         ("config/pages/about.json → sections[0]",          False),
    "ProfileBlock":     ("config/pages/about.json → sections[1]",          False),
    "Timeline":         ("config/pages/about.json → sections[2]",          False),
    "ResourcesGrid":    ("config/pages/resources.json → sections[1]",      False),
    "CourseGrid":       ("config/pages/learnings.json → .courses",         False),
    "CourseDetail":     ("config/pages/learnings.json → .courses[slug]",   False),
    "ToolsGrid":        ("config/pages/my-builts.json → .tools",           False),
    "ToolDetail":       ("config/pages/my-builts.json → .tools[slug]",     False),
    "SocialLinksBlock": ("config/pages/talk-to-me.json → sections[1]",     False),
    "ContactForm":      ("config/pages/talk-to-me.json → sections[2]",     True),
}

UI_PRIMITIVES = {
    "Navbar":         (True,  "components.json → navbar"),
    "Footer":         (False, "components.json → footer"),
    "Button":         (False, "components.json → buttons"),
    "Card":           (False, "components.json → cards"),
    "Badge":          (False, "components.json → badge"),
    "SectionHeader":  (False, "components.json → section_header"),
    "Divider":        (False, "components.json → divider"),
}

# ---------------------------------------------------------------------------
# Shell template builders
# ---------------------------------------------------------------------------

def section_shell(name: str, hint: str, use_client: bool) -> str:
    client_directive = '"use client";\n\n' if use_client else ""
    lines = []
    lines.append(client_directive + "// ============================================================")
    lines.append("// SHELL — implement this component.")
    lines.append("// Config source: " + hint)
    lines.append("// Read: aiagents/ai-context.json + aiagents/skills/skill-010-nextjs-component-standards.md")
    lines.append("// ============================================================")
    lines.append("")
    lines.append("interface " + name + "Props {")
    lines.append("  data: Record<string, unknown>;")
    lines.append("}")
    lines.append("")
    lines.append("export default function " + name + "({ data }: " + name + "Props) {")
    lines.append("  return (")
    lines.append("    <div")
    lines.append('      id="' + name.lower() + '-shell"')
    lines.append('      className="flex items-center justify-center min-h-[200px] border-2 border-dashed border-primary-500 rounded-lg m-4 p-8 bg-primary-50"')
    lines.append("    >")
    lines.append("      <div className=\"text-center\">")
    lines.append('        <p className="font-heading text-lg text-primary-700 font-semibold">' + name + "</p>")
    lines.append('        <p className="font-body text-sm text-neutral-500 mt-1">Shell — replace with implementation</p>')
    lines.append("      </div>")
    lines.append("    </div>")
    lines.append("  );")
    lines.append("}")
    return "\n".join(lines) + "\n"


def ui_shell(name: str, use_client: bool, hint: str) -> str:
    client_directive = '"use client";\n\n' if use_client else ""
    lines = []
    lines.append(client_directive + "// ============================================================")
    lines.append("// UI PRIMITIVE SHELL — implement this component.")
    lines.append("// Config source: " + hint)
    lines.append("// Read: aiagents/ai-context.json + aiagents/skills/skill-010-nextjs-component-standards.md")
    lines.append("// ============================================================")
    lines.append("")
    lines.append("interface " + name + "Props {")
    lines.append("  [key: string]: unknown;")
    lines.append("}")
    lines.append("")
    lines.append("export default function " + name + "(_props: " + name + "Props) {")
    lines.append("  return (")
    lines.append('    <div className="flex items-center justify-center min-h-[48px] border border-dashed border-neutral-300 rounded px-4 py-2 bg-neutral-50">')
    lines.append('      <span className="font-body text-xs text-neutral-400">' + name + " shell</span>")
    lines.append("    </div>")
    lines.append("  );")
    lines.append("}")
    return "\n".join(lines) + "\n"


# ---------------------------------------------------------------------------
# Root config files
# ---------------------------------------------------------------------------

def gen_package_json() -> str:
    pkg = {
        "name": "pranavpt-website",
        "version": "0.1.0",
        "private": True,
        "scripts": {
            "dev": "next dev",
            "build": "next build",
            "start": "next start",
            "lint": "next lint"
        },
        "dependencies": {
            "next": "14.2.0",
            "react": "^18",
            "react-dom": "^18",
            "@heroicons/react": "^2.1.3",
            "next-mdx-remote": "^5.0.0",
            "resend": "^3.2.0"
        },
        "devDependencies": {
            "typescript": "^5",
            "@types/node": "^20",
            "@types/react": "^18",
            "@types/react-dom": "^18",
            "tailwindcss": "^3.4.1",
            "@tailwindcss/typography": "^0.5.12",
            "autoprefixer": "^10.4.19",
            "postcss": "^8.4.38",
            "eslint": "^8",
            "eslint-config-next": "14.2.0"
        }
    }
    return json.dumps(pkg, indent=2) + "\n"


def gen_next_config() -> str:
    return (
        "/** @type {import('next').NextConfig} */\n"
        "const nextConfig = {\n"
        "  output: 'export',\n"
        "  images: {\n"
        "    unoptimized: true,\n"
        "  },\n"
        "};\n\n"
        "export default nextConfig;\n"
    )


def gen_tsconfig() -> str:
    cfg = {
        "compilerOptions": {
            "lib": ["dom", "dom.iterable", "esnext"],
            "allowJs": True,
            "skipLibCheck": True,
            "strict": True,
            "noEmit": True,
            "esModuleInterop": True,
            "module": "esnext",
            "moduleResolution": "bundler",
            "resolveJsonModule": True,
            "isolatedModules": True,
            "jsx": "preserve",
            "incremental": True,
            "plugins": [{"name": "next"}],
            "paths": {"@/*": ["./*"]}
        },
        "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        "exclude": ["node_modules"]
    }
    return json.dumps(cfg, indent=2) + "\n"


def gen_tailwind_config() -> str:
    # Uses $TOKEN style — no f-string braces conflict with JSX/TS
    return (
        "import type { Config } from 'tailwindcss';\n\n"
        "const config: Config = {\n"
        "  content: [\n"
        "    './app/**/*.{js,ts,jsx,tsx,mdx}',\n"
        "    './components/**/*.{js,ts,jsx,tsx,mdx}',\n"
        "  ],\n"
        "  theme: {\n"
        "    extend: {\n"
        "      colors: {\n"
        "        primary: {\n"
        "          50:  '#EBF4FC',\n"
        "          100: '#D7E9F9',\n"
        "          500: '#2F7EBF',\n"
        "          600: '#2469A3',\n"
        "          700: '#1A5487',\n"
        "          900: '#0B2A44',\n"
        "        },\n"
        "        secondary: {\n"
        "          50:  '#FFF7E6',\n"
        "          100: '#FFECC0',\n"
        "          400: '#F5A623',\n"
        "          500: '#E09510',\n"
        "          600: '#C07E0A',\n"
        "        },\n"
        "        neutral: {\n"
        "          50:  '#F8F9FA',\n"
        "          100: '#F0F2F5',\n"
        "          200: '#E2E6EA',\n"
        "          400: '#9BA3AF',\n"
        "          600: '#4A5568',\n"
        "          800: '#1A202C',\n"
        "          900: '#0F1117',\n"
        "          'bg-primary':   '#FFFFFF',\n"
        "          'bg-secondary': '#F8F9FA',\n"
        "          'text-primary': '#1A202C',\n"
        "          'text-secondary': '#4A5568',\n"
        "          'text-muted':   '#9BA3AF',\n"
        "          'border':       '#E2E6EA',\n"
        "        },\n"
        "        success: '#2E7D32',\n"
        "        error:   '#C62828',\n"
        "        warning: '#E65100',\n"
        "        info:    '#1565C0',\n"
        "      },\n"
        "      fontFamily: {\n"
        "        heading: ['Manrope', 'sans-serif'],\n"
        "        body:    ['Inter', 'sans-serif'],\n"
        "        mono:    ['JetBrains Mono', 'monospace'],\n"
        "      },\n"
        "      fontSize: {\n"
        "        'display-xl': ['3.5rem',  { lineHeight: '1.1', letterSpacing: '-0.02em' }],\n"
        "        'display-lg': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],\n"
        "        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],\n"
        "        'heading-xl': ['1.875rem', { lineHeight: '1.25' }],\n"
        "        'heading-lg': ['1.5rem',   { lineHeight: '1.3' }],\n"
        "        'heading-md': ['1.25rem',  { lineHeight: '1.35' }],\n"
        "        'heading-sm': ['1.125rem', { lineHeight: '1.4' }],\n"
        "        'body-lg':    ['1.125rem', { lineHeight: '1.6' }],\n"
        "        'body-md':    ['1rem',     { lineHeight: '1.6' }],\n"
        "        'body-sm':    ['0.875rem', { lineHeight: '1.5' }],\n"
        "        'caption':    ['0.75rem',  { lineHeight: '1.4' }],\n"
        "      },\n"
        "      spacing: {\n"
        "        '4xs': '2px',\n"
        "        '3xs': '4px',\n"
        "        '2xs': '8px',\n"
        "        'xs':  '12px',\n"
        "        'sm':  '16px',\n"
        "        'md':  '24px',\n"
        "        'lg':  '32px',\n"
        "        'xl':  '48px',\n"
        "        '2xl': '64px',\n"
        "        '3xl': '96px',\n"
        "        '4xl': '128px',\n"
        "      },\n"
        "      borderRadius: {\n"
        "        'sm':   '4px',\n"
        "        'md':   '8px',\n"
        "        'lg':   '12px',\n"
        "        'xl':   '16px',\n"
        "        '2xl':  '24px',\n"
        "        'full': '9999px',\n"
        "      },\n"
        "      boxShadow: {\n"
        "        'card':      '0 2px 8px rgba(0,0,0,0.08)',\n"
        "        'card-hover':'0 8px 24px rgba(0,0,0,0.12)',\n"
        "        'nav':       '0 1px 4px rgba(0,0,0,0.06)',\n"
        "        'modal':     '0 16px 48px rgba(0,0,0,0.18)',\n"
        "      },\n"
        "      zIndex: {\n"
        "        'above':    '10',\n"
        "        'dropdown': '20',\n"
        "        'sticky':   '30',\n"
        "        'navbar':   '40',\n"
        "        'overlay':  '50',\n"
        "        'modal':    '60',\n"
        "        'toast':    '70',\n"
        "      },\n"
        "      transitionDuration: {\n"
        "        'fast':   '150ms',\n"
        "        'normal': '300ms',\n"
        "        'slow':   '500ms',\n"
        "      },\n"
        "    },\n"
        "  },\n"
        "  plugins: [\n"
        "    require('@tailwindcss/typography'),\n"
        "  ],\n"
        "};\n\n"
        "export default config;\n"
    )


def gen_postcss() -> str:
    return (
        "module.exports = {\n"
        "  plugins: {\n"
        "    tailwindcss: {},\n"
        "    autoprefixer: {},\n"
        "  },\n"
        "};\n"
    )


def gen_gitignore() -> str:
    return (
        "# Next.js\n"
        ".next/\n"
        "out/\n"
        "node_modules/\n"
        "\n"
        "# Env\n"
        ".env\n"
        ".env.local\n"
        "\n"
        "# OS\n"
        ".DS_Store\n"
        "Thumbs.db\n"
        "\n"
        "# Editor\n"
        ".vscode/\n"
        ".idea/\n"
    )


def gen_env_example() -> str:
    return (
        "# Resend API key — get one at https://resend.com\n"
        "RESEND_API_KEY=your_resend_api_key_here\n"
        "\n"
        "# Sender address (must be a verified domain in Resend)\n"
        "RESEND_FROM_EMAIL=contact@pranavpt.com\n"
        "\n"
        "# Where contact form emails go\n"
        "CONTACT_TO_EMAIL=pranavaiversion@gmail.com\n"
    )


# ---------------------------------------------------------------------------
# App-level files
# ---------------------------------------------------------------------------

def gen_globals_css() -> str:
    return (
        "@tailwind base;\n"
        "@tailwind components;\n"
        "@tailwind utilities;\n"
        "\n"
        "@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');\n"
        "\n"
        "@layer base {\n"
        "  html {\n"
        "    scroll-behavior: smooth;\n"
        "  }\n"
        "  body {\n"
        "    @apply font-body text-neutral-text-primary bg-neutral-bg-primary;\n"
        "  }\n"
        "  h1, h2, h3, h4, h5, h6 {\n"
        "    @apply font-heading;\n"
        "  }\n"
        "}\n"
        "\n"
        "@layer utilities {\n"
        "  .scroll-reveal {\n"
        "    opacity: 0;\n"
        "    transform: translateY(24px);\n"
        "    transition: opacity 500ms ease, transform 500ms ease;\n"
        "  }\n"
        "  .scroll-reveal.revealed {\n"
        "    opacity: 1;\n"
        "    transform: translateY(0);\n"
        "  }\n"
        "}\n"
    )


def gen_root_layout() -> str:
    meta = load_json("meta.json")
    site_name = meta.get("brand", {}).get("name", "Pranav PT")
    description = meta.get("brand", {}).get("tagline", "Finance Technologist · Educator · Builder")

    return (
        "import type { Metadata } from 'next';\n"
        "import './globals.css';\n"
        "import Navbar from '@/components/ui/Navbar';\n"
        "import Footer from '@/components/ui/Footer';\n"
        "\n"
        "export const metadata: Metadata = {\n"
        "  title: {\n"
        "    default: '" + site_name + "',\n"
        "    template: '%s | " + site_name + "',\n"
        "  },\n"
        "  description: '" + description + "',\n"
        "};\n"
        "\n"
        "export default function RootLayout({\n"
        "  children,\n"
        "}: {\n"
        "  children: React.ReactNode;\n"
        "}) {\n"
        "  return (\n"
        "    <html lang=\"en\">\n"
        "      <body>\n"
        "        <Navbar />\n"
        "        <main>{children}</main>\n"
        "        <Footer />\n"
        "      </body>\n"
        "    </html>\n"
        "  );\n"
        "}\n"
    )


# ---------------------------------------------------------------------------
# Section render loop — used by home, about, resources, talk-to-me
# ---------------------------------------------------------------------------

SECTION_RENDER_LOOP = (
    "import sectionsData from '@/config/pages/PAGE_SLUG.json';\n"
    "import * as SectionComponents from '@/components/sections';\n"
    "\n"
    "type SectionKey = keyof typeof SectionComponents;\n"
    "\n"
    "export default function PAGE_NAME_Page() {\n"
    "  return (\n"
    "    <>\n"
    "      {sectionsData.sections.map((section: { id: string; component: string; [key: string]: unknown }) => {\n"
    "        const Component = SectionComponents[section.component as SectionKey];\n"
    "        if (!Component) return null;\n"
    "        return <Component key={section.id} data={section} />;\n"
    "      })}\n"
    "    </>\n"
    "  );\n"
    "}\n"
)


def gen_sections_page(page_slug: str, page_name: str, title: str, description: str) -> str:
    # json.dumps gives properly escaped double-quoted strings — safe for apostrophes, em dashes, etc.
    meta_block = (
        "import type { Metadata } from 'next';\n"
        "export const metadata: Metadata = {\n"
        "  title: " + json.dumps(title) + ",\n"
        "  description: " + json.dumps(description) + ",\n"
        "};\n\n"
    )
    body = (
        SECTION_RENDER_LOOP
        .replace("PAGE_SLUG", page_slug)
        .replace("PAGE_NAME", page_name)
    )
    return meta_block + body


def gen_home_page() -> str:
    cfg = load_json("pages/home.json")
    meta = cfg["_page_meta"]
    return gen_sections_page("home", "Home", meta["title"], meta["description"])


def gen_about_page() -> str:
    cfg = load_json("pages/about.json")
    meta = cfg["_page_meta"]
    return gen_sections_page("about", "About", meta["title"], meta["description"])


def gen_resources_list_page() -> str:
    cfg = load_json("pages/resources.json")
    meta = cfg["_page_meta"]
    return gen_sections_page("resources", "Resources", meta["title"], meta["description"])


def gen_talk_to_me_page() -> str:
    cfg = load_json("pages/talk-to-me.json")
    meta = cfg["_page_meta"]
    return gen_sections_page("talk-to-me", "TalkToMe", meta["title"], meta["description"])


# ---------------------------------------------------------------------------
# Resources dynamic route
# ---------------------------------------------------------------------------

def gen_resources_slug_page() -> str:
    return (
        "import type { Metadata } from 'next';\n"
        "import { notFound } from 'next/navigation';\n"
        "import { MDXRemote } from 'next-mdx-remote/rsc';\n"
        "import fs from 'fs';\n"
        "import path from 'path';\n"
        "import matter from 'gray-matter';\n"
        "import resourcesData from '@/config/pages/resources.json';\n"
        "\n"
        "// Collect all slugs from the config\n"
        "const allSlugs = resourcesData.sections\n"
        "  .find((s: { id: string }) => s.id === 'resources_grid')\n"
        "  ?.categories?.flatMap((c: { items: { slug: string }[] }) => c.items.map((i) => i.slug)) ?? [];\n"
        "\n"
        "export async function generateStaticParams() {\n"
        "  return allSlugs.map((slug: string) => ({ slug }));\n"
        "}\n"
        "\n"
        "export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {\n"
        "  const filePath = path.join(process.cwd(), 'content/resources', params.slug + '.md');\n"
        "  if (!fs.existsSync(filePath)) return {};\n"
        "  const { data } = matter(fs.readFileSync(filePath, 'utf-8'));\n"
        "  return { title: data.title, description: data.description };\n"
        "}\n"
        "\n"
        "export default function ResourceArticlePage({ params }: { params: { slug: string } }) {\n"
        "  const filePath = path.join(process.cwd(), 'content/resources', params.slug + '.md');\n"
        "  if (!fs.existsSync(filePath)) notFound();\n"
        "\n"
        "  const raw = fs.readFileSync(filePath, 'utf-8');\n"
        "  const { data, content } = matter(raw);\n"
        "\n"
        "  return (\n"
        "    <article className=\"max-w-[720px] mx-auto px-8 py-24\">\n"
        "      <a href=\"/resources\" className=\"font-body text-sm text-primary-500 hover:underline\">\n"
        "        &larr; All Resources\n"
        "      </a>\n"
        "      <div className=\"mt-6 flex gap-3 items-center\">\n"
        "        <span className=\"font-body text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full\">\n"
        "          {data.category}\n"
        "        </span>\n"
        "        <span className=\"font-body text-xs text-neutral-text-muted\">{data.read_time}</span>\n"
        "        <span className=\"font-body text-xs text-neutral-text-muted\">{data.published_date}</span>\n"
        "      </div>\n"
        "      <div className=\"prose prose-lg font-body text-neutral-text-primary max-w-none mt-8\">\n"
        "        <MDXRemote source={content} />\n"
        "      </div>\n"
        "    </article>\n"
        "  );\n"
        "}\n"
    )


# ---------------------------------------------------------------------------
# Learnings pages
# ---------------------------------------------------------------------------

def gen_learnings_list_page() -> str:
    cfg = load_json("pages/learnings.json")
    meta = cfg["_page_meta"]
    return (
        "import type { Metadata } from 'next';\n"
        "import learningsData from '@/config/pages/learnings.json';\n"
        "import PageHero from '@/components/sections/PageHero';\n"
        "import CourseGrid from '@/components/sections/CourseGrid';\n"
        "\n"
        "export const metadata: Metadata = {\n"
        "  title: " + json.dumps(meta["title"]) + ",\n"
        "  description: " + json.dumps(meta["description"]) + ",\n"
        "};\n"
        "\n"
        "export default function LearningsPage() {\n"
        "  return (\n"
        "    <>\n"
        "      <PageHero data={learningsData.page_hero} />\n"
        "      <CourseGrid data={{ courses: learningsData.courses }} />\n"
        "    </>\n"
        "  );\n"
        "}\n"
    )


def gen_learnings_slug_page() -> str:
    return (
        "import type { Metadata } from 'next';\n"
        "import { notFound } from 'next/navigation';\n"
        "import learningsData from '@/config/pages/learnings.json';\n"
        "import CourseDetail from '@/components/sections/CourseDetail';\n"
        "\n"
        "export async function generateStaticParams() {\n"
        "  return learningsData.courses.map((c: { slug: string }) => ({ slug: c.slug }));\n"
        "}\n"
        "\n"
        "export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {\n"
        "  const course = learningsData.courses.find((c: { slug: string }) => c.slug === params.slug);\n"
        "  if (!course) return {};\n"
        "  return { title: course.title + ' — Pranav PT', description: course.description };\n"
        "}\n"
        "\n"
        "export default function CourseDetailPage({ params }: { params: { slug: string } }) {\n"
        "  const course = learningsData.courses.find((c: { slug: string }) => c.slug === params.slug);\n"
        "  if (!course) notFound();\n"
        "  return <CourseDetail data={course} />;\n"
        "}\n"
    )


# ---------------------------------------------------------------------------
# My Builts pages
# ---------------------------------------------------------------------------

def gen_my_builts_list_page() -> str:
    cfg = load_json("pages/my-builts.json")
    meta = cfg["_page_meta"]
    return (
        "import type { Metadata } from 'next';\n"
        "import myBuiltsData from '@/config/pages/my-builts.json';\n"
        "import PageHero from '@/components/sections/PageHero';\n"
        "import ToolsGrid from '@/components/sections/ToolsGrid';\n"
        "\n"
        "export const metadata: Metadata = {\n"
        "  title: " + json.dumps(meta["title"]) + ",\n"
        "  description: " + json.dumps(meta["description"]) + ",\n"
        "};\n"
        "\n"
        "export default function MyBuiltsPage() {\n"
        "  return (\n"
        "    <>\n"
        "      <PageHero data={myBuiltsData.page_hero} />\n"
        "      <ToolsGrid data={{ tools: myBuiltsData.tools }} />\n"
        "    </>\n"
        "  );\n"
        "}\n"
    )


def gen_my_builts_slug_page() -> str:
    return (
        "import type { Metadata } from 'next';\n"
        "import { notFound } from 'next/navigation';\n"
        "import myBuiltsData from '@/config/pages/my-builts.json';\n"
        "import ToolDetail from '@/components/sections/ToolDetail';\n"
        "\n"
        "export async function generateStaticParams() {\n"
        "  return myBuiltsData.tools.map((t: { slug: string }) => ({ slug: t.slug }));\n"
        "}\n"
        "\n"
        "export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {\n"
        "  const tool = myBuiltsData.tools.find((t: { slug: string }) => t.slug === params.slug);\n"
        "  if (!tool) return {};\n"
        "  return { title: tool.title + ' — Pranav PT', description: tool.tagline };\n"
        "}\n"
        "\n"
        "export default function ToolDetailPage({ params }: { params: { slug: string } }) {\n"
        "  const tool = myBuiltsData.tools.find((t: { slug: string }) => t.slug === params.slug);\n"
        "  if (!tool) notFound();\n"
        "  return <ToolDetail data={tool} />;\n"
        "}\n"
    )


# ---------------------------------------------------------------------------
# Contact API route
# ---------------------------------------------------------------------------

def gen_contact_route() -> str:
    return (
        "import { NextRequest, NextResponse } from 'next/server';\n"
        "import { Resend } from 'resend';\n"
        "\n"
        "const resend = new Resend(process.env.RESEND_API_KEY);\n"
        "\n"
        "export async function POST(req: NextRequest) {\n"
        "  try {\n"
        "    const body = await req.json();\n"
        "    const { name, email, subject, message } = body as {\n"
        "      name: string;\n"
        "      email: string;\n"
        "      subject: string;\n"
        "      message: string;\n"
        "    };\n"
        "\n"
        "    if (!name || !email || !message) {\n"
        "      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });\n"
        "    }\n"
        "\n"
        "    await resend.emails.send({\n"
        "      from: process.env.RESEND_FROM_EMAIL ?? 'contact@pranavpt.com',\n"
        "      to:   process.env.CONTACT_TO_EMAIL   ?? 'pranavaiversion@gmail.com',\n"
        "      subject: `[pranavpt.com] ${subject || 'New message'} — from ${name}`,\n"
        "      html: `\n"
        "        <p><strong>Name:</strong> ${name}</p>\n"
        "        <p><strong>Email:</strong> ${email}</p>\n"
        "        <p><strong>Subject:</strong> ${subject}</p>\n"
        "        <hr />\n"
        "        <p>${message.replace(/\\n/g, '<br/>')}</p>\n"
        "      `,\n"
        "    });\n"
        "\n"
        "    return NextResponse.json({ success: true });\n"
        "  } catch (err) {\n"
        "    console.error('[contact] error', err);\n"
        "    return NextResponse.json({ error: 'Server error' }, { status: 500 });\n"
        "  }\n"
        "}\n"
    )


# ---------------------------------------------------------------------------
# 404 page
# ---------------------------------------------------------------------------

def gen_not_found() -> str:
    return (
        "export default function NotFound() {\n"
        "  return (\n"
        "    <div className=\"flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4\">\n"
        "      <h1 className=\"font-heading text-display-md text-primary-700\">404</h1>\n"
        "      <p className=\"font-body text-body-lg text-neutral-text-secondary\">Page not found.</p>\n"
        "      <a href=\"/\" className=\"font-body text-primary-500 underline hover:text-primary-700\">\n"
        "        Go home\n"
        "      </a>\n"
        "    </div>\n"
        "  );\n"
        "}\n"
    )


# ---------------------------------------------------------------------------
# Sections index (barrel export)
# ---------------------------------------------------------------------------

def gen_sections_index() -> str:
    lines = ["// Auto-generated barrel export — do not edit manually"]
    for name in sorted(SECTION_COMPONENTS.keys()):
        lines.append("export { default as " + name + " } from './" + name + "';")
    return "\n".join(lines) + "\n"


# ---------------------------------------------------------------------------
# useScrollReveal hook
# ---------------------------------------------------------------------------

def gen_scroll_reveal_hook() -> str:
    return (
        '"use client";\n'
        "import { useEffect, useRef } from 'react';\n"
        "\n"
        "export function useScrollReveal<T extends HTMLElement>() {\n"
        "  const ref = useRef<T>(null);\n"
        "\n"
        "  useEffect(() => {\n"
        "    const el = ref.current;\n"
        "    if (!el) return;\n"
        "\n"
        "    const observer = new IntersectionObserver(\n"
        "      ([entry]) => {\n"
        "        if (entry.isIntersecting) {\n"
        "          el.classList.add('revealed');\n"
        "          observer.disconnect();\n"
        "        }\n"
        "      },\n"
        "      { threshold: 0.15 }\n"
        "    );\n"
        "\n"
        "    observer.observe(el);\n"
        "    return () => observer.disconnect();\n"
        "  }, []);\n"
        "\n"
        "  return ref;\n"
        "}\n"
    )


# ---------------------------------------------------------------------------
# Sample resource article (so the detail page resolves on first run)
# ---------------------------------------------------------------------------

def gen_sample_resource() -> str:
    return (
        "---\n"
        "title: \"Python for Non-Coders: Where to Actually Start\"\n"
        "description: \"Not another 'install Python' tutorial. This is about the mindset shift that makes Python finally click.\"\n"
        "category: \"Python\"\n"
        "read_time: \"6 min\"\n"
        "published_date: \"2026-05-27\"\n"
        "---\n"
        "\n"
        "# Python for Non-Coders: Where to Actually Start\n"
        "\n"
        "Most tutorials start with installation. That's not where Python begins.\n"
        "\n"
        "Python begins with a question: *what do you want to stop doing manually?*\n"
        "\n"
        "Until you have an answer to that, no amount of `print(\"Hello, World\")` will make it stick.\n"
        "\n"
        "## The mindset shift\n"
        "\n"
        "Programming is not memorising syntax. It's translating a process you already understand into a form a computer can follow.\n"
        "\n"
        "You already know how to describe a process:\n"
        "\n"
        "1. Open the folder\n"
        "2. Find files from last month\n"
        "3. Move them to the archive folder\n"
        "\n"
        "That *is* Python. Almost word for word.\n"
        "\n"
        "## Where to actually start\n"
        "\n"
        "Open [Google Colab](https://colab.research.google.com). No installation. No setup. Just a browser.\n"
        "\n"
        "Write one line:\n"
        "\n"
        "```python\n"
        "print(\"I am going to automate something today\")\n"
        "```\n"
        "\n"
        "Run it. That's Python.\n"
        "\n"
        "Now find one repetitive task in your work. Describe it in plain English. Then we'll translate it together.\n"
        "\n"
        "---\n"
        "\n"
        "*This article is part of the Resources section on pranavpt.com — written for Finance professionals who want to understand technology from the inside out.*\n"
    )


# ---------------------------------------------------------------------------
# ai-context.json generator
# Reads real config files so the output is always factually correct.
# Preserves current_build_status so phase progress is never reset.
# Output: aiagents/ai-context.json  (outside nextjs-app/, never served)
# ---------------------------------------------------------------------------

def _extract_components_from_pages() -> list:
    """Scan all page JSONs and collect every unique 'component' value."""
    components = []
    pages_dir = CONFIG_SRC / "pages"
    for json_file in sorted(pages_dir.glob("*.json")):
        data = json.loads(json_file.read_text(encoding="utf-8"))
        for section in data.get("sections", []):
            name = section.get("component")
            if name and name not in components:
                components.append(name)
    return components


def _scan_placeholders() -> dict:
    """Find every PLACEHOLDER_ key across all config JSON files."""
    found = {}
    for json_file in sorted(CONFIG_SRC.rglob("*.json")):
        text = json_file.read_text(encoding="utf-8")
        import re
        matches = re.findall(r'PLACEHOLDER_\w+', text)
        for m in matches:
            rel = str(json_file.relative_to(CONFIG_SRC))
            if m not in found:
                found[m] = rel
    return found


def gen_ai_context() -> None:
    meta   = load_json("meta.json")
    tokens = load_json("design-tokens.json")

    # Preserve current_build_status if file already exists
    ai_context_path = ROOT / "aiagents" / "ai-context.json"
    existing_status = {
        "_note":         "Update phase status manually as each phase completes. All other sections are auto-generated — edit generate.py instead.",
        "last_updated":  "2026-05-27",
        "phase_1_scaffold":      "complete",
        "phase_2_ui_primitives": "pending",
        "phase_3_layout":        "pending",
        "phase_4_home":          "pending",
        "phase_5_about":         "pending",
        "phase_6_resources":     "pending",
        "phase_7_learnings":     "pending",
        "phase_8_my_builts":     "pending",
        "phase_9_talk_to_me":    "pending",
        "phase_10_final_review": "pending",
        "active_phase":          "phase_2_ui_primitives"
    }
    if ai_context_path.exists():
        try:
            existing = json.loads(ai_context_path.read_text(encoding="utf-8"))
            saved = existing.get("current_build_status", {})
            if saved:
                # Merge: carry forward saved values, fill any missing keys from defaults
                for k, v in existing_status.items():
                    if k not in saved:
                        saved[k] = v
                existing_status = saved
        except Exception:
            pass

    # --- project_identity: from meta.json ---
    brand = meta.get("brand", {})
    phil  = meta.get("design_philosophy", {})
    pers  = meta.get("brand_personality", {})
    project_identity = {
        "site_name":  brand.get("name", ""),
        "tagline":    brand.get("tagline", ""),
        "domain":     "pranavpt.com",
        "identity":   "Personal brand site for a self-taught Finance Technologist and educator. This is a LEARNING SPACE — not a sales page. The tone is warm, human, curious, mentor-like. Never corporate, never pushy.",
        "primary_goal":        phil.get("primary_goal", ""),
        "user_should_feel":    phil.get("user_feeling", []),
        "avoid_feelings":      phil.get("avoid_feelings", []),
        "tone_primary":        pers.get("tone_of_voice", {}).get("primary", []),
        "tone_avoid":          pers.get("tone_of_voice", {}).get("avoid", []),
        "what_this_is_not":    "Not an educational platform. Not a product store. Not a portfolio. It is the personal space of one person sharing what he has learned."
    }

    # --- tech_stack: from meta.json ---
    ts   = meta.get("tech_stack", {})
    dep  = meta.get("deployment", {})
    fonts = ts.get("fonts", {}).get("families", [])
    font_map = {f["role"]: f["name"] for f in fonts}
    tech_stack = {
        "framework":       "Next.js 14 — App Router ONLY. No pages/ directory. No getStaticProps. No getServerSideProps.",
        "framework_choice": ts.get("framework", {}).get("final_choice", ""),
        "styling":         "TailwindCSS — only use classes that map to design-tokens.json. No arbitrary values.",
        "language":        "TypeScript — all files are .tsx or .ts. No .js or .jsx.",
        "icons":           "Heroicons v2 ONLY — import from @heroicons/react/24/outline or /24/solid. No other icon library.",
        "fonts": {
            "heading": font_map.get("heading", "Manrope"),
            "body":    font_map.get("body", "Inter"),
            "code":    font_map.get("code", "JetBrains Mono"),
            "loading_strategy": ts.get("fonts", {}).get("loading_strategy", "Google Fonts CDN")
        },
        "animation":       "CSS transitions only. IntersectionObserver for scroll-reveal. No Framer Motion.",
        "markdown":        "next-mdx-remote for rendering .md files in /resources/[slug]",
        "deployment":      dep.get("platform", "Vercel"),
        "node_version":    "18+",
        "package_manager": "npm"
    }

    # --- design_system_summary: from design-tokens.json ---
    colors = tokens.get("colors", {})
    typo   = tokens.get("typography", {})
    design_system_summary = {
        "primary_500":     colors.get("primary",   {}).get("500", ""),
        "secondary_500":   colors.get("secondary", {}).get("500", ""),
        "neutral_bg":      colors.get("neutral",   {}).get("background", ""),
        "neutral_surface": colors.get("neutral",   {}).get("surface", ""),
        "text_primary":    colors.get("neutral",   {}).get("text_primary", ""),
        "text_secondary":  colors.get("neutral",   {}).get("text_secondary", ""),
        "border":          colors.get("neutral",   {}).get("border", ""),
        "heading_font":    typo.get("font_family", {}).get("heading", ""),
        "body_font":       typo.get("font_family", {}).get("body", ""),
        "full_tokens_in":  "config/design-tokens.json — this summary is for quick reference only. Always read the full token file for implementation."
    }

    # --- folder_structure: derived from meta.json site_pages ---
    pages_list = meta.get("site_pages", {}).get("pages", [])
    dyn_routes = meta.get("site_pages", {}).get("dynamic_routes", [])
    folder_structure = {p["route"]: p["nextjs_file"] for p in pages_list}
    for d in dyn_routes:
        folder_structure[d["route"]] = d["nextjs_file"]
    folder_structure.update({
        "app/api/contact/route.ts":      "Contact form POST handler — uses Resend",
        "app/layout.tsx":                "Root layout — Navbar + Footer + font setup",
        "components/sections/":         "One .tsx per 'component' value in page JSONs",
        "components/sections/index.ts": "Barrel export — keys must match JSON component values exactly",
        "components/ui/":               "Button, Card, Badge, SectionHeader, Divider, Navbar, Footer",
        "config/":                      "ALL content and design — never hardcode values that exist here",
        "content/resources/":           "Markdown files for /resources/[slug]",
        "public/thumbnails/":           "Tool and course thumbnails (800x450 webp)",
        "public/og/":                   "Open Graph images per page (1200x630 png)"
    })

    # --- component_registry: SECTION_COMPONENTS is authoritative (some pages like
    #     learnings/my-builts don't use a sections array so JSON scan misses them)
    valid_components = sorted(SECTION_COMPONENTS.keys())

    # --- ui_primitives_registry: from config/components.json ---
    components_cfg = load_json("components.json")
    ui_primitives_registry = components_cfg.get("ui_primitives_registry", {})

    # --- placeholder_values: scanned from config files ---
    placeholders_found = _scan_placeholders()
    placeholder_values = {
        "_note":       "These PLACEHOLDER_ values exist in config but are not real yet. Do NOT break the build because of them.",
        "_scan_found": placeholders_found,
        "social_urls": "PLACEHOLDER_* in talk-to-me.json — render as href='#' with disabled style",
        "pricing":     "PLACEHOLDER_PRICE in learnings.json and my-builts.json — render as 'Coming Soon'",
        "thumbnails":  "Missing images — use a div with bg-primary-100 as placeholder",
        "hobbies":     "Empty array in about.json profile.hobbies.items — render nothing if empty"
    }

    # --- phase_sequence: from config/rules.json ---
    rules_cfg = load_json("rules.json")
    phase_sequence = rules_cfg.get("phase_sequence", {})

    # --- what_was_already_decided: from meta.json v1_scope ---
    v1 = meta.get("v1_scope", {})
    what_was_decided = {
        "no_dark_mode":               not v1.get("dark_mode", False),
        "no_photography":             not v1.get("photography", False),
        "no_cms":                     not v1.get("cms_integration", False),
        "no_pages_router":            True,
        "no_default_tailwind_colors": True,
        "no_framer_motion":           True,
        "no_other_icon_libs":         True,
        "payment_in_v1":              "placeholder only — " + v1.get("payment_flow", ""),
        "pages_removed":              v1.get("pages_removed", []),
        "media_assets":               v1.get("media_assets", "illustration_and_icon_only")
    }

    # --- assemble final context ---
    context = {
        "_purpose":         "Master context file for all AI agents working on the Pranav PT website. Read this file completely before writing any code.",
        "_generated_by":    "generate.py — do not edit this file manually. Changes here will be lost on the next generate.py run. Edit generate.py or the source config files instead.",
        "_generated_on":    "2026-05-27",

        "_instruction_to_agent": [
            "1. Read this file in full before writing a single line of code.",
            "2. Read the skill files listed in your phase prompt: aiagents/skills/skill-010-nextjs-component-standards.md and skill-011-json-config-consumption.md",
            "3. Check current_build_status.active_phase — only implement components for that phase.",
            "4. Run the entry_checks for your phase before starting. If they fail, fix them first.",
            "5. Write your code.",
            "6. Before submitting, re-read must_never_do and verify your output violates none of them.",
            "7. State in your response: 'I have verified against ai-context.json — no discrepancies found.'"
        ],

        "project_identity":      project_identity,
        "tech_stack":            tech_stack,
        "design_system_summary": design_system_summary,
        "folder_structure":      folder_structure,

        "component_registry": {
            "_note":            "Auto-extracted from all page JSONs. These are the only valid 'component' values. The index.ts barrel export must include all of these.",
            "valid_components": valid_components
        },

        "ui_primitives_registry": ui_primitives_registry,

        "naming_conventions": {
            "component_files":  "PascalCase — HeroFullscreen.tsx, CTABanner.tsx",
            "page_files":       "lowercase — page.tsx, layout.tsx (Next.js convention)",
            "config_files":     "kebab-case — design-tokens.json, my-builts.json",
            "css_classes":      "Tailwind utility classes only — no custom CSS unless unavoidable",
            "function_names":   "camelCase",
            "type_names":       "PascalCase with Props suffix — HeroFullscreenProps",
            "route_segments":   "kebab-case — /my-builts, /talk-to-me"
        },

        "config_consumption_rules": {
            "rule_1": "Never hardcode any color value. Use Tailwind classes mapped to design-tokens.json.",
            "rule_2": "Never hardcode any text/copy inside a component. All copy comes from the page JSON passed as props.",
            "rule_3": "Never hardcode spacing, border-radius, or shadow values. Use Tailwind token classes.",
            "rule_4": "Every section component receives its full JSON section object as a 'data' prop.",
            "rule_5": "Page metadata (title, description, og_image) comes from _page_meta in each page JSON."
        },

        "rendering_rules": {
            "all_pages":              "SSG by default — no 'use client' on page files",
            "interactive_components": "'use client' only on components with useState/useEffect/event handlers",
            "dynamic_routes":         "Use generateStaticParams() for /resources/[slug], /learnings/[slug], /my-builts/[slug]",
            "images":                 "next/image only — never <img> tag"
        },

        "must_never_do": [
            "Use default Tailwind color names (blue-600, gray-400) — always use project tokens",
            "Use <img> tag — always use next/image",
            "Add external links without target='_blank' rel='noopener noreferrer'",
            "Use Framer Motion, GSAP, AOS, or any animation library",
            "Use lucide-react, react-icons, font-awesome — Heroicons only",
            "Use the pages/ directory — App Router only",
            "Hardcode any text string inside a component — read from props/config",
            "Break the build because a PLACEHOLDER_ value is present — handle gracefully"
        ],

        "placeholder_values":    placeholder_values,

        "contact_form_api": {
            "endpoint":      "POST /api/contact",
            "env_variable":  "RESEND_API_KEY",
            "behavior":      "Show inline success/error after submit. No page redirect. Client-side validation before POST.",
            "email_library": "Resend (already in package.json)"
        },

        "what_was_already_decided": what_was_decided,
        "phase_sequence":           phase_sequence,
        "current_build_status":     existing_status
    }

    ai_context_path.parent.mkdir(parents=True, exist_ok=True)
    ai_context_path.write_text(
        json.dumps(context, indent=2, ensure_ascii=False),
        encoding="utf-8"
    )
    print("  WRITE aiagents/ai-context.json (generated from config files)")


# ---------------------------------------------------------------------------
# Main scaffold runner
# ---------------------------------------------------------------------------

def scaffold() -> None:
    print("\n" + "=" * 60)
    print("  PranavPT.com — Next.js scaffold generator")
    print("  Output -> " + str(OUT))
    print("=" * 60 + "\n")

    # 1. Copy config
    config_dest = OUT / "config"
    if config_dest.exists():
        shutil.rmtree(config_dest)
    shutil.copytree(CONFIG_SRC, config_dest)
    print("  COPY  config/ ->", config_dest.relative_to(OUT))

    # 2. Root project files (always overwrite — these are boilerplate)
    write_file(OUT / "package.json",      gen_package_json())
    write_file(OUT / "next.config.mjs",   gen_next_config())
    write_file(OUT / "tsconfig.json",     gen_tsconfig())
    write_file(OUT / "tailwind.config.ts", gen_tailwind_config())
    write_file(OUT / "postcss.config.js", gen_postcss())
    write_file(OUT / ".gitignore",        gen_gitignore())
    write_file(OUT / ".env.example",      gen_env_example())

    # 3. App-level files
    write_file(OUT / "app" / "globals.css",  gen_globals_css())
    write_file(OUT / "app" / "layout.tsx",   gen_root_layout())
    write_file(OUT / "app" / "not-found.tsx", gen_not_found())

    # 4. Page files
    write_file(OUT / "app" / "page.tsx",                             gen_home_page())
    write_file(OUT / "app" / "about" / "page.tsx",                   gen_about_page())
    write_file(OUT / "app" / "resources" / "page.tsx",               gen_resources_list_page())
    write_file(OUT / "app" / "resources" / "[slug]" / "page.tsx",    gen_resources_slug_page())
    write_file(OUT / "app" / "learnings" / "page.tsx",               gen_learnings_list_page())
    write_file(OUT / "app" / "learnings" / "[slug]" / "page.tsx",    gen_learnings_slug_page())
    write_file(OUT / "app" / "my-builts" / "page.tsx",               gen_my_builts_list_page())
    write_file(OUT / "app" / "my-builts" / "[slug]" / "page.tsx",    gen_my_builts_slug_page())
    write_file(OUT / "app" / "talk-to-me" / "page.tsx",              gen_talk_to_me_page())

    # 5. API route
    write_file(OUT / "app" / "api" / "contact" / "route.ts", gen_contact_route())

    # 6. Section component shells (overwrite=False — never clobber Gemini's work)
    write_file(OUT / "components" / "sections" / "index.ts",
               gen_sections_index(), overwrite=True)

    for name, (hint, use_client) in SECTION_COMPONENTS.items():
        write_file(
            OUT / "components" / "sections" / (name + ".tsx"),
            section_shell(name, hint, use_client),
            overwrite=False,
        )

    # 7. UI primitive shells (overwrite=False)
    for name, (use_client, hint) in UI_PRIMITIVES.items():
        write_file(
            OUT / "components" / "ui" / (name + ".tsx"),
            ui_shell(name, use_client, hint),
            overwrite=False,
        )

    # 8. Hook
    write_file(OUT / "hooks" / "useScrollReveal.ts",
               gen_scroll_reveal_hook(), overwrite=False)

    # 9. Placeholder directories
    touch(OUT / "content" / "resources" / ".gitkeep")
    touch(OUT / "public"  / "thumbnails" / ".gitkeep")
    touch(OUT / "public"  / "og"         / ".gitkeep")

    # 10. One sample resource article so the slug route resolves immediately
    sample_path = OUT / "content" / "resources" / "python-for-non-coders.md"
    write_file(sample_path, gen_sample_resource(), overwrite=False)

    # 11. Generate ai-context.json (reads real config, preserves build status)
    gen_ai_context()

    # 13. gray-matter note — needed for resource articles
    pkg_path = OUT / "package.json"
    pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
    if "gray-matter" not in pkg["dependencies"]:
        pkg["dependencies"]["gray-matter"] = "^4.0.3"
        pkg_path.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")
        print("  PATCH package.json -> added gray-matter")

    print("\n" + "=" * 60)
    print("  Scaffold complete!")
    print()
    print("  Next steps:")
    print("    cd nextjs-app")
    print("    npm install")
    print("    npm run dev")
    print()
    print("  Then hand the Gemini developer prompt from")
    print("  aiagents/ai-context.json to implement each shell.")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    scaffold()
