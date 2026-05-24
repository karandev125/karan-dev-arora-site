import { rssResponse } from "../../lib/rss-response";

export function GET() {
  return rssResponse("notes");
}
