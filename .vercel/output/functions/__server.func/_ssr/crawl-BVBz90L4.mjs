import { t as createServerFn } from "./ssr.mjs";
import { a as createSampleStories, l as splitForAudio, n as applyFontMap, r as cleanText } from "./samples-6Npnk-8j.mjs";
import { n as translateGtx, t as detectLanguage } from "./translator-RvPP2Mku.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crawl-BVBz90L4.js
var UA = "Mozilla/5.0 (compatible; LangKe/1.0; +https://grok.com) AppleWebKit/537.36 Chrome/120.0.0.0";
async function fetchUrl(url, init = {}) {
	const headers = new Headers(init.headers);
	if (!headers.has("User-Agent")) headers.set("User-Agent", UA);
	if (!headers.has("Accept")) headers.set("Accept", "text/html,application/json;q=0.9,*/*;q=0.8");
	if (init.cookie) headers.set("Cookie", init.cookie);
	try {
		const res = await fetch(url, {
			...init,
			headers,
			redirect: "follow",
			signal: init.signal ?? AbortSignal.timeout(14e3)
		});
		const text = await res.text();
		return {
			ok: res.ok,
			status: res.status,
			text,
			finalUrl: res.url
		};
	} catch {
		return {
			ok: false,
			status: 0,
			text: "",
			finalUrl: url
		};
	}
}
function extractLikelyArticle(html) {
	for (const re of [
		/<article[^>]*>([\s\S]*?)<\/article>/i,
		/<div[^>]+class="[^"]*(?:content|article|post|story|RichText)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
		/<div[^>]+id="[^"]*(?:content|article|post|main)[^"]*"[^>]*>([\s\S]*?)<\/div>/i
	]) {
		const m = html.match(re);
		if (m?.[1] && m[1].length > 200) return m[1];
	}
	const stripped = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
	const pBits = [...stripped.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => m[1] ?? "").filter((t) => t.replace(/<[^>]+>/g, "").trim().length > 40);
	if (pBits.length >= 3) return pBits.join("\n");
	return stripped;
}
function extractTitle(html) {
	const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i);
	if (og?.[1]) return og[1];
	return (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").replace(/\s+/g, " ").trim();
}
var CATEGORY_LABEL = {
	703: "民间故事",
	710: "鬼故事"
};
function parseListLinks(html, limit) {
	const abs = [...html.matchAll(/href=["']([^"']+(?:story|article|post|view)[^"']*)["']/gi)].map((m) => m[1] ?? "").filter(Boolean).map((h) => {
		if (h.startsWith("http")) return h;
		if (h.startsWith("//")) return `https:${h}`;
		if (h.startsWith("/")) return `https://660i.com${h}`;
		return `https://660i.com/${h}`;
	});
	return [...new Set(abs)].slice(0, limit);
}
async function crawl660i(opts) {
	const cats = (opts.categories?.length ? opts.categories : [703, 710]).filter((c) => c === 703 || c === 710);
	const drafts = [];
	const tried = [];
	for (const cat of cats) {
		if (drafts.length >= opts.maxItems) break;
		const listUrls = [
			`https://660i.com/story?cat=${cat}`,
			`https://www.660i.com/story/cat_${cat}`,
			`https://660i.com/list/${cat}`
		];
		for (const listUrl of listUrls) {
			const res = await fetchUrl(listUrl);
			tried.push(`${listUrl} → ${res.status}`);
			if (!res.ok || res.text.length < 200) continue;
			const links = parseListLinks(res.text, opts.maxItems - drafts.length + 2);
			for (const link of links) {
				if (drafts.length >= opts.maxItems) break;
				const page = await fetchUrl(link);
				if (!page.ok) continue;
				const raw = cleanText(extractLikelyArticle(page.text));
				if (raw.length < 120) continue;
				drafts.push({
					source: "i660",
					sourceUrl: link,
					titleOriginal: extractTitle(page.text) || `故事 ${drafts.length + 1}`,
					rawContent: raw,
					language: "zh",
					tags: [CATEGORY_LABEL[cat] ?? String(cat)]
				});
			}
			if (drafts.length) break;
		}
	}
	return {
		drafts,
		live: drafts.length > 0,
		note: drafts.length ? `Lấy ${drafts.length} truyện từ 660i (chỉ cat 703 & 710).` : `Không vào được 660i.com (${tried.slice(0, 3).join("; ")}).`
	};
}
async function crawlFanqie(opts) {
	const targets = [opts.url, ...opts.books ? opts.books.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean) : []].filter((u) => Boolean(u));
	if (!targets.length) return {
		drafts: [],
		live: false,
		note: "Chưa có URL sách/chương Fanqie. Dán link chương ở mục Thu thập."
	};
	const drafts = [];
	for (const url of targets) {
		const res = await fetchUrl(url);
		if (!res.ok) continue;
		let raw = cleanText(extractLikelyArticle(res.text));
		if (opts.fontMap) raw = applyFontMap(raw, opts.fontMap);
		if (raw.length < 80) continue;
		const parts = splitForAudio(raw);
		const title = extractTitle(res.text) || "番茄小说";
		for (const part of parts.slice(0, opts.maxItems - drafts.length)) drafts.push({
			source: "fanqie",
			sourceUrl: url,
			titleOriginal: parts.length > 1 ? `${title} · phần ${part.index}` : title,
			rawContent: part.content,
			language: "zh",
			tags: ["dài kỳ", `phần ${part.index}`]
		});
		if (drafts.length >= opts.maxItems) break;
	}
	return {
		drafts,
		live: drafts.length > 0,
		note: drafts.length ? `Lấy ${drafts.length} phần Fanqie (cắt ~1.5 giờ audio / phần).` : "Fanqie chặn trích xuất (font chống copy). Cần font map hoặc dán văn bản tay."
	};
}
function sourceFromUrl(url) {
	try {
		const host = new URL(url).hostname.replace(/^www\./, "");
		if (host.includes("zhihu.com")) return "zhihu";
		if (host.includes("660i.com")) return "i660";
		if (host.includes("fanqie") || host.includes("fqnovel") || host.includes("toutiao")) return "fanqie";
		if (host.includes("reddit.com")) return "reddit_aita";
	} catch {}
	return "manual";
}
async function crawlGenericUrl(url, cookie) {
	const res = await fetchUrl(url, { cookie });
	if (!res.ok) return {
		draft: null,
		note: `Không tải được liên kết (mã ${res.status || "timeout"}).`
	};
	const raw = cleanText(extractLikelyArticle(res.text));
	if (raw.length < 40) return {
		draft: null,
		note: "Trang không có đoạn văn đủ dài để lấy."
	};
	return {
		draft: {
			source: sourceFromUrl(url),
			sourceUrl: url,
			titleOriginal: extractTitle(res.text) || url,
			rawContent: raw,
			language: detectLanguage(raw),
			tags: ["url"]
		},
		note: "Đã lấy nội dung từ liên kết."
	};
}
async function crawlReddit(opts) {
	const sort = opts.sort ?? "hot";
	const urls = [`https://www.reddit.com/r/AmItheAsshole/${sort}.json?limit=${Math.min(opts.maxItems + 3, 25)}`, `https://old.reddit.com/r/AmItheAsshole/${sort}.json?limit=${Math.min(opts.maxItems + 3, 25)}`];
	for (const url of urls) {
		const res = await fetchUrl(url, { headers: { Accept: "application/json" } });
		if (!res.ok) continue;
		try {
			const children = JSON.parse(res.text).data?.children ?? [];
			const drafts = [];
			for (const child of children) {
				const d = child.data;
				if (!d?.title || d.stickied || d.over_18) continue;
				const body = (d.selftext ?? "").trim();
				if (body.length < 80) continue;
				drafts.push({
					source: "reddit_aita",
					sourceUrl: d.permalink ? `https://www.reddit.com${d.permalink}` : void 0,
					titleOriginal: d.title,
					rawContent: body,
					language: "en",
					tags: d.link_flair_text ? [d.link_flair_text] : ["AITA"]
				});
				if (drafts.length >= opts.maxItems) break;
			}
			if (drafts.length) return {
				drafts,
				live: true,
				note: `Lấy ${drafts.length} bài từ r/AmItheAsshole (${sort}).`
			};
		} catch {}
	}
	return {
		drafts: [],
		live: false,
		note: "Reddit chặn truy cập từ máy chủ này."
	};
}
function extractZhihuBody(html) {
	const rich = html.match(/<div[^>]+class="[^"]*RichText[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
	if (rich?.[1]) return rich[1];
	return extractLikelyArticle(html);
}
async function crawlZhihu(opts) {
	const drafts = [];
	const cookie = opts.cookie?.trim();
	const targets = [];
	if (opts.url) targets.push(opts.url);
	if (opts.columns) opts.columns.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean).forEach((u) => targets.push(u));
	if (!targets.length) targets.push("https://www.zhihu.com/xen/market/column");
	if (!cookie) return {
		drafts: [],
		live: false,
		note: "Zhihu 盐选 cần cookie đăng nhập để lấy bài đủ. Thêm cookie ở Cài đặt rồi thu thập lại."
	};
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
					tags: ["盐选"]
				});
				continue;
			}
		}
		const links = [...res.text.matchAll(/href=["'](https?:\/\/zhuanlan\.zhihu\.com\/p\/\d+)["']/g), ...res.text.matchAll(/href=["'](\/\/www\.zhihu\.com\/p\/\d+)["']/g)].map((m) => m[1].startsWith("http") ? m[1] : `https:${m[1]}`);
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
				tags: ["盐选"]
			});
		}
	}
	return {
		drafts,
		live: drafts.length > 0,
		note: drafts.length ? `Lấy ${drafts.length} bài Zhihu bằng cookie đã cung cấp.` : "Cookie không đủ quyền hoặc Zhihu chặn máy chủ. Dùng bản mẫu để làm việc tiếp."
	};
}
function fallbackDrafts(source, maxItems) {
	return createSampleStories().filter((s) => s.source === source).slice(0, maxItems).map((s) => ({
		source: s.source,
		sourceUrl: s.sourceUrl,
		titleOriginal: s.titleOriginal,
		rawContent: s.rawContent,
		language: s.language,
		tags: s.tags,
		crawlNote: "Nguồn live không lấy được — dùng bản mẫu cùng thể loại."
	}));
}
async function maybeTranslate(draft) {
	if (draft.language === "vi") return draft;
	const sl = draft.language === "zh" ? "zh-CN" : "en";
	const title = await translateGtx(draft.titleOriginal, sl);
	const body = await translateGtx(draft.rawContent.slice(0, 8e3), sl);
	if (!body.ok) return draft;
	return {
		...draft,
		translatedTitle: title.ok ? title.text : draft.titleOriginal,
		translatedBody: body.text,
		crawlNote: [draft.crawlNote, "Đã dịch máy sang tiếng Việt."].filter(Boolean).join(" "),
		tags: draft.tags.includes("đã dịch") ? draft.tags : [...draft.tags, "đã dịch"]
	};
}
var crawlSourceFn_createServerFn_handler = createServerRpc({
	id: "aede1963dd154b776522f8bfb78957a6184ca7df1723866116baf51820ce26d5",
	name: "crawlSourceFn",
	filename: "src/lib/server/crawl.ts"
}, (opts) => crawlSourceFn.__executeServer(opts));
var crawlSourceFn = createServerFn({ method: "POST" }).validator((input) => input).handler(crawlSourceFn_createServerFn_handler, async ({ data }) => {
	const maxItems = Math.max(1, Math.min(data.maxItems ?? 5, 12));
	let drafts = [];
	let note = "";
	if (data.source === "reddit_aita") {
		const r = await crawlReddit({
			maxItems,
			sort: data.sort
		});
		drafts = r.drafts;
		note = r.note;
		r.live;
	} else if (data.source === "i660") {
		const r = await crawl660i({
			maxItems,
			categories: data.categories?.filter((c) => c === 703 || c === 710)
		});
		drafts = r.drafts;
		note = r.note;
		r.live;
	} else if (data.source === "zhihu") {
		const r = await crawlZhihu({
			maxItems,
			cookie: data.cookie,
			url: data.url
		});
		drafts = r.drafts;
		note = r.note;
		r.live;
	} else if (data.source === "fanqie") {
		const r = await crawlFanqie({
			maxItems,
			url: data.url,
			books: data.url
		});
		drafts = r.drafts;
		note = r.note;
		r.live;
	}
	let usedFallback = false;
	if (!drafts.length) {
		drafts = fallbackDrafts(data.source, maxItems);
		usedFallback = true;
		note = note ? `${note} Đã nạp bản mẫu cùng thể loại để bạn vẫn làm việc được.` : "Đã nạp bản mẫu.";
	}
	const translated = [];
	for (const d of drafts) translated.push(await maybeTranslate(d));
	return {
		ok: translated.length > 0,
		source: data.source,
		usedFallback,
		message: note,
		drafts: translated
	};
});
var importUrlFn_createServerFn_handler = createServerRpc({
	id: "14b52626eda8b95bdc496340ef65713dbd5cac3d9642d461fe6c01d414593064",
	name: "importUrlFn",
	filename: "src/lib/server/crawl.ts"
}, (opts) => importUrlFn.__executeServer(opts));
var importUrlFn = createServerFn({ method: "POST" }).validator((input) => input).handler(importUrlFn_createServerFn_handler, async ({ data }) => {
	const source = sourceFromUrl(data.url);
	const { draft, note } = await crawlGenericUrl(data.url, data.cookie);
	if (!draft) {
		const fallback = fallbackDrafts(source === "manual" ? "zhihu" : source, 1);
		return {
			ok: fallback.length > 0,
			source,
			usedFallback: true,
			message: `${note} Đã nạp bản mẫu.`,
			drafts: fallback
		};
	}
	const translated = await maybeTranslate(draft);
	return {
		ok: true,
		source: draft.source,
		usedFallback: false,
		message: note,
		drafts: [translated]
	};
});
//#endregion
export { crawlSourceFn_createServerFn_handler, importUrlFn_createServerFn_handler };
