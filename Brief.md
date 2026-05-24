# Final Build Brief: Personal Site for Karan Dev Arora

## 0. Project Overview

Build a personal website for Karan Dev Arora — a second-year B.Tech student interested in computer science, AI, backend engineering, and Golang. The site has eight content surfaces: Thoughts (blog), Bookshelf, Projects, Notes, Bookmarks, Uses, About, Now. Aesthetic is editorial minimalism inspired by nav.al — warm cream background, muted ink-blue accent, classic serif body with monospace for metadata. Content-first, no project cards, no hero photos, no JavaScript animations beyond view transitions.

**Stack:** Astro 5+ with MDX, Tailwind CSS v4, TypeScript strict mode, Pagefind for search, Satori for OG images. Deploy to Cloudflare Pages.

**Domain:** Use `yoursite.com` as a placeholder throughout. Make this a single constant in `src/config.ts` so it's trivially find-and-replaceable later.

**Performance target:** Lighthouse 100/100/100/100. Zero client-side JS except for: theme toggle, command palette (Cmd+K), view transitions. No tracking, no analytics, no third-party scripts.

---

## 1. Configuration

Create `src/config.ts` as the single source of truth:

```ts
export const SITE = {
  name: "Karan Dev Arora",
  shortName: "Karan",
  domain: "yoursite.com", // placeholder — replace when domain purchased
  url: "https://yoursite.com",
  description: "Engineering, philosophy, and whatever else holds my attention.",
  author: "Karan Dev Arora",
  email: "karanaroradev@gmail.com",
  socials: {
    github: "https://github.com/karandev125",
    twitter: "https://x.com/KdaArora",
    linkedin: "https://www.linkedin.com/in/karandevarora/",
  },
  nav: [
    { label: "thoughts", href: "/thoughts" },
    { label: "bookshelf", href: "/bookshelf" },
    { label: "projects", href: "/projects" },
    { label: "notes", href: "/notes" },
    { label: "about", href: "/about" },
  ],
  footerNav: [
    { label: "bookmarks", href: "/bookmarks" },
    { label: "uses", href: "/uses" },
    { label: "now", href: "/now" },
    { label: "rss", href: "/rss.xml" },
  ],
} as const;
```

---

## 2. Design System

### 2.1 Color Tokens

Define as CSS custom properties in `src/styles/global.css`. Use Tailwind v4's `@theme` directive.

**Light mode (default)**

- `--color-bg`: `#f6f1e8` (warm cream)
- `--color-bg-subtle`: `#efe8dc` (slightly deeper cream, for code blocks and hover rows)
- `--color-text`: `#1a1a1a` (warm near-black)
- `--color-text-muted`: `#6b6358` (warm gray for metadata, authors, dates)
- `--color-text-subtle`: `#9a9082` (further muted, for less important UI)
- `--color-accent`: `#3a5a8c` (muted ink-blue for links and accents)
- `--color-accent-hover`: `#2d4770` (darker on hover)
- `--color-border`: `#d8d0c0` (barely-there warm gray)
- `--color-mark`: `#8a4a2a` (warm rust — used very sparingly, e.g., "currently reading" indicator)

**Dark mode**

- `--color-bg`: `#1a1815`
- `--color-bg-subtle`: `#252119`
- `--color-text`: `#e8e3d8`
- `--color-text-muted`: `#a39a8a`
- `--color-text-subtle`: `#6b6358`
- `--color-accent`: `#7a9ec8` (lifted ink-blue for legibility)
- `--color-accent-hover`: `#9bb6d6`
- `--color-border`: `#3a342b`
- `--color-mark`: `#c87a5a`

Toggle via `data-theme="dark"` on `<html>`. Default to `prefers-color-scheme`. Persist user choice in `localStorage` under key `theme`. Apply theme synchronously in a blocking inline script in `<head>` to prevent FOUC.

### 2.2 Typography

Use Fontsource for self-hosting (no external font requests).

- **Serif (body, headings):** Source Serif 4 — variable weight, weights 400/600/700. Italic supported.
- **Mono (dates, metadata, code, UI labels):** JetBrains Mono — weights 400/500.
- No sans-serif anywhere.

