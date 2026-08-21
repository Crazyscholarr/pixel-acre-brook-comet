import { createServerFn } from "@tanstack/react-start";
import { crawl660i } from "@/lib/crawlers/i660";
import { crawlFanqie } from "@/lib/crawlers/fanqie";
import { crawlGenericUrl, sourceFromUrl } from "@/lib/crawlers/generic";
import { crawlReddit } from "@/lib/crawlers/reddit";
import { crawlZhihu } from "@/lib/crawlers/zhihu";
import { createSampleStories } from "@/lib/stories/samples";
import type {
  CrawledDraft,
  CrawlRequest,
  CrawlResult,
  SourceId,
} from "@/lib/stories/types";
import { translateGtx } from "@/lib/processors/translator";

function fallbackDrafts(source: SourceId, maxItems: number): CrawledDraft[] {
  return createSampleStories()
    .filter((s) => s.source === source)
    .slice(0, maxItems)
    .map((s) => ({
      source: s.source,
      sourceUrl: s.sourceUrl,
      titleOriginal: s.titleOriginal,
      rawContent: s.rawContent,
      language: s.language,
      tags: s.tags,
      crawlNote: "Nguồn live không lấy được — dùng bản mẫu cùng thể loại.",
    }));
}

async function maybeTranslate(draft: CrawledDraft): Promise<CrawledDraft> {
  if (draft.language === "vi") return draft;
  const sl = draft.language === "zh" ? "zh-CN" : "en";
  const title = await translateGtx(draft.titleOriginal, sl);
  const body = await translateGtx(draft.rawContent.slice(0, 8000), sl);
  if (!body.ok) return draft;
  return {
    ...draft,
    translatedTitle: title.ok ? title.text : draft.titleOriginal,
    translatedBody: body.text,
    crawlNote: [draft.crawlNote, "Đã dịch máy sang tiếng Việt."]
      .filter(Boolean)
      .join(" "),
    tags: draft.tags.includes("đã dịch") ? draft.tags : [...draft.tags, "đã dịch"],
  };
}

export const crawlSourceFn = createServerFn({ method: "POST" })
  .validator((input: CrawlRequest) => input)
  .handler(async ({ data }): Promise<CrawlResult> => {
    const maxItems = Math.max(1, Math.min(data.maxItems ?? 5, 12));
    let drafts: CrawledDraft[] = [];
    let note = "";
    let live = false;

    if (data.source === "reddit_aita") {
      const r = await crawlReddit({ maxItems, sort: data.sort });
      drafts = r.drafts;
      note = r.note;
      live = r.live;
    } else if (data.source === "i660") {
      const r = await crawl660i({
        maxItems,
        categories: data.categories?.filter((c) => c === 703 || c === 710),
      });
      drafts = r.drafts;
      note = r.note;
      live = r.live;
    } else if (data.source === "zhihu") {
      const r = await crawlZhihu({
        maxItems,
        cookie: data.cookie,
        url: data.url,
      });
      drafts = r.drafts;
      note = r.note;
      live = r.live;
    } else if (data.source === "fanqie") {
      const r = await crawlFanqie({ maxItems, url: data.url, books: data.url });
      drafts = r.drafts;
      note = r.note;
      live = r.live;
    }

    let usedFallback = false;
    if (!drafts.length) {
      drafts = fallbackDrafts(data.source, maxItems);
      usedFallback = true;
      note = note
        ? `${note} Đã nạp bản mẫu cùng thể loại để bạn vẫn làm việc được.`
        : "Đã nạp bản mẫu.";
    }

    const translated: CrawledDraft[] = [];
    for (const d of drafts) {
      translated.push(await maybeTranslate(d));
    }

    return {
      ok: translated.length > 0,
      source: data.source,
      usedFallback,
      message: note,
      drafts: translated,
    };
  });

export const importUrlFn = createServerFn({ method: "POST" })
  .validator((input: { url: string; cookie?: string }) => input)
  .handler(async ({ data }): Promise<CrawlResult> => {
    const source = sourceFromUrl(data.url);
    const { draft, note } = await crawlGenericUrl(data.url, data.cookie);
    if (!draft) {
      const fallback = fallbackDrafts(source === "manual" ? "zhihu" : source, 1);
      return {
        ok: fallback.length > 0,
        source,
        usedFallback: true,
        message: `${note} Đã nạp bản mẫu.`,
        drafts: fallback,
      };
    }
    const translated = await maybeTranslate(draft);
    return {
      ok: true,
      source: draft.source,
      usedFallback: false,
      message: note,
      drafts: [translated],
    };
  });
