import { defineCollection, z } from "astro:content";

const draft = z.boolean().default(false);

const thoughts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    tags: z.array(z.string()).optional(),
    draft,
    math: z.boolean().default(false),
    toc: z.boolean().optional(),
  }),
});

const bookshelf = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    author: z.string(),
    status: z.enum(["reading", "read", "abandoned"]),
    startedAt: z.date().optional(),
    finishedAt: z.date().optional(),
    rating: z.enum(["recommended", "formative"]).optional(),
    cover: z.string().optional(),
    isbn: z.string().optional(),
    hasNotes: z.boolean().default(false),
    recommendedBy: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft,
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["live", "past", "experiments", "failures"]),
    year: z.number(),
    role: z.string(),
    status: z.enum(["live", "archived", "wip"]),
    tech: z.array(z.string()),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })),
    draft,
  }),
});

const notes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    plantedAt: z.date(),
    tendedAt: z.date(),
    stage: z.enum(["seedling", "budding", "evergreen"]),
    description: z.string().optional(),
    draft,
  }),
});

const bookmarks = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    author: z.string().optional(),
    source: z.string().optional(),
    savedAt: z.date(),
    tags: z.array(z.string()),
    draft,
  }),
});

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    updatedAt: z.date().optional(),
    workingOn: z.string().optional(),
    thinkingAbout: z.string().optional(),
    where: z.string().optional(),
  }),
});

export const collections = {
  thoughts,
  bookshelf,
  projects,
  notes,
  bookmarks,
  pages,
};
