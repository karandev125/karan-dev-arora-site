import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

import { SITE } from "../config";

export type FeedName = "all" | "thoughts" | "notes" | "bookmarks" | "bookshelf";

export interface SiteFeedItem {
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  category: "Thoughts" | "Notes" | "Bookmarks" | "Books";
  id: string;
  tags?: string[] | undefined;
}

export interface SiteFeed {
  name: FeedName;
  title: string;
  description: string;
  rssPath: string;
  jsonPath: string;
  items: SiteFeedItem[];
}

type Thought = CollectionEntry<"thoughts">;
type Note = CollectionEntry<"notes">;
type Bookmark = CollectionEntry<"bookmarks">;
type Book = CollectionEntry<"bookshelf">;

const feedMeta: Record<FeedName, Omit<SiteFeed, "items">> = {
  all: {
    name: "all",
    title: SITE.name,
    description: "All public writing, notes, links, and books from Karan Dev Arora.",
    rssPath: "/rss.xml",
    jsonPath: "/feeds/all.json",
  },
  thoughts: {
    name: "thoughts",
    title: `${SITE.name} / Thoughts`,
    description: "Essays on engineering, philosophy, and whatever else holds my attention.",
    rssPath: "/thoughts/rss.xml",
    jsonPath: "/feeds/thoughts.json",
  },
  notes: {
    name: "notes",
    title: `${SITE.name} / Notes`,
    description: "Working thoughts. Less polished than essays, more permanent than tweets.",
    rssPath: "/notes/rss.xml",
    jsonPath: "/feeds/notes.json",
  },
  bookmarks: {
    name: "bookmarks",
    title: `${SITE.name} / Bookmarks`,
    description: "Things worth keeping. Curated, not collected.",
    rssPath: "/bookmarks/rss.xml",
    jsonPath: "/feeds/bookmarks.json",
  },
  bookshelf: {
    name: "bookshelf",
    title: `${SITE.name} / Bookshelf`,
    description: "Books I've read, mostly remembered.",
    rssPath: "/bookshelf/rss.xml",
    jsonPath: "/feeds/bookshelf.json",
  },
};

function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, SITE.url).toString();
}

function thoughtItem(thought: Thought): SiteFeedItem {
  return {
    title: thought.data.title,
    description: thought.data.description,
    link: absoluteUrl(`/thoughts/${thought.slug}`),
    pubDate: thought.data.publishedAt,
    category: "Thoughts",
    id: absoluteUrl(`/thoughts/${thought.slug}`),
    tags: thought.data.tags,
  };
}

function noteItem(note: Note): SiteFeedItem {
  return {
    title: note.data.title,
    description: note.data.description ?? note.body.trim().slice(0, 180),
    link: absoluteUrl(`/notes/${note.slug}`),
    pubDate: note.data.tendedAt,
    category: "Notes",
    id: absoluteUrl(`/notes/${note.slug}`),
  };
}

function bookmarkItem(bookmark: Bookmark): SiteFeedItem {
  return {
    title: bookmark.data.title,
    description: bookmark.body.trim(),
    link: bookmark.data.url,
    pubDate: bookmark.data.savedAt,
    category: "Bookmarks",
    id: bookmark.data.url,
    tags: bookmark.data.tags,
  };
}

function bookDate(book: Book): Date | undefined {
  return book.data.finishedAt ?? book.data.startedAt;
}

function bookItem(book: Book): SiteFeedItem | undefined {
  const pubDate = bookDate(book);

  if (!pubDate) {
    return undefined;
  }

  const status = book.data.status === "reading" ? "Reading" : book.data.status === "read" ? "Read" : "Abandoned";
  const link = book.data.hasNotes ? `/bookshelf/${book.slug}` : "/bookshelf";

  return {
    title: `${status}: ${book.data.title}`,
    description: `${book.data.title}, ${book.data.author}`,
    link: absoluteUrl(link),
    pubDate,
    category: "Books",
    id: absoluteUrl(`/bookshelf#${book.slug}`),
    tags: book.data.tags,
  };
}

function sortItems(items: SiteFeedItem[]): SiteFeedItem[] {
  return items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

export async function getFeedItems(name: FeedName): Promise<SiteFeedItem[]> {
  const thoughts = (await getCollection("thoughts"))
    .filter((thought) => !thought.data.draft)
    .map(thoughtItem);
  const notes = (await getCollection("notes")).filter((note) => !note.data.draft).map(noteItem);
  const bookmarks = (await getCollection("bookmarks"))
    .filter((bookmark) => !bookmark.data.draft)
    .map(bookmarkItem);
  const books = (await getCollection("bookshelf"))
    .filter((book) => !book.data.draft)
    .map(bookItem)
    .filter((item): item is SiteFeedItem => item !== undefined);

  if (name === "thoughts") {
    return sortItems(thoughts);
  }

  if (name === "notes") {
    return sortItems(notes);
  }

  if (name === "bookmarks") {
    return sortItems(bookmarks);
  }

  if (name === "bookshelf") {
    return sortItems(books);
  }

  return sortItems([...thoughts, ...notes, ...bookmarks, ...books]);
}

export async function getSiteFeed(name: FeedName): Promise<SiteFeed> {
  return {
    ...feedMeta[name],
    items: await getFeedItems(name),
  };
}

export function getAllFeedMeta(): Array<Omit<SiteFeed, "items">> {
  return Object.values(feedMeta);
}

export function feedUrl(path: string): string {
  return absoluteUrl(path);
}
