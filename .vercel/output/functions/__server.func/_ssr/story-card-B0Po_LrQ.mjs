import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as cn, s as formatDate } from "./samples-6Npnk-8j.mjs";
import { h as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as SOURCE_META, r as STATUS_META } from "./types-Cy_kTi3C.mjs";
import { t as Badge } from "./badge-DEew5rQw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/story-card-B0Po_LrQ.js
var import_jsx_runtime = require_jsx_runtime();
function SourceBadge({ source }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "default",
		children: SOURCE_META[source].short
	});
}
function StoryCard({ story }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/stories/$id",
		params: { id: story.id },
		className: "group block rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 hover:shadow-[var(--shadow-border-hover)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBadge, { source: story.source }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "muted",
						children: STATUS_META[story.status].label
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 font-semibold leading-snug text-fg",
				children: story.titleLocalized
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 line-clamp-1 text-xs text-subtle",
				children: story.titleOriginal
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 line-clamp-3 text-sm leading-relaxed text-muted",
				children: story.localizedContent
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between text-xs text-subtle",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "tabular-nums",
					children: [story.wordCount, " từ"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(story.updatedAt) })]
			})
		]
	});
}
function StatTile({ label, value, hint, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-2xl font-semibold tabular-nums tracking-tight",
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-subtle",
				children: hint
			}) : null
		]
	});
}
//#endregion
export { StoryCard as n, StatTile as t };
