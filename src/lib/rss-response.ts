import rss from "@astrojs/rss";

import { SITE } from "../config";
import { feedUrl, getSiteFeed, type FeedName } from "./feed-data";

export async function rssResponse(name: FeedName): Promise<Response> {
  const feed = await getSiteFeed(name);

  return rss({
    title: feed.title,
    description: feed.description,
    site: SITE.url,
    items: feed.items.map((item) => ({
      title: item.title,
      description: item.description,
      link: item.link,
      pubDate: item.pubDate,
      categories: item.tags,
    })),
    customData: `<language>en</language><atom:link href="${feedUrl(feed.rssPath)}" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom" />`,
  });
}
