import type { CollectionEntry } from "astro:content";

type Note = CollectionEntry<"notes">;

const wikilinkPattern = /\[\[([a-z0-9][a-z0-9-_/]*)\]\]/gi;

export function extractWikilinks(markdown: string): string[] {
  return [...markdown.matchAll(wikilinkPattern)]
    .map((match) => match[1])
    .filter((slug): slug is string => slug !== undefined);
}

export function backlinksFor(notes: Note[], targetSlug: string): Note[] {
  return notes
    .filter((note) => note.slug !== targetSlug && extractWikilinks(note.body).includes(targetSlug))
    .sort((a, b) => b.data.tendedAt.getTime() - a.data.tendedAt.getTime());
}
