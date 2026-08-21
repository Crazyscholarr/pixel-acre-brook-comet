export const SOURCE_IDS = [
  "zhihu",
  "i660",
  "fanqie",
  "reddit_aita",
  "manual",
] as const;

export type SourceId = (typeof SOURCE_IDS)[number];

export const STORY_STATUSES = [
  "raw",
  "cleaned",
  "localized",
  "exported",
] as const;

export type StoryStatus = (typeof STORY_STATUSES)[number];

export type StoryLanguage = "zh" | "en" | "vi";

export interface NameMapEntry {
  original: string;
  localized: string;
}

export interface Story {
  id: string;
  source: SourceId;
  sourceUrl?: string;
  titleOriginal: string;
  titleLocalized: string;
  rawContent: string;
  cleanedContent: string;
  localizedContent: string;
  language: StoryLanguage;
  status: StoryStatus;
  blockedHits: string[];
  nameMap: NameMapEntry[];
  placeMap: NameMapEntry[];
  createdAt: string;
  updatedAt: string;
  tags: string[];
  wordCount: number;
  notes?: string;
  crawlNote?: string;
}

export interface SourceConfig {
  enabled: boolean;
  maxItems: number;
  cookie?: string;
  columns?: string;
  categories?: number[];
  books?: string;
  sort?: "hot" | "top" | "new";
}

export interface AppSettings {
  sources: Record<Exclude<SourceId, "manual">, SourceConfig>;
  blockedKeywords: string[];
  extraMaleNames: string[];
  extraFemaleNames: string[];
  extraVillages: string[];
  seed: number;
}

export interface CrawlRequest {
  source: Exclude<SourceId, "manual">;
  maxItems: number;
  cookie?: string;
  url?: string;
  categories?: number[];
  sort?: "hot" | "top" | "new";
}

export interface CrawledDraft {
  source: SourceId;
  sourceUrl?: string;
  titleOriginal: string;
  rawContent: string;
  language: StoryLanguage;
  tags: string[];
  crawlNote?: string;
  translatedTitle?: string;
  translatedBody?: string;
}

export interface CrawlResult {
  ok: boolean;
  source: SourceId;
  usedFallback: boolean;
  message: string;
  drafts: CrawledDraft[];
}

export interface LocalizeResult {
  titleLocalized: string;
  localizedContent: string;
  blockedHits: string[];
  nameMap: NameMapEntry[];
  placeMap: NameMapEntry[];
}

export const SOURCE_META: Record<
  SourceId,
  { label: string; short: string; language: string; kind: string }
> = {
  zhihu: {
    label: "Zhihu 盐选",
    short: "Zhihu",
    language: "Trung",
    kind: "Truyện ngắn gia đình",
  },
  i660: {
    label: "660i 故事大全",
    short: "660i",
    language: "Trung",
    kind: "Dân gian & ma",
  },
  fanqie: {
    label: "番茄小说",
    short: "Fanqie",
    language: "Trung",
    kind: "Truyện dài kỳ",
  },
  reddit_aita: {
    label: "Reddit AITA",
    short: "Reddit",
    language: "Anh",
    kind: "Mâu thuẫn đời thật",
  },
  manual: {
    label: "Nhập tay",
    short: "Tay",
    language: "Tùy chọn",
    kind: "Dán URL hoặc văn bản",
  },
};

export const STATUS_META: Record<StoryStatus, { label: string }> = {
  raw: { label: "Chưa xử lý" },
  cleaned: { label: "Đã làm sạch" },
  localized: { label: "Đã Việt hóa" },
  exported: { label: "Đã xuất" },
};
