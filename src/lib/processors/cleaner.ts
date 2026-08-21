const AD_MARKERS =
  /(?:广告|advertisement|sponsored|promo\b|click here|点击查看|更多推荐|相关阅读|热门评论)/gi;

const TAG_BLOCK =
  /<(script|style|noscript|iframe|svg|nav|footer|aside)[\s\S]*?<\/\1>/gi;

const A = "&";
const ENTITIES: Record<string, string> = {
  [A + "nbsp;"]: " ",
  [A + "amp;"]: "&",
  [A + "lt;"]: "<",
  [A + "gt;"]: ">",
  [A + "quot;"]: '"',
  [A + "#39;"]: "'",
  [A + "apos;"]: "'",
  [A + "mdash;"]: "\u2014",
  [A + "ndash;"]: "\u2013",
  [A + "hellip;"]: "\u2026",
  [A + "ldquo;"]: "\u201C",
  [A + "rdquo;"]: "\u201D",
};

export function decodeEntities(text: string): string {
  return text
    .replace(/&[a-z]+;|&#\d+;|&#x[0-9a-f]+;/gi, (m) => {
      if (ENTITIES[m.toLowerCase()]) return ENTITIES[m.toLowerCase()]!;
      const dec = m.match(/^&#(\d+);$/);
      if (dec) return String.fromCharCode(Number(dec[1]));
      const hex = m.match(/^&#x([0-9a-f]+);$/i);
      if (hex) return String.fromCharCode(parseInt(hex[1]!, 16));
      return m;
    })
    .replace(/\u00a0/g, " ");
}

export function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(TAG_BLOCK, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|tr|blockquote)>/gi, "\n\n")
      .replace(/<li[^>]*>/gi, "• ")
      .replace(/<[^>]+>/g, " "),
  );
}

export function cleanText(input: string): string {
  let text = input.includes("<") ? stripHtml(input) : decodeEntities(input);
  text = text.replace(AD_MARKERS, "");
  text = text.replace(/https?:\/\/\S+/g, "");
  text = text.replace(/[ \t]+\n/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.replace(/[ \t]{2,}/g, " ");
  return text.trim();
}

/** Fanqie anti-scrape: remap Private Use Area glyphs via a codepoint map. */
export function applyFontMap(
  text: string,
  fontMap: Record<string, string>,
): string {
  if (!fontMap || Object.keys(fontMap).length === 0) return text;
  return text.replace(/[\uE000-\uF8FF]/g, (ch) => fontMap[ch] ?? ch);
}

/** ~1.5 hours of spoken Vietnamese ≈ 12–14k syllables; we split on ~9000 words. */
export function splitForAudio(
  text: string,
  maxWords = 9000,
): { index: number; content: string }[] {
  const paragraphs = text.split(/\n{2,}/);
  const parts: { index: number; content: string }[] = [];
  let buf: string[] = [];
  let count = 0;
  const flush = () => {
    if (!buf.length) return;
    parts.push({ index: parts.length + 1, content: buf.join("\n\n").trim() });
    buf = [];
    count = 0;
  };
  for (const p of paragraphs) {
    const n = p.replace(/[\u4e00-\u9fff]/g, " x ").split(/\s+/).filter(Boolean)
      .length;
    if (count + n > maxWords && buf.length) flush();
    buf.push(p);
    count += n;
  }
  flush();
  return parts.length ? parts : [{ index: 1, content: text }];
}
