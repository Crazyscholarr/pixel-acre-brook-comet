/**
 * Chunked machine translation via the public Google gtx endpoint.
 * Used as a free first pass (Reddit EN→VI, Chinese→VI) before optional xAI rewrite.
 */
const GTX =
  "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t";

const CHUNK = 1800;

function chunkText(text: string, size = CHUNK): string[] {
  if (text.length <= size) return [text];
  const parts: string[] = [];
  let rest = text;
  while (rest.length) {
    if (rest.length <= size) {
      parts.push(rest);
      break;
    }
    let cut = rest.lastIndexOf("\n", size);
    if (cut < size * 0.4) cut = rest.lastIndexOf(" ", size);
    if (cut < size * 0.4) cut = size;
    parts.push(rest.slice(0, cut));
    rest = rest.slice(cut).trimStart();
  }
  return parts;
}

export async function translateGtx(
  text: string,
  sourceLang: "en" | "zh-CN" | "auto",
  targetLang = "vi",
): Promise<{ ok: boolean; text: string; error?: string }> {
  if (!text.trim()) return { ok: true, text };
  const chunks = chunkText(text);
  const out: string[] = [];
  try {
    for (const chunk of chunks) {
      const url = `${GTX}&sl=${sourceLang}&tl=${targetLang}&q=${encodeURIComponent(chunk)}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "LangKe/1.0" },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) {
        return {
          ok: false,
          text,
          error: `Dịch máy trả về ${res.status}`,
        };
      }
      const data = (await res.json()) as unknown;
      const sentences = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : [];
      const joined = sentences
        .map((row) => (Array.isArray(row) ? String(row[0] ?? "") : ""))
        .join("");
      out.push(joined || chunk);
    }
    return { ok: true, text: out.join("\n\n").trim() };
  } catch (err) {
    return {
      ok: false,
      text,
      error: err instanceof Error ? err.message : "Không dịch được",
    };
  }
}

export function detectLanguage(text: string): "zh" | "en" | "vi" {
  const sample = text.slice(0, 1500);
  const cjk = (sample.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const viet =
    (sample.match(/[ăâêôơưđáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/gi) ??
      []).length;
  const latin = (sample.match(/[A-Za-z]/g) ?? []).length;
  if (cjk > 12 && cjk > viet) return "zh";
  if (viet > 8) return "vi";
  if (latin > 20) return "en";
  return viet >= cjk ? "vi" : "zh";
}
