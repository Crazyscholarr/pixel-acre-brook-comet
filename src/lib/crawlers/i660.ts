import { cleanText } from "@/lib/processors/cleaner";
import type { CrawledDraft } from "@/lib/stories/types";
import { extractLikelyArticle, extractTitle, fetchUrl } from "./fetch";

const CATEGORY_LABEL: Record<number, string> = {
  703: "民间故事",
  710: "鬼故事",
};

function parseListLinks(html: string, limit: number): string[] {
  const hrefs = [
    ...html.matchAll(/href=["']([^"']+(?:story|article|post|view)[^"']*)["']/gi),
  ]
    .map((m) => m[1] ?? "")
    .filter(Boolean);
  const abs = hrefs.map((h) => {
    if (h.startsWith("http")) return h;
    if (h.startsWith("//")) return `https:${h}`;
    if (h.startsWith("/")) return `https://660i.com${h}`;
    return `https://660i.com/${h}`;
  });
  return [...new Set(abs)].slice(0, limit);
}

export async function crawl660i(opts: {
  maxItems: number;
  categories?: number[];
}): Promise<{ drafts: CrawledDraft[]; note: string; live: boolean }> {
  const cats = (opts.categories?.length ? opts.categories : [703, 710]).filter(
    (c) => c === 703 || c === 710,
  );
  const drafts: CrawledDraft[] = [];
  const tried: string[] = [];

  for (const cat of cats) {
    if (drafts.length >= opts.maxItems) break;
    const listUrls = [
      `https://660i.com/story?cat=${cat}`,
      `https://www.660i.com/story/cat_${cat}`,
      `https://660i.com/list/${cat}`,
    ];
    for (const listUrl of listUrls) {
      const res = await fetchUrl(listUrl);
      tried.push(`${listUrl} → ${res.status}`);
      if (!res.ok || res.text.length < 200) continue;
      const links = parseListLinks(
        res.text,
        opts.maxItems - drafts.length + 2,
      );
      for (const link of links) {
        if (drafts.length >= opts.maxItems) break;
        const page = await fetchUrl(link);
        if (!page.ok) continue;
        const raw = cleanText(extractLikelyArticle(page.text));
        if (raw.length < 120) continue;
        drafts.push({
          source: "i660",
          sourceUrl: link,
          titleOriginal: extractTitle(page.text) || `故事 ${drafts.length + 1}`,
          rawContent: raw,
          language: "zh",
          tags: [CATEGORY_LABEL[cat] ?? String(cat)],
        });
      }
      if (drafts.length) break;
    }
  }

  return {
    drafts,
    live: drafts.length > 0,
    note: drafts.length
      ? `Lấy ${drafts.length} truyện từ 660i (chỉ cat 703 & 710).`
      : `Không vào được 660i.com (${tried.slice(0, 3).join("; ")}).`,
  };
}
