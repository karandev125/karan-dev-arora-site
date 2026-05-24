# Personal Site!

Personal site for me, built with Astro, MDX, Tailwind CSS, Pagefind, Satori, and self-hosted Source Serif 4 / JetBrains Mono fonts.

## Quick Start

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run check
npm run build
npm run preview
```

## Folder Layout

- `src/config.ts` - site metadata, navigation, socials, and the placeholder domain.
- `src/content/thoughts/` - long-form essays in MDX.
- `src/content/notes/` - shorter linked notes in Markdown.
- `src/content/bookmarks/` - saved links with commentary.
- `src/content/bookshelf/` - books, reading status, and optional book notes.
- `src/content/projects/` - project index entries and detail pages in MDX.
- `src/content/pages/` - About, Uses, and Now singleton content.
- `src/pages/` - Astro routes, feeds, OG images, search, and static pages.
- `src/styles/global.css` - design tokens, typography, layout, print, and responsive styles.
- `src/lib/` - dates, feeds, backlinks, reading time, OG rendering, and Markdown helpers.

## Add a Thought

Create an MDX file in `src/content/thoughts/`, for example `src/content/thoughts/my-essay.mdx`.

````mdx
---
title: My Essay
description: A short description for indexes, feeds, and metadata.
publishedAt: 2026-05-24
updatedAt: 2026-05-30
tags:
  - engineering
draft: false
math: false
toc: false
---

Your essay starts here.

```ts title="example.ts"
export function hello(name: string) {
  return `Hello, ${name}`;
}
```
````

Set `draft: true` to keep the Thought out of rendered pages and feeds.

## Add a Note

Create a Markdown file in `src/content/notes/`, for example `src/content/notes/local-first.md`.

```md
---
title: Local-first tools
plantedAt: 2026-05-01
tendedAt: 2026-05-24
stage: budding
description: A short optional description.
draft: false
---

Notes can link to each other with [[quiet-abstractions]] syntax.
Backlinks are generated automatically on note detail pages.
```

Valid `stage` values are `seedling`, `budding`, and `evergreen`.

## Add a Bookmark

Create a Markdown file in `src/content/bookmarks/`, for example `src/content/bookmarks/good-link.md`.

```md
---
title: Good Link
url: https://example.com/article
author: Example Author
source: Example Site
savedAt: 2026-05-24
tags:
  - engineering
  - tools
draft: false
---

One to three sentences of commentary about why this is worth keeping.
```

`author` and `source` are optional. Tags generate filtered pages at `/bookmarks/tag/[tag]`.

## Add a Book

Create a Markdown file in `src/content/bookshelf/`, for example `src/content/bookshelf/example-book.md`.

```md
---
title: Example Book
author: Example Author
status: read
startedAt: 2026-04-01
finishedAt: 2026-05-10
rating: recommended
cover: /covers/example-book.jpg
isbn: "9780000000000"
hasNotes: true
recommendedBy: Someone
tags:
  - systems
draft: false
---

Notes about the book go here. This detail page is generated only when
`hasNotes: true`.
```

Valid `status` values are `reading`, `read`, and `abandoned`.

Valid `rating` values are `recommended` and `formative`. Omit `rating` if neither applies.

Books with `status: reading` populate the home page and Now page reading lines automatically.

## Add a Project

Create an MDX file in `src/content/projects/`, for example `src/content/projects/example-project.mdx`.

```mdx
---
title: Example Project
description: A concise description of the project.
category: experiments
year: 2026
role: solo
status: live
tech:
  - Astro
  - Go
links:
  - label: live
    href: https://example.com
draft: false
---

Case study body goes here.
```

Valid `category` values are `live`, `past`, `experiments`, and `failures`.

Valid `status` values are `live`, `archived`, and `wip`.

## Update About, Uses, and Now

Edit these singleton files:

- `src/content/pages/about.mdx`
- `src/content/pages/uses.mdx`
- `src/content/pages/now.mdx`

The Now page's Reading line is generated from Bookshelf entries with `status: reading`.

## Deploy to Cloudflare Pages

1. Connect the GitHub repository to Cloudflare Pages.
2. Set the build command to `npm run build`.
3. Set the build output directory to `dist`.
4. Use Node.js 20 or newer.
5. No environment variables are required for v1.

## Swap the Placeholder Domain

Edit `src/config.ts` and replace the `SITE.domain` and `SITE.url` values:

```ts
domain: "yoursite.com",
url: "https://yoursite.com",
```

Feeds, canonical URLs, sitemap, robots.txt, and OG image labels read from this config.

## Add Mastodon or Bluesky Later

Add the new URL to `SITE.socials` in `src/config.ts`, then render it in:

- `src/components/Footer.astro`
- `src/pages/about.astro`

Keep the label lowercase and mono to match the existing social row.