Type scale (rem-based, modular ~1.2 ratio):

- `--text-xs`: 0.75rem (12px) — mono UI labels
- `--text-sm`: 0.875rem (14px) — mono metadata, dates
- `--text-base`: 1.0625rem (17px) — body
- `--text-lg`: 1.25rem (20px) — large body, intro text
- `--text-xl`: 1.5rem (24px) — H3
- `--text-2xl`: 1.875rem (30px) — H2
- `--text-3xl`: 2.5rem (40px) — H1, page titles

Body line-height: `1.7`. Heading line-height: `1.2`. Serif tracking: slightly negative on large headings (`-0.01em`).

### 2.3 Layout

- Single column, max content width `680px` for prose
- Index pages (lists) can extend to `760px` to give dates room on the right
- Side padding: `1.5rem` mobile, `2rem` tablet, scales to centered with auto margins on desktop
- Vertical rhythm: paragraph spacing `1.25em`, section spacing `2.5em`
- Footer sits with `min-height: 100vh` body, footer pinned to bottom on short pages

### 2.4 Component Behavior

**Links (inline, within prose)**

- Default: accent color, underlined with `text-underline-offset: 3px` and `text-decoration-thickness: 1px`
- Hover: shift to `--color-accent-hover`, underline thickens to `2px`
- Visited: no special state

**Links (navigation, in lists)**

- Default: `--color-text`, no underline
- Hover: shifts to accent color, no underline added

**External link indicator**

- External links in body prose get a subtle `↗` glyph after the link text (CSS `::after`)
- External links in lists/nav do not (avoid visual noise)

**List row hover (Thoughts, Bookshelf, Bookmarks indexes)**

- Background subtly warms to `--color-bg-subtle`
- Title shifts to accent color
- Transition `120ms ease-out`
- Entire row is clickable, not just title

**Heading anchors**

- Every H2 and H3 in content gets an auto-generated id
- On hover, a `#` appears to the left of the heading in `--color-text-subtle`
- Click copies the URL with anchor to clipboard
- Position the `#` absolutely so it doesn't shift layout

**Code blocks**

- Background: `--color-bg-subtle`
- Padding: `1rem 1.25rem`
- Border-radius: `4px`
- File name label (if specified in fence): mono small, top-left, `--color-text-muted`
- Copy button: top-right, mono small, ghost button, shows "copied" for 1.5s on click
- Syntax highlighting via Shiki, using a custom theme matching the palette (dim, not vibrant)
- Inline code: same family, slight tint background, no border

**Blockquotes**

- Left border `2px solid --color-accent`
- Italic serif
- Left padding `1.25rem`
- No quote marks

**Footnotes / Sidenotes**

- On screens ≥ 1024px: render as sidenotes in the right margin, aligned to the reference
- On smaller screens: render as standard numbered footnotes at the bottom of the post
- Reference superscript is the accent color
- Sidenote text is `--text-sm`, `--color-text-muted`

---

## 3. Information Architecture

```
/                    Home
/thoughts            Index of essays
/thoughts/[slug]     Individual essay
/tags/[tag]          Tag archive (footer-linked, not in main nav)
/bookshelf           Bookshelf index
/bookshelf/[slug]    Per-book notes page (only for books with notes)
/projects            Single-page projects index
/projects/[slug]     Case study (for select projects)
/notes               Notes index
/notes/[slug]        Individual note
/bookmarks           Bookmarks index
/bookmarks/tag/[t]   Bookmarks filtered by tag
/uses                Uses page
/about               About page
/now                 Now page
/feeds               Lists all RSS/JSON feeds
/search              Pagefind search UI
/rss.xml             Combined RSS feed
/thoughts/rss.xml    Thoughts-only RSS
/bookshelf/rss.xml   Bookshelf-only RSS
/notes/rss.xml       Notes-only RSS
/bookmarks/rss.xml   Bookmarks-only RSS
/sitemap-index.xml   Sitemap
/robots.txt          Robots
/humans.txt          Credits (small touch)
/404                 Custom 404
```

---

## 4. Content Collections

