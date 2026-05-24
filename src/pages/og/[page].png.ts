import { ogPng, pngResponse } from "../../lib/og";

interface StaticOgPage {
  page: string;
  title: string;
}

const pages: StaticOgPage[] = [
  { page: "home", title: "Karan Dev Arora" },
  { page: "thoughts", title: "Thoughts" },
  { page: "bookshelf", title: "Bookshelf" },
  { page: "projects", title: "Projects" },
  { page: "notes", title: "Notes" },
  { page: "bookmarks", title: "Bookmarks" },
  { page: "uses", title: "Uses" },
  { page: "about", title: "About" },
  { page: "now", title: "Now" },
  { page: "feeds", title: "Feeds" },
  { page: "search", title: "Search" },
];

interface Props {
  title: string;
}

export function getStaticPaths() {
  return pages.map((page) => ({
    params: { page: page.page },
    props: { title: page.title },
  }));
}

export async function GET({ props }: { props: Props }) {
  return pngResponse(await ogPng({ title: props.title }));
}
