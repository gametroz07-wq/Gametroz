/**
 * One game item from the GameMonetize JSON feed.
 * Field names were observed in the public feed (https://gamemonetize.com/rssfeed.php?format=json)
 * on 2026-10-01. Every value arrives as a string; `tags` is a comma-separated list.
 * Fields are optional here because external data is never trusted to be complete.
 */
export type GameMonetizeGame = {
  id?: string;
  title?: string;
  description?: string;
  instructions?: string;
  /** Embed (iframe) URL. */
  url?: string;
  category?: string;
  tags?: string;
  /** Thumbnail URL (512x384). */
  thumb?: string;
  width?: string;
  height?: string;
};

/** Query parameters documented by the GameMonetize RSS builder (https://gamemonetize.com/rss-builder). */
export type GameMonetizeFeedQuery = {
  category?: string;
  popularity?: "newest" | "most popular" | "hot games" | "best games" | "exclusive games" | "editor picks";
  company?: string;
  amount?: 10 | 20 | 30 | 40 | 100;
};