Use Astro Content Collections with Zod schemas in `src/content.config.ts`.

### 4.1 Thoughts Collection

Location: `src/content/thoughts/*.mdx`

```ts
{
  title: string,
  description: string,
  publishedAt: Date,
  updatedAt: Date | undefined,
  tags: string[] | undefined,
  draft: boolean (default false),
  math: boolean (default false),
  toc: boolean | undefined,
}
```

### 4.2 Bookshelf Collection

Location: `src/content/bookshelf/*.md`

```ts
{
  title: string,
  author: string,
  status: "reading" | "read" | "abandoned",
  startedAt: Date | undefined,
  finishedAt: Date | undefined,
  rating: "recommended" | "formative" | undefined,
  cover: string | undefined,
  isbn: string | undefined,
  hasNotes: boolean (default false),
  recommendedBy: string | undefined,
  tags: string[] | undefined,
}
```

Books without notes are list-only — no detail page generated. Books with `hasNotes: true` get a page at `/bookshelf/[slug]`.

### 4.3 Projects Collection

**Index entries** (`src/content/projects-index.json`):

```ts
{
  category: "live" | "past" | "experiments" | "failures",
  name: string,
  year: number,
  description: string,
  links: { label: string, href: string }[],
  caseStudy: string | undefined,
}[]
```

**Case studies** (`src/content/projects/*.mdx`):

```ts
{
  title: string,
  description: string,
  year: number,
  role: string,
  status: "live" | "archived" | "wip",
  tech: string[],
  links: { label: string, href: string }[],
}
```

### 4.4 Notes Collection

Location: `src/content/notes/*.md`

```ts
{
  title: string,
  plantedAt: Date,
  tendedAt: Date,
  stage: "seedling" | "budding" | "evergreen",
  description: string | undefined,
}
```

Support `[[note-slug]]` syntax via a remark plugin. Auto-generate backlinks at build time.

### 4.5 Bookmarks Collection

Location: `src/content/bookmarks/*.md`

```ts
{
  title: string,
  url: string,
  author: string | undefined,
  source: string | undefined,
  savedAt: Date,
  tags: string[],
}
```

Body is the commentary (1-3 sentences).

### 4.6 Singletons (About, Uses, Now)

- `src/content/pages/about.mdx`
- `src/content/pages/uses.mdx` with `updatedAt: Date`
- `src/content/pages/now.mdx` with `updatedAt: Date`

---

## 5. Page-by-Page Specs

### 5.1 Home (`/`)

Layout: vertically centered-ish, max-width `680px`, generous top padding (~`15vh`).

Content:

1. Name in serif H1, size `--text-3xl`
2. Bio paragraph in serif `--text-lg`, ~2-3 sentences
3. Inline nav row: `thoughts · bookshelf · projects · notes · about`, mono `--text-sm`, separated by middots, accent on hover
4. Below, a small "currently" block in mono `--text-sm`, color `--color-text-muted`:
   - `Currently reading: [book title], [author]` — pulled live from any book with `status: "reading"`
   - If no book is currently being read, hide this line entirely
5. Footer at the very bottom of the viewport

**Placeholder bio copy:**

> Karan Dev Arora — second-year B.Tech student. I'm interested in computer science, AI, backend engineering, and Go. I write here about engineering, philosophy, and whatever else holds my attention. Outside of code, I'm probably watching football.

### 5.2 Thoughts Index (`/thoughts`)

Header block:

- H1: `Thoughts` followed by ` (n)` in mono `--text-sm`. **If `n === 0`, omit the count entirely.**
- One-line intro in serif `--text-base`, `--color-text-muted`: *"Essays on engineering, philosophy, and whatever else holds my attention."*
- RSS link top-right: `rss ↗` in mono `--text-sm`

List:

- Reverse chronological by `publishedAt`
- Each row: title (serif) left, date (mono, `May 20, 2026` format) right
- Row hover state per section 2.4
- If empty: `Nothing here yet.` in serif `--color-text-muted`

### 5.3 Thought Detail (`/thoughts/[slug]`)

