import { SITE } from "../../config";
import { feedUrl, getAllFeedMeta, getSiteFeed, type FeedName } from "../../lib/feed-data";

interface Params {
  name: FeedName;
}

export function getStaticPaths() {
  return getAllFeedMeta().map((feed) => ({
    params: { name: feed.name },
  }));
}

export async function GET({ params }: { params: Params }) {
  const feed = await getSiteFeed(params.name);
  const body = {
    version: "https://jsonfeed.org/version/1.1",
    title: feed.title,
    home_page_url: SITE.url,
    feed_url: feedUrl(feed.jsonPath),
    description: feed.description,
    authors: [{ name: SITE.author, url: SITE.url }],
    language: "en",
    items: feed.items.map((item) => ({
      id: item.id,
      url: item.link,
      title: item.title,
      summary: item.description,
      content_text: item.description,
      date_published: item.pubDate.toISOString(),
      tags: item.tags,
    })),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
    },
  });
}
