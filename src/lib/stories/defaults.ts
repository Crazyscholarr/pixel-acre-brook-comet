import { DEFAULT_BLOCKED_KEYWORDS } from "@/lib/data/blocked-keywords";
import type { AppSettings, SourceConfig } from "./types";

const source = (over: Partial<SourceConfig> = {}): SourceConfig => ({
  enabled: true,
  maxItems: 5,
  ...over,
});

export const DEFAULT_SETTINGS: AppSettings = {
  sources: {
    zhihu: source({
      maxItems: 5,
      cookie: "",
      columns: "",
    }),
    i660: source({
      maxItems: 6,
      categories: [703, 710],
    }),
    fanqie: source({
      maxItems: 4,
      books: "",
    }),
    reddit_aita: source({
      maxItems: 8,
      sort: "hot",
    }),
  },
  blockedKeywords: [...DEFAULT_BLOCKED_KEYWORDS],
  extraMaleNames: [],
  extraFemaleNames: [],
  extraVillages: [],
  seed: 42,
};