- H1: post title, serif `--text-3xl`
- Metadata line in mono `--text-sm`, `--color-text-muted`: `May 20, 2026 · 8 min read`
- If `updatedAt` is present and differs from `publishedAt` by >7 days, append: ` · updated May 25, 2026`
- Body: MDX rendered, max-width `680px`
- Auto-generated TOC in right margin (desktop) or collapsible at top (mobile) if word count >1500 OR `toc: true`
- Footnotes/sidenotes per section 2.4
- KaTeX math rendering if `math: true`
- Bottom: a single line `← Thoughts` in mono `--text-sm`. Nothing else.

### 5.4 Bookshelf Index (`/bookshelf`)

Header block:

- H1: `Bookshelf` with count (omit if `n === 0`)
- Intro: *"Books I've read, mostly remembered."*
- RSS link top-right

Three sections, vertically stacked. H2 in mono uppercase `--text-xs`, `--color-text-subtle`, letter-spacing `0.1em`. Empty sections are omitted entirely.

**Reading**

- All books with `status: "reading"`
- Row: title (serif) — author (smaller, muted) — `started [date]` (mono, right-aligned)

**[Current year]** (e.g., `2026`)

- Books with `status: "read"` and `finishedAt` in current year, latest first
- Row: title — author — date finished — rating mark (`★` or `★★`) — `→` if has notes

**Earlier**

- Books from previous years, grouped by year (latest first)
- Each year is a collapsible `<details>` element, collapsed by default
- Year header: `2025 (n)` in mono with rotating chevron on toggle

**Abandoned** (small section at bottom, collapsed by default)

- Books with `status: "abandoned"`
- Same row format

If entire bookshelf is empty: `Nothing here yet.`

### 5.5 Book Detail (`/bookshelf/[slug]`)

Only generated for books with `hasNotes: true`.

- H1: book title
- Metadata line in mono: `[author] · finished May 20, 2026 · [rating]`
- Cover image: small (~`120px` wide), floated right with thin border
- Body: notes in serif, footnotes welcome
- Optional `## Highlights` section at the bottom — quotes in italic serif, separated by horizontal dividers
- Bottom: `← Bookshelf`

### 5.6 Projects (`/projects`)

Single-page essay layout, max-width `680px`.

- H1: `Projects`
- Intro: *"Things I've made. Some live, some learning."*
- Sections from the JSON file, grouped by category in order: `live`, `past`, `experiments`, `failures`
- Section headers: mono uppercase `--text-xs`, `--color-text-subtle`, letter-spacing `0.1em`
- Each project block:
  - H2: project name, with year right-aligned in mono `--text-sm` `--color-text-muted`
  - One paragraph in serif body
  - Below paragraph, links in mono `--text-sm`: `live ↗  ·  repo ↗  ·  case study →`
  - `case study →` links to `/projects/[slug]` if `caseStudy` is set
- If zero projects: `Nothing here yet.`

### 5.7 Case Study (`/projects/[slug]`)

- H1: case study title
- Small metadata block under title in mono `--text-sm`, `--color-text-muted`:
  - `2024 · solo · live`
  - `[link] [link] [link]`
- Body: MDX rendered, same treatment as a Thought
- Bottom: `← Projects`

### 5.8 Notes Index (`/notes`) and Note Detail

**Index**

- H1: `Notes` with count (omit if 0)
- Intro: *"Working thoughts. Less polished than essays, more permanent than tweets."*
- RSS link top-right
- Flat list sorted by `tendedAt` descending
- Row: title (serif) left, then `tended May 20, 2026` (mono), then stage label (mono `--text-xs`, color varies subtly by stage)
- Empty: `Nothing here yet.`

**Detail**

- H1: note title
- Metadata line: `planted Nov 4, 2025 · tended May 10, 2026 · seedling`
- Body: serif, ~`680px` max-width, looser tone
- Bottom: `Linked from` section if backlinks exist
- Bottom: `← Notes`

### 5.9 Bookmarks Index (`/bookmarks`) and Tag Filter

**Index**

