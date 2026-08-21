import type { CrawledDraft } from "@/lib/stories/types";
import { fetchUrl } from "./fetch";

interface RedditChild {
  data?: {
    title?: string;
    selftext?: string;
    permalink?: string;
    stickied?: boolean;
    over_18?: boolean;
    link_flair_text?: string;
  };
}

export async function crawlReddit(opts: {
  maxItems: number;
  sort?: "hot" | "top" | "new";
}): Promise<{ drafts: CrawledDraft[]; note: string; live: boolean }> {
  const sort = opts.sort ?? "hot";
  const urls = [
    `https://www.reddit.com/r/AmItheAsshole/${sort}.json?limit=${Math.min(opts.maxItems + 3, 25)}`,
    `https://old.reddit.com/r/AmItheAsshole/${sort}.json?limit=${Math.min(opts.maxItems + 3, 25)}`,
  ];
  for (const url of urls) {
    const res = await fetchUrl(url, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) continue;
    try {
      const json = JSON.parse(res.text) as {
        data?: { children?: RedditChild[] };
      };
      const children = json.data?.children ?? [];
      const drafts: CrawledDraft[] = [];
      for (const child of children) {
        const d = child.data;
        if (!d?.title || d.stickied || d.over_18) continue;
        const body = (d.selftext ?? "").trim();
        if (body.length < 80) continue;
        drafts.push({
          source: "reddit_aita",
          sourceUrl: d.permalink
            ? `https://www.reddit.com${d.permalink}`
            : undefined,
          titleOriginal: d.title,
          rawContent: body,
          language: "en",
          tags: d.link_flair_text ? [d.link_flair_text] : ["AITA"],
        });
        if (drafts.length >= opts.maxItems) break;
      }
      if (drafts.length) {
        return {
          drafts,
          live: true,
          note: `Lấy ${drafts.length} bài từ r/AmItheAsshole (${sort}).`,
        };
      }
    } catch {
      /* try next */
    }
  }
  return { drafts: [], live: false, note: "Reddit chặn truy cập từ máy chủ này." };
}
