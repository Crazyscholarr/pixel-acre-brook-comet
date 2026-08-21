import { i as __toESM } from "../_runtime.mjs";
import { m as require_react, n as CheckboxIndicator, p as require_jsx_runtime, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as cn, o as downloadBlob, u as todayStamp } from "./samples-6Npnk-8j.mjs";
import { p as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useStoryStore } from "./router-BkyD3Y34.mjs";
import { t as Button } from "./button-ISKN78vv.mjs";
import { a as storyToExportJson, i as storiesToTxt, r as storiesToCsv } from "./pipeline-CN_Wy-ib.mjs";
import { n as SOURCE_META } from "./types-Cy_kTi3C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/export-B-E1w68_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Checkbox({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
		className: cn("peer size-5 shrink-0 rounded-sm border border-border bg-surface shadow-[var(--shadow-border)] data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
			className: "flex items-center justify-center text-current",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
				className: "size-3.5",
				strokeWidth: 3
			})
		})
	});
}
function ExportPage() {
	const stories = useStoryStore((s) => s.stories);
	const markStatus = useStoryStore((s) => s.markStatus);
	const [selected, setSelected] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		setSelected((prev) => {
			const ids = stories.map((s) => s.id);
			if (!prev.length) return ids;
			const keep = prev.filter((id) => ids.includes(id));
			return keep.length ? keep : ids;
		});
	}, [stories]);
	const chosen = (0, import_react.useMemo)(() => stories.filter((s) => selected.includes(s.id)), [stories, selected]);
	function toggle(id) {
		setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	}
	function doExport(kind) {
		if (!chosen.length) {
			toast.error("Chọn ít nhất một truyện");
			return;
		}
		const stamp = todayStamp();
		if (kind === "json") downloadBlob(`stories_${stamp}.json`, JSON.stringify(storyToExportJson(chosen), null, 2), "application/json");
		else if (kind === "txt") downloadBlob(`stories_${stamp}.txt`, storiesToTxt(chosen), "text/plain;charset=utf-8");
		else downloadBlob(`stories_${stamp}.csv`, storiesToCsv(chosen), "text/csv;charset=utf-8");
		markStatus(chosen.map((s) => s.id), "exported");
		toast.success(`Đã xuất ${chosen.length} truyện (${kind.toUpperCase()})`);
	}
	function exportEach() {
		if (!chosen.length) return;
		for (const s of chosen) downloadBlob(`${s.id}.txt`, `${s.titleLocalized}\n\n${s.localizedContent}`, "text/plain;charset=utf-8");
		markStatus(chosen.map((s) => s.id), "exported");
		toast.success(`Đã tải ${chosen.length} file riêng`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Xuất dữ liệu"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xl text-sm text-muted",
				children: "File mang id, tiêu đề gốc và đã Việt hóa, nguồn, nội dung thô, bản làng quê, trạng thái — đúng khung nguyên liệu để viết lại."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => doExport("json"),
						children: "JSON"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => doExport("txt"),
						children: "TXT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => doExport("csv"),
						children: "CSV"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: exportEach,
						children: "Từng file theo truyện"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setSelected(stories.map((s) => s.id)),
						children: "Chọn hết"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setSelected([]),
						children: "Bỏ chọn"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Đang chọn ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums font-medium text-fg",
						children: chosen.length
					}),
					" /",
					" ",
					stories.length
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: stories.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-3 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: selected.includes(s.id),
						onCheckedChange: () => toggle(s.id),
						className: "mt-1",
						"aria-label": `Chọn ${s.titleLocalized}`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-medium",
							children: s.titleLocalized
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-xs text-subtle",
							children: [
								SOURCE_META[s.source].short,
								" · ",
								s.wordCount,
								" từ · ",
								s.status
							]
						})]
					})]
				}, s.id))
			})
		]
	});
}
//#endregion
export { ExportPage as component };
