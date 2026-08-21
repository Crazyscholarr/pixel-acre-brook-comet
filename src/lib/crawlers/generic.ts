import { cleanText } from "@/lib/processors/cleaner";
import { detectLanguage } from "@/lib/processors/translator";
import type { CrawledDraft, SourceId } from "@/lib/stories/types";
import { extractLikelyArticle, extractTitle, fetchUrl } from "./fetch";

export function sourceFromUrl(url: string): SourceId {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("zhihu.com")) return "zhihu";
    if (host.includes("660i.com")) return "i660";
    if (host.includes("fanqie") || host.includes("fqnovel") || host.includes("toutiao"))
      return "fanqie";
    if (host.includes("reddit.com")) return "reddit_aita";
  } catch {
    /* ignore */
  }
  return "manual";
}

export async function crawlGenericUrl(
  url: string,
  cookie?: string,
): Promise<{ draft: CrawledDraft | null; note: string }> {
  const res = await fetchUrl(url, { cookie });
  if (!res.ok) {
    return {
      draft: null,
      note: `Không tải được liên kết (mã ${res.status || "timeout"}).`,
    };
  }
  const raw = cleanText(extractLikelyArticle(res.text));
  if (raw.length < 40) {
    return { draft: null, note: "Trang không có đoạn văn đủ dài để lấy." };
  }
  const source = sourceFromUrl(url);
  return {
    draft: {
      source,
      sourceUrl: url,
      titleOriginal: extractTitle(res.text) || url,
      rawContent: raw,
      language: detectLanguage(raw),
      tags: ["url"],
    },
    note: "Đã lấy nội dung từ liên kết.",
  };
}
