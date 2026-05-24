import { getCollection, type CollectionEntry } from "astro:content";

import { ogPng, pngResponse } from "../../../lib/og";

type Thought = CollectionEntry<"thoughts">;

interface Props {
  thought: Thought;
}

export async function getStaticPaths() {
  const thoughts = (await getCollection("thoughts")).filter((thought) => !thought.data.draft);

  return thoughts.map((thought) => ({
    params: { slug: thought.slug },
    props: { thought },
  }));
}

export async function GET({ props }: { props: Props }) {
  return pngResponse(await ogPng({ title: props.thought.data.title, date: props.thought.data.publishedAt }));
}