- H1: `Bookmarks` with count (omit if 0)
- Intro: *"Things worth keeping. Curated, not collected."*
- RSS link top-right
- Reverse chronological list
- Each entry:
  - Line 1: title with `↗`, links to external URL
  - Line 2: `[favicon] [author/source]` in mono `--text-sm` `--color-text-muted`, with `[date]` right-aligned
  - Line 3: commentary in serif
  - Line 4: tags in mono `--text-xs`, each links to `/bookmarks/tag/[tag]`
- Separators: subtle horizontal rule using `--color-border`
- Empty: `Nothing here yet.`

**Tag filter** (`/bookmarks/tag/[tag]`)

- Same layout, filtered, with `Bookmarks / [tag]` as breadcrumb-style H1

### 5.10 Uses (`/uses`)

- H1: `Uses`
- Intro: *"Tools I reach for. Updated when something changes."*
- `Last updated [date]` in mono `--text-sm`, `--color-text-muted`
- Sections via H2: Hardware, Editor & Terminal, Software, Browser, Mobile, Desk
- Each section is short prose, not a bullet list — items in bold serif, brief reasoning after each
- Placeholder copy: a paragraph per section saying "to be filled in"

### 5.11 About (`/about`)

- H1: `About`
- ~300-600 words, first-person, warm
- Social links at bottom in mono row, separated by middots: `github · x · linkedin · email`
- Email shown as plain text

**Placeholder copy:**

> I'm Karan Dev Arora — currently in my second year of a B.Tech in computer science.
>
> My interests sit at the intersection of AI, backend engineering, and systems programming. Go has become my favorite language for backend work; I appreciate its restraint. I'm slowly working my way deeper into distributed systems, databases, and whatever else seems worth understanding from first principles.
>
> Outside of code I read, think about philosophy, and watch football. The site is partly a notebook for things I'm learning, partly a way to think out loud, and partly just a corner of the internet that's mine.
>
> If you want to talk, the email below is the best way.

### 5.12 Now (`/now`)

- H1: `Now`
- Intro: *"What I'm focused on, as of [updatedAt]."*
- Sections in short paragraphs (not bullets): Working on, Reading, Thinking about, Where
- "Reading" auto-pulls from Bookshelf where `status: "reading"`

**Placeholder copy:**

> **Working on** — second-year coursework. On the side, building backend projects in Go to deepen my understanding of how systems actually work under the hood.
>
> **Reading** — *(auto-populated from bookshelf)*
>
> **Thinking about** — what good engineering taste looks like, and how to develop it deliberately.
>
> **Where** — *[your city]*.

### 5.13 Feeds (`/feeds`)

Plain page listing all RSS and JSON feeds with one-line descriptions and copyable URLs in mono code blocks.

### 5.14 Search (`/search`)

Pagefind UI integrated into a styled wrapper matching the site palette. Triggered by Cmd+K (or Ctrl+K on Windows) command palette from anywhere on the site, which renders an inline modal. The `/search` page is the fallback for users without JS.

### 5.15 404

Single short paragraph in voice: *"This page doesn't exist, or used to and doesn't anymore."* One link home. No giant "404."

---

## 6. Global Components

### 6.1 Header

- Not sticky — header scrolls away
- Layout: name on the left (links to `/`), nav links inline to the right, separated by middots
- Mono `--text-sm` for nav, except the name which is serif
- Theme toggle on the far right (sun/moon SVG, 16px, ghost button)
- On mobile (<640px), nav collapses to `≡` icon revealing a vertical list

### 6.2 Footer

Single row, mono `--text-xs`, `--color-text-muted`:

`bookmarks · uses · now · feeds · © 2026 Karan Dev Arora`

Second row with socials:

`github · x · linkedin · email`

### 6.3 Command Palette (Cmd+K)

- Opens on `Cmd+K` / `Ctrl+K`
- Modal centered, max-width `560px`, cream background, subtle shadow
- Input at top: mono, autofocused
- Below: Pagefind-powered results across all content
- Categories visually grouped: Thoughts, Notes, Bookmarks, Projects, Books
- Arrow keys navigate, Enter opens, Esc closes
- Result row: title, snippet, category label in mono
- Closes on outside click

### 6.4 Theme Toggle

- Icon button, sun/moon swap
- Persists choice in localStorage as `theme`
- Synchronously applies on page load via inline script in `<head>`
- Respects `prefers-color-scheme` initially

