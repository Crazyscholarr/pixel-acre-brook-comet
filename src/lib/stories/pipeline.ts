import { cleanText } from "@/lib/processors/cleaner";
import { localizeStory } from "@/lib/processors/localizer";
import { detectLanguage } from "@/lib/processors/translator";
import { uid, wordCount } from "@/lib/utils";
import type { AppSettings, CrawledDraft, Story } from "./types";

export function draftToStory(
  draft: CrawledDraft,
  settings: AppSettings,
  translated?: { title?: string; content: string },
): Story {
  const now = new Date().toISOString();
  const raw = draft.rawContent;
  const sourceText =
    translated?.content ?? draft.translatedBody ?? raw;
  const sourceTitle =
    translated?.title ?? draft.translatedTitle ?? draft.titleOriginal;
  const cleaned = cleanText(sourceText);
  const loc = localizeStory(sourceTitle, cleaned, {
    seed: settings.seed,
    extraBlocked: settings.blockedKeywords,
    extraVillages: settings.extraVillages,
  });
  return {
    id: uid("st"),
    source: draft.source,
    sourceUrl: draft.sourceUrl,
    titleOriginal: draft.titleOriginal,
    titleLocalized: loc.titleLocalized,
    rawContent: raw,
    cleanedContent: cleanText(raw),
    localizedContent: loc.localizedContent,
    language: draft.language || detectLanguage(raw),
    status: "localized",
    blockedHits: loc.blockedHits,
    nameMap: loc.nameMap,
    placeMap: loc.placeMap,
    createdAt: now,
    updatedAt: now,
    tags: draft.tags,
    wordCount: wordCount(loc.localizedContent),
    crawlNote: draft.crawlNote,
  };
}

export function reprocessStory(story: Story, settings: AppSettings): Story {
  const cleaned = cleanText(story.rawContent);
  const loc = localizeStory(story.titleOriginal, cleaned, {
    seed: settings.seed,
    extraBlocked: settings.blockedKeywords,
    extraVillages: settings.extraVillages,
  });
  return {
    ...story,
    cleanedContent: cleaned,
    titleLocalized: loc.titleLocalized,
    localizedContent: loc.localizedContent,
    blockedHits: loc.blockedHits,
    nameMap: loc.nameMap,
    placeMap: loc.placeMap,
    status: story.status === "exported" ? "exported" : "localized",
    wordCount: wordCount(loc.localizedContent),
    updatedAt: new Date().toISOString(),
  };
}

export function applyLocalizedOverlay(
  story: Story,
  overlay: { title: string; content: string },
): Story {
  return {
    ...story,
    titleLocalized: overlay.title.trim() || story.titleLocalized,
    localizedContent: overlay.content.trim(),
    wordCount: wordCount(overlay.content),
    status: "localized",
    updatedAt: new Date().toISOString(),
    notes: story.notes,
  };
}

export function storyToExportJson(stories: Story[]) {
  return stories.map((s) => ({
    id: s.id,
    title: { original: s.titleOriginal, localized: s.titleLocalized },
    source: s.source,
    sourceUrl: s.sourceUrl,
    raw_content: s.rawContent,
    localized_content: s.localizedContent,
    status: s.status,
    blockedHits: s.blockedHits,
    nameMap: s.nameMap,
    placeMap: s.placeMap,
    tags: s.tags,
    wordCount: s.wordCount,
    createdAt: s.createdAt,
  }));
}

export function storiesToTxt(stories: Story[]): string {
  return stories
    .map((s) => {
      const lines = [
        `=== ${s.titleLocalized} ===`,
        `Gốc: ${s.titleOriginal}`,
        `Nguồn: ${s.source}${s.sourceUrl ? ` · ${s.sourceUrl}` : ""}`,
        `Trạng thái: ${s.status} · ${s.wordCount} từ`,
        s.nameMap.length
          ? `Tên: ${s.nameMap.map((n) => `${n.original} → ${n.localized}`).join("; ")}`
          : "",
        s.placeMap.length
          ? `Địa danh: ${s.placeMap.map((n) => `${n.original} → ${n.localized}`).join("; ")}`
          : "",
        "",
        s.localizedContent,
        "",
        "--- Bản gốc ---",
        "",
        s.rawContent,
      ];
      return lines.filter((l) => l !== undefined).join("\n");
    })
    .join("\n\n" + "=".repeat(48) + "\n\n");
}

export function storiesToCsv(stories: Story[]): string {
  const header = [
    "id",
    "title_original",
    "title_localized",
    "source",
    "status",
    "raw_content",
    "localized_content",
    "word_count",
  ];
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = stories.map((s) =>
    [
      s.id,
      s.titleOriginal,
      s.titleLocalized,
      s.source,
      s.status,
      s.rawContent,
      s.localizedContent,
      String(s.wordCount),
    ]
      .map(esc)
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}
