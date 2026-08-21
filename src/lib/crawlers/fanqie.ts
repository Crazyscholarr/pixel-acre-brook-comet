import { applyFontMap, cleanText, splitForAudio } from "@/lib/processors/cleaner";
import type { CrawledDraft } from "@/lib/stories/types";
import { extractLikelyArticle, extractTitle, fetchUrl } from "./fetch";

export async function crawlFanqie(opts: {
  maxItems: number;
  url?: string;
  books?: string;
  fontMap?: Record<string, string>;
}): Promise<{ drafts: CrawledDraft[]; note: string; live: boolean }> {
  const targets = [
    opts.url,
    ...(opts.books
      ? opts.books
          .split(/[\n,]+/)
          .map((s) => s.trim())
          .filter(Boolean)
      : []),
  ].filter((u): u is string => Boolean(u));

  if (!targets.length) {
    return {
      drafts: [],
      live: false,
      note: "Chưa có URL sách/chương Fanqie. Dán link chương ở mục Thu thập.",
    };
  }

  const drafts: CrawledDraft[] = [];
  for (const url of targets) {
    const res = await fetchUrl(url);
    if (!res.ok) continue;
    let raw = cleanText(extractLikelyArticle(res.text));
    if (opts.fontMap) raw = applyFontMap(raw, opts.fontMap);
    if (raw.length < 80) continue;
    const parts = splitForAudio(raw);
    const title = extractTitle(res.text) || "番茄小说";
    for (const part of parts.slice(0, opts.maxItems - drafts.length)) {
      drafts.push({
        source: "fanqie",
        sourceUrl: url,
        titleOriginal:
          parts.length > 1 ? `${title} · phần ${part.index}` : title,
        rawContent: part.content,
        language: "zh",
        tags: ["dài kỳ", `phần ${part.index}`],
      });
    }
    if (drafts.length >= opts.maxItems) break;
  }

  return {
    drafts,
    live: drafts.length > 0,
    note: drafts.length
      ? `Lấy ${drafts.length} phần Fanqie (cắt ~1.5 giờ audio / phần).`
      : "Fanqie chặn trích xuất (font chống copy). Cần font map hoặc dán văn bản tay.",
  };
}
