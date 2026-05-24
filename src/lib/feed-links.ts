import { SITE } from "../config";

interface FeedAlternate {
  title: string;
  type: "application/rss+xml" | "application/feed+json";
  href: string;
}

function sectionFeed(pathname: string): { label: string; slug: string } | undefined {
  if (pathname.startsWith("/thoughts")) {
    return { label: "Thoughts", slug: "thoughts" };
  }

  if (pathname.startsWith("/notes")) {
    return { label: "Notes", slug: "notes" };
  }

  if (pathname.startsWith("/bookmarks")) {
    return { label: "Bookmarks", slug: "bookmarks" };
  }

  if (pathname.startsWith("/bookshelf")) {
    return { label: "Bookshelf", slug: "bookshelf" };
  }

  return undefined;
}

export function feedAlternatesFor(pathname: string): FeedAlternate[] {
  const alternates: FeedAlternate[] = [
    { title: `${SITE.name} RSS`, type: "application/rss+xml", href: "/rss.xml" },
    { title: `${SITE.name} JSON Feed`, type: "application/feed+json", href: "/feeds/all.json" },
  ];
  const section = sectionFeed(pathname);

  if (section) {
    alternates.push(
      {
        title: `${SITE.name} / ${section.label} RSS`,
        type: "application/rss+xml",
        href: `/${section.slug}/rss.xml`,
      },
      {
        title: `${SITE.name} / ${section.label} JSON Feed`,
        type: "application/feed+json",
        href: `/feeds/${section.slug}.json`,
      },
    );
  }

  return alternates;
}
