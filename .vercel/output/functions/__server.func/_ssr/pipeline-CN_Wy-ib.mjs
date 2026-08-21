import { c as localizeStory, d as uid, f as wordCount, r as cleanText } from "./samples-6Npnk-8j.mjs";
import { t as detectLanguage } from "./translator-RvPP2Mku.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pipeline-CN_Wy-ib.js
function draftToStory(draft, settings, translated) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const raw = draft.rawContent;
	const sourceText = translated?.content ?? draft.translatedBody ?? raw;
	const sourceTitle = translated?.title ?? draft.translatedTitle ?? draft.titleOriginal;
	const cleaned = cleanText(sourceText);
	const loc = localizeStory(sourceTitle, cleaned, {
		seed: settings.seed,
		extraBlocked: settings.blockedKeywords,
		extraVillages: settings.extraVillages
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
		crawlNote: draft.crawlNote
	};
}
function reprocessStory(story, settings) {
	const cleaned = cleanText(story.rawContent);
	const loc = localizeStory(story.titleOriginal, cleaned, {
		seed: settings.seed,
		extraBlocked: settings.blockedKeywords,
		extraVillages: settings.extraVillages
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
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function storyToExportJson(stories) {
	return stories.map((s) => ({
		id: s.id,
		title: {
			original: s.titleOriginal,
			localized: s.titleLocalized
		},
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
		createdAt: s.createdAt
	}));
}
function storiesToTxt(stories) {
	return stories.map((s) => {
		return [
			`=== ${s.titleLocalized} ===`,
			`Gốc: ${s.titleOriginal}`,
			`Nguồn: ${s.source}${s.sourceUrl ? ` · ${s.sourceUrl}` : ""}`,
			`Trạng thái: ${s.status} · ${s.wordCount} từ`,
			s.nameMap.length ? `Tên: ${s.nameMap.map((n) => `${n.original} → ${n.localized}`).join("; ")}` : "",
			s.placeMap.length ? `Địa danh: ${s.placeMap.map((n) => `${n.original} → ${n.localized}`).join("; ")}` : "",
			"",
			s.localizedContent,
			"",
			"--- Bản gốc ---",
			"",
			s.rawContent
		].filter((l) => l !== void 0).join("\n");
	}).join("\n\n" + "=".repeat(48) + "\n\n");
}
function storiesToCsv(stories) {
	const header = [
		"id",
		"title_original",
		"title_localized",
		"source",
		"status",
		"raw_content",
		"localized_content",
		"word_count"
	];
	const esc = (v) => `"${v.replace(/"/g, "\"\"")}"`;
	const rows = stories.map((s) => [
		s.id,
		s.titleOriginal,
		s.titleLocalized,
		s.source,
		s.status,
		s.rawContent,
		s.localizedContent,
		String(s.wordCount)
	].map(esc).join(","));
	return [header.join(","), ...rows].join("\n");
}
//#endregion
export { storyToExportJson as a, storiesToTxt as i, reprocessStory as n, storiesToCsv as r, draftToStory as t };
