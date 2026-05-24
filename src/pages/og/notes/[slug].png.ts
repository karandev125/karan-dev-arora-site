import { getCollection, type CollectionEntry } from "astro:content";

import { ogPng, pngResponse } from "../../../lib/og";

type Note = CollectionEntry<"notes">;

interface Props {
  note: Note;
}

export async function getStaticPaths() {
  const notes = (await getCollection("notes")).filter((note) => !note.data.draft);

  return notes.map((note) => ({
    params: { slug: note.slug },
    props: { note },
  }));
}

export async function GET({ props }: { props: Props }) {
  return pngResponse(await ogPng({ title: props.note.data.title, date: props.note.data.tendedAt }));
}
