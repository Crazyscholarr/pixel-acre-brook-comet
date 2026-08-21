import { cleanText } from "@/lib/processors/cleaner";
import type { CrawledDraft } from "@/lib/stories/types";
import { extractLikelyArticle, extractTitle, fetchUrl } from "./fetch";

function extractZhihuBody(html: string): string {
  const rich = html.match(
    /<div[^>]+class="[^"]*RichText[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  );
  if (rich?.[1]) return rich[1];
  return extractLikelyArticle(html);
}

export async function crawlZhihu(opts: {
  maxItems: number;
  cookie?: string;
  url?: string;
  columns?: string;
}): Promise<{ drafts: CrawledDraft[]; note: string; live: boolean }> {
  const drafts: CrawledDraft[] = [];
  const cookie = opts.cookie?.trim();
  const targets: string[] = [];
  if (opts.url) targets.push(opts.url);
  if (opts.columns) {
    opts.columns
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((u) => targets.push(u));
  }
  if (!targets.length) {
    targets.push("https://www.zhihu.com/xen/market/column");
  }

  if (!cookie) {
    return {
      drafts: [],
      live: false,
      note: "Zhihu 盐选 cần cookie đăng nhập để lấy bài đủ. Thêm cookie ở Cài đặt rồi thu thập lại.",
    };
  }

  for (const url of targets) {
    if (drafts.length >= opts.maxItems) break;
    const res = await fetchUrl(url, { cookie });
    if (!res.ok) continue;

    if (/zhihu\.com\/(p|question|zhuanlan|market)/.test(url)) {
      const raw = cleanText(extractZhihuBody(res.text));
      if (raw.length > 80) {
        drafts.push({
          source: "zhihu",
          sourceUrl: url,
          titleOriginal: extractTitle(res.text) || "盐选故事",
          rawContent: raw,
          language: "zh",
          tags: ["盐选"],
        });
        continue;
      }
    }

    const links = [
      ...res.text.matchAll(/href=["'](https?:\/\/zhuanlan\.zhihu\.com\/p\/\d+)["']/g),
      ...res.text.matchAll(/href=["'](\/\/www\.zhihu\.com\/p\/\d+)["']/g),
    ]
      .map((m) => (m[1]!.startsWith("http") ? m[1]! : `https:${m[1]}`));
    for (const link of [...new Set(links)]) {
      if (drafts.length >= opts.maxItems) break;
      const page = await fetchUrl(link, { cookie });
      if (!page.ok) continue;
      const raw = cleanText(extractZhihuBody(page.text));
      if (raw.length < 80) continue;
      drafts.push({
        source: "zhihu",
        sourceUrl: link,
        titleOriginal: extractTitle(page.text) || "盐选故事",
        rawContent: raw,
        language: "zh",
        tags: ["盐选"],
      });
    }
  }

  return {
    drafts,
    live: drafts.length > 0,
    note: drafts.length
      ? `Lấy ${drafts.length} bài Zhihu bằng cookie đã cung cấp.`
      : "Cookie không đủ quyền hoặc Zhihu chặn máy chủ. Dùng bản mẫu để làm việc tiếp.",
  };
}
