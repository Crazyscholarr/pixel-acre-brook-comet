export const UA =
  "Mozilla/5.0 (compatible; LangKe/1.0; +https://grok.com) AppleWebKit/537.36 Chrome/120.0.0.0";

export async function fetchUrl(
  url: string,
  init: RequestInit & { cookie?: string } = {},
): Promise<{ ok: boolean; status: number; text: string; finalUrl: string }> {
  const headers = new Headers(init.headers);
  if (!headers.has("User-Agent")) headers.set("User-Agent", UA);
  if (!headers.has("Accept")) {
    headers.set("Accept", "text/html,application/json;q=0.9,*/*;q=0.8");
  }
  if (init.cookie) headers.set("Cookie", init.cookie);
  try {
    const res = await fetch(url, {
      ...init,
      headers,
      redirect: "follow",
      signal: init.signal ?? AbortSignal.timeout(14000),
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text, finalUrl: res.url };
  } catch {
    return { ok: false, status: 0, text: "", finalUrl: url };
  }
}

export function extractLikelyArticle(html: string): string {
  const candidates = [
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]+class="[^"]*(?:content|article|post|story|RichText)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]+id="[^"]*(?:content|article|post|main)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ];
  for (const re of candidates) {
    const m = html.match(re);
    if (m?.[1] && m[1].length > 200) return m[1];
  }
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
  const pBits = [...stripped.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => m[1] ?? "")
    .filter((t) => t.replace(/<[^>]+>/g, "").trim().length > 40);
  if (pBits.length >= 3) return pBits.join("\n");
  return stripped;
}

export function extractTitle(html: string): string {
  const og = html.match(
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i,
  );
  if (og?.[1]) return og[1];
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return (t?.[1] ?? "").replace(/\s+/g, " ").trim();
}
