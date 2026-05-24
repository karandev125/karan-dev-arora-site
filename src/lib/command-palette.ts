import { getCollection } from "astro:content";

import projectsIndex from "../content/projects-index.json";

export type CommandCategory = "Thoughts" | "Notes" | "Bookmarks" | "Projects" | "Books";

export interface CommandPaletteItem {
  title: string;
  url: string;
  category: CommandCategory;
  snippet: string;
  keywords: string;
}

interface ProjectIndexEntry {
  category: "live" | "past" | "experiments" | "failures";
  name: string;
  year: number;
  description: string;
  links: { label: string; href: string }[];
  caseStudy?: string;
}

function normalize(value: string): string {
  return value.toLowerCase();
}

export async function getCommandPaletteItems(): Promise<CommandPaletteItem[]> {
  const thoughts = (await getCollection("thoughts"))
    .filter((thought) => !thought.data.draft)
    .map((thought) => ({
      title: thought.data.title,
      url: `/thoughts/${thought.slug}`,
      category: "Thoughts" as const,
      snippet: thought.data.description,
      keywords: normalize([thought.data.title, thought.data.description, thought.data.tags?.join(" ")].filter(Boolean).join(" ")),
    }));
  const notes = (await getCollection("notes")).filter((note) => !note.data.draft).map((note) => ({
    title: note.data.title,
    url: `/notes/${note.slug}`,
    category: "Notes" as const,
    snippet: note.data.description ?? note.body.trim().slice(0, 140),
    keywords: normalize([note.data.title, note.data.description, note.body].filter(Boolean).join(" ")),
  }));
  const bookmarks = (await getCollection("bookmarks"))
    .filter((bookmark) => !bookmark.data.draft)
    .map((bookmark) => ({
      title: bookmark.data.title,
      url: bookmark.data.url,
      category: "Bookmarks" as const,
      snippet: bookmark.body.trim(),
      keywords: normalize(
        [bookmark.data.title, bookmark.data.author, bookmark.data.source, bookmark.data.tags.join(" "), bookmark.body]
          .filter(Boolean)
          .join(" "),
      ),
    }));
  const books = (await getCollection("bookshelf")).filter((book) => !book.data.draft).map((book) => ({
    title: book.data.title,
    url: book.data.hasNotes ? `/bookshelf/${book.slug}` : "/bookshelf",
    category: "Books" as const,
    snippet: book.data.author,
    keywords: normalize([book.data.title, book.data.author, book.data.status, book.data.tags?.join(" ")].filter(Boolean).join(" ")),
  }));
  const projects = (projectsIndex as ProjectIndexEntry[]).map((project) => ({
    title: project.name,
    url: project.caseStudy ? `/projects/${project.caseStudy}` : "/projects",
    category: "Projects" as const,
    snippet: project.description,
    keywords: normalize([project.name, project.description, project.category, String(project.year)].join(" ")),
  }));

  return [...thoughts, ...notes, ...bookmarks, ...projects, ...books];
}
