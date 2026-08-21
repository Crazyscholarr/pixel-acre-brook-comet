import { i as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as cn } from "./samples-6Npnk-8j.mjs";
import { a as Search } from "../_libs/lucide-react.mjs";
import { r as useStoryStore } from "./router-BkyD3Y34.mjs";
import { t as Input } from "./input-DVtnqXef.mjs";
import { i as STORY_STATUSES, n as SOURCE_META, r as STATUS_META, t as SOURCE_IDS } from "./types-Cy_kTi3C.mjs";
import { n as StoryCard } from "./story-card-B0Po_LrQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-DnHtnEfh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Chip({ active, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("min-h-9 rounded-full px-3 text-sm font-medium transition-colors", active ? "bg-primary text-primary-fg" : "bg-fg/6 text-muted hover:bg-fg/10"),
		children
	});
}
function LibraryPage() {
	const stories = useStoryStore((s) => s.stories);
	const [q, setQ] = (0, import_react.useState)("");
	const [source, setSource] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("all");
	const filtered = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return stories.filter((s) => {
			if (source !== "all" && s.source !== source) return false;
			if (status !== "all" && s.status !== status) return false;
			if (!query) return true;
			return s.titleLocalized.toLowerCase().includes(query) || s.titleOriginal.toLowerCase().includes(query) || s.localizedContent.toLowerCase().includes(query) || s.tags.some((t) => t.toLowerCase().includes(query));
		});
	}, [
		stories,
		q,
		source,
		status
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Thư viện"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					filtered.length,
					"/",
					stories.length,
					" truyện"
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Tìm tiêu đề, nội dung, thẻ…",
					className: "pl-10"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: source === "all",
					onClick: () => setSource("all"),
					children: "Mọi nguồn"
				}), SOURCE_IDS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: source === id,
					onClick: () => setSource(id),
					children: SOURCE_META[id].short
				}, id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: status === "all",
					onClick: () => setStatus("all"),
					children: "Mọi trạng thái"
				}), STORY_STATUSES.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: status === st,
					onClick: () => setStatus(st),
					children: STATUS_META[st].label
				}, st))]
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface px-5 py-12 text-center shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "Không có truyện khớp bộ lọc."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Thu thập nguồn mới hoặc xóa từ khóa tìm kiếm."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: filtered.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryCard, { story: s }, s.id))
			})
		]
	});
}
//#endregion
export { LibraryPage as component };