### 6.5 View Transitions

Use Astro's `<ClientRouter />` for native View Transitions.

- Cross-fade on default navigation
- Same-element transitions on heading text from list view to detail view via shared `transition:name` attributes
- All transitions respect `prefers-reduced-motion: reduce`

---

## 7. Generated Artifacts

### 7.1 RSS / JSON Feeds

Use `@astrojs/rss`. Generate at build time:

- `/rss.xml` — all Thoughts + Notes + Bookmarks + Bookshelf in one feed
- `/thoughts/rss.xml`
- `/notes/rss.xml`
- `/bookmarks/rss.xml`
- `/bookshelf/rss.xml` — entry per book added/finished
- Each also generates a JSON Feed equivalent at `/feeds/[name].json`

Include `<link rel="alternate">` tags in every page's `<head>` pointing to relevant feeds.

### 7.2 OG Images

Use Satori to generate per-page OG images at build time:

- Background: `#f6f1e8`
- Top-left: "Karan Dev Arora" in mono `14px`, `#6b6358`
- Center: page title in Source Serif 4, weight 600, size scales to fit, max 56px, color `#1a1a1a`
- Bottom-right: date in mono `14px`, `#6b6358`
- Bottom-left: site domain in mono `14px`, `#3a5a8c`
- Dimensions: 1200x630

Routes: `/og/thoughts/[slug].png`, `/og/notes/[slug].png`, `/og/[page].png`.

### 7.3 Sitemap

Use `@astrojs/sitemap`. Auto-includes all content.

### 7.4 robots.txt

Allow all. Reference sitemap.

### 7.5 humans.txt

```
/* TEAM */
Karan Dev Arora — writing, design intent, everything
karanaroradev@gmail.com

/* TECH */
Astro, MDX, Tailwind CSS, Pagefind, Satori
Source Serif 4, JetBrains Mono
Hosted on Cloudflare Pages

/* THANKS */
nav.al, shud.in, angezanetti.com, arpitbhayani.me — for the inspiration
```

### 7.6 Print Stylesheet

`@media print` rules in global CSS:

- Force light palette
- Hide nav, footer, theme toggle, TOC, command palette
- Increase contrast on text
- Show URLs after links: `a::after { content: " (" attr(href) ")"; }`
- Apply primarily to Thoughts and Case Study pages

---

## 8. Build & Tooling

### 8.1 Dependencies

```
astro                  ^5
@astrojs/mdx
@astrojs/rss
@astrojs/sitemap
@astrojs/check
tailwindcss            ^4 (via @tailwindcss/vite)
typescript             ^5 (strict mode)
pagefind
shiki
rehype-katex
remark-math
remark-gfm
@fontsource-variable/source-serif-4
@fontsource-variable/jetbrains-mono
satori
sharp
zod
```

### 8.2 Scripts

```json
{
  "dev": "astro dev",
  "build": "astro build && pagefind --site dist",
  "preview": "astro preview",
  "check": "astro check && tsc --noEmit",
  "format": "prettier --write ."
}
```

### 8.3 Astro Config

- Site URL set from `SITE.url`
- Markdown: Shiki with custom theme matching palette
- MDX: enable remark-math, remark-gfm; rehype-katex; auto-link headings with `#` anchors
- Image service: Sharp
- Output: static
- Integrations: sitemap, mdx
- View Transitions: enabled via `<ClientRouter />` in main layout

### 8.4 File Structure

