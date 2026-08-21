import {
  DEFAULT_BLOCK_RULES,
  type BlockRule,
} from "@/lib/data/blocked-keywords";
import {
  CHINESE_SURNAMES,
  ENGLISH_FEMALE,
  ENGLISH_MALE,
  PLACE_REPLACEMENTS,
} from "@/lib/data/place-maps";
import { femaleName, maleName } from "@/lib/data/vietnamese-names";
import { VILLAGES } from "@/lib/data/vietnamese-villages";
import type { LocalizeResult, NameMapEntry } from "@/lib/stories/types";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hashSeed(s: string, salt: number): number {
  let h = salt | 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function applyMap(
  text: string,
  pairs: Array<[string, string]>,
): { text: string; hits: NameMapEntry[] } {
  const hits: NameMapEntry[] = [];
  let out = text;
  const seen = new Set<string>();
  const sorted = [...pairs].sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of sorted) {
    if (!from || from === to) continue;
    const re = new RegExp(escapeRegExp(from), "gi");
    if (!re.test(out)) continue;
    re.lastIndex = 0;
    out = out.replace(re, to);
    const key = from.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      hits.push({ original: from, localized: to });
    }
  }
  return { text: out, hits };
}

function extractChineseNames(text: string): string[] {
  const found = new Set<string>();
  const surname = CHINESE_SURNAMES.join("");
  const re = new RegExp(`[${surname}][\u4e00-\u9fff]{1,2}`, "g");
  const skip = new Set([
    "上海",
    "南京",
    "长沙",
    "青岛",
    "重庆",
    "东西",
    "自己",
    "什么",
    "可以",
    "因为",
    "所以",
    "但是",
    "如果",
    "已经",
    "还是",
    "一个",
    "我们",
    "他们",
    "你们",
    "这个",
    "那个",
    "时候",
    "现在",
    "今天",
    "明天",
    "昨天",
    "公司",
    "工作",
    "生活",
    "家庭",
    "孩子",
    "老婆",
    "老公",
    "丈夫",
    "妻子",
    "母亲",
    "父亲",
  ]);
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const name = m[0];
    if (skip.has(name) || name.length < 2) continue;
    found.add(name);
  }
  return [...found];
}

function extractEnglishNames(text: string): { male: string[]; female: string[] } {
  const male: string[] = [];
  const female: string[] = [];
  const seen = new Set<string>();
  for (const n of ENGLISH_MALE) {
    const re = new RegExp(`\\b${escapeRegExp(n)}\\b`, "g");
    if (re.test(text) && !seen.has(n.toLowerCase())) {
      seen.add(n.toLowerCase());
      male.push(n);
    }
  }
  for (const n of ENGLISH_FEMALE) {
    const re = new RegExp(`\\b${escapeRegExp(n)}\\b`, "g");
    if (re.test(text) && !seen.has(n.toLowerCase())) {
      seen.add(n.toLowerCase());
      female.push(n);
    }
  }
  return { male, female };
}

export interface LocalizeOptions {
  seed?: number;
  extraBlocked?: string[];
  extraRules?: BlockRule[];
  extraVillages?: string[];
}

export function localizeStory(
  title: string,
  content: string,
  options: LocalizeOptions = {},
): LocalizeResult {
  const seed = options.seed ?? 17;
  const villages = options.extraVillages?.length
    ? [...VILLAGES, ...options.extraVillages]
    : VILLAGES;

  const namePairs: Array<[string, string]> = [];
  const zhNames = extractChineseNames(`${title}\n${content}`);
  zhNames.forEach((n, i) => {
    const femaleBias =
      /[娜芳丽娟敏静燕艳红梅雪玲云霞琴婷璐莹慧娟]/u.test(n) || i % 2 === 1;
    const vn = femaleBias ? femaleName(seed + i * 13) : maleName(seed + i * 17);
    namePairs.push([n, vn]);
  });

  const en = extractEnglishNames(`${title}\n${content}`);
  en.male.forEach((n, i) => namePairs.push([n, maleName(seed + 80 + i * 11)]));
  en.female.forEach((n, i) =>
    namePairs.push([n, femaleName(seed + 180 + i * 11)]),
  );

  const placePairs: Array<[string, string]> = PLACE_REPLACEMENTS.map(
    ([a, b]) => [a, b] as [string, string],
  );
  const fallbackVillage = villages[seed % villages.length]!;
  placePairs.push(["in the city", `ở ${fallbackVillage}`]);
  placePairs.push(["the city", fallbackVillage]);

  let workingTitle = title;
  let working = content;

  const names = applyMap(working, namePairs);
  working = names.text;
  const titleNames = applyMap(workingTitle, namePairs);
  workingTitle = titleNames.text;

  const places = applyMap(working, placePairs);
  working = places.text;
  const titlePlaces = applyMap(workingTitle, placePairs);
  workingTitle = titlePlaces.text;

  const rules: BlockRule[] = [
    ...DEFAULT_BLOCK_RULES,
    ...(options.extraRules ?? []),
    ...(options.extraBlocked ?? []).map((p) => ({
      pattern: p,
      replacement: "",
    })),
  ].sort((a, b) => b.pattern.length - a.pattern.length);

  const blockedHits: string[] = [];
  for (const rule of rules) {
    const re = new RegExp(escapeRegExp(rule.pattern), "gi");
    if (re.test(working) || re.test(workingTitle)) {
      blockedHits.push(rule.pattern);
      re.lastIndex = 0;
      working = working.replace(re, rule.replacement);
      workingTitle = workingTitle.replace(re, rule.replacement);
    }
  }

  working = working.replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  workingTitle = workingTitle.replace(/\s{2,}/g, " ").trim();

  const nameMap = dedupeEntries([
    ...titleNames.hits,
    ...names.hits,
  ]);
  const placeMap = dedupeEntries([...titlePlaces.hits, ...places.hits]);

  return {
    titleLocalized: workingTitle || title,
    localizedContent: working,
    blockedHits: [...new Set(blockedHits)],
    nameMap,
    placeMap,
  };
}

function dedupeEntries(entries: NameMapEntry[]): NameMapEntry[] {
  const seen = new Set<string>();
  const out: NameMapEntry[] = [];
  for (const e of entries) {
    const k = e.original.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(e);
  }
  return out;
}

export function highlightBlocked(text: string, keywords: string[]): string {
  // Used only for counts / inspection, not HTML injection.
  return keywords.filter((k) =>
    new RegExp(escapeRegExp(k), "i").test(text),
  ).join(", ");
}