```
src/
  components/
    Layout.astro
    Header.astro
    Footer.astro
    ThemeToggle.astro
    CommandPalette.astro
    Prose.astro
    PostList.astro
    BookRow.astro
    BookmarkEntry.astro
    ProjectBlock.astro
    Sidenote.astro
    Heading.astro
  content/
    thoughts/
    notes/
    bookmarks/
    bookshelf/
    projects/
    pages/
      about.mdx
      uses.mdx
      now.mdx
    projects-index.json
  layouts/
    BaseLayout.astro
    ProseLayout.astro
  pages/
    index.astro
    thoughts/
      index.astro
      [slug].astro
      rss.xml.ts
    bookshelf/
      index.astro
      [slug].astro
      rss.xml.ts
    projects/
      index.astro
      [slug].astro
    notes/
      index.astro
      [slug].astro
      rss.xml.ts
    bookmarks/
      index.astro
      tag/[tag].astro
      rss.xml.ts
    tags/[tag].astro
    uses.astro
    about.astro
    now.astro
    feeds.astro
    search.astro
    404.astro
    rss.xml.ts
    og/
      [...path].png.ts
  styles/
    global.css
  lib/
    reading-time.ts
    backlinks.ts
    open-library.ts
    date.ts
  config.ts
content.config.ts
astro.config.mjs
tailwind.config.ts
tsconfig.json
package.json
README.md
```

---

## 9. Empty State Handling

Critical for launch day. The site has zero content initially. Rules:

1. Index pages with zero items render: `Nothing here yet.` in serif, muted color, no other styling
2. Counts are omitted entirely when zero — never show `Thoughts (0)`
3. "Currently reading" line on home page is hidden entirely when no book has `status: "reading"`
4. The Now page placeholder copy renders as-is until edited
5. No "coming soon," "under construction," or any apologetic framing anywhere

---

## 10. Accessibility & Performance Requirements

- WCAG AA contrast minimum, verified on both modes
- All interactive elements keyboard-navigable
- Focus rings visible (`:focus-visible` with accent color)
- Skip-to-content link at top, hidden until focused
- All images have `alt` text; decorative images use `alt=""`
- All headings in logical order; no skipped levels
- `prefers-reduced-motion` disables view transitions, smooth scroll, hover animations
- Semantic HTML throughout (`<article>`, `<nav>`, `<main>`, `<time datetime>`)
- Lighthouse target: 100/100/100/100 on Performance, Accessibility, Best Practices, SEO
- No layout shift (CLS = 0): set image dimensions, preload fonts
- No JS for static content — only theme toggle, palette, view transitions

---

## 11. Deployment

Cloudflare Pages:

- Connect GitHub repo
- Build command: `npm run build`
- Build output: `dist`
- Node version: 20+
- Custom domain configured later when domain is purchased

No environment variables required for v1.

---

## 12. Seed Content

Create one example file in each collection so the structure is visible:

- `src/content/thoughts/hello.mdx` — placeholder essay titled "Hello" with `draft: true`. Inside: a paragraph explaining the format with examples of code blocks, footnotes, blockquotes.
- `src/content/notes/example.md` — `draft: true` placeholder
- `src/content/bookmarks/example.md` — `draft: true` placeholder
- `src/content/bookshelf/example.md` — `draft: true` placeholder
- `src/content/projects-index.json` — empty array `[]`
- `src/content/pages/about.mdx` — with the placeholder copy from section 5.11
- `src/content/pages/uses.mdx` — with placeholder copy
- `src/content/pages/now.mdx` — with placeholder copy from section 5.12

All placeholder files except the three singletons have `draft: true` so they don't render in production. Build filters out drafts.

---

## 13. README

Generate a `README.md` covering:

- Quick start (`npm install`, `npm run dev`)
- Folder layout overview
- How to add a Thought, Note, Bookmark, Book, Project (one section each, with frontmatter examples)
- How to deploy
- How to swap the domain placeholder
- How to add Mastodon/Bluesky links later

---

## 14. Acceptance Criteria

The build is complete when:

1. `npm run dev` starts the site with all pages rendering, including empty states
2. `npm run build` produces a `dist/` directory and runs Pagefind indexing without errors
3. `npm run check` passes with zero TypeScript errors
4. Light and dark modes both work, with persistence and no FOUC
5. Cmd+K opens the command palette and Pagefind search returns results
6. All RSS feeds validate
7. Lighthouse score in `npm run preview` mode hits 100/100/100/100 on the homepage and on a populated Thought page
8. View transitions visibly animate between pages on a modern browser, and are disabled when `prefers-reduced-motion` is set
9. OG images generate for at least the home page, an example thought, and the about page
10. The site renders correctly with zero content in any collection (all empty states display as specified)

---

*End of brief.*
