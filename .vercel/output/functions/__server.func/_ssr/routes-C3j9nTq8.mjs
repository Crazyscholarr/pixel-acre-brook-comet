import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Languages, d as Eraser, h as ArrowRight, t as Upload, u as FileDown } from "../_libs/lucide-react.mjs";
import { r as useStoryStore } from "./router-BkyD3Y34.mjs";
import { t as Button } from "./button-ISKN78vv.mjs";
import { n as SOURCE_META } from "./types-Cy_kTi3C.mjs";
import { n as StoryCard, t as StatTile } from "./story-card-B0Po_LrQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C3j9nTq8.js
var import_jsx_runtime = require_jsx_runtime();
var PIPELINE = [
	{
		icon: Upload,
		title: "Thu thập",
		body: "Zhihu, 660i (dân gian & ma), Fanqie, Reddit AITA — hoặc dán URL / văn bản."
	},
	{
		icon: Eraser,
		title: "Làm sạch",
		body: "Gỡ HTML, quảng cáo, font chống copy Fanqie, cắt phần audio 1.5 giờ."
	},
	{
		icon: Languages,
		title: "Việt hóa",
		body: "Đổi tên, địa danh sang làng quê Việt. Lọc trà xanh, tổng tài, hào môn."
	},
	{
		icon: FileDown,
		title: "Xuất",
		body: "JSON, TXT, CSV — từng truyện hoặc cả kho, để viết lại và thu âm."
	}
];
function Home() {
	const stories = useStoryStore((s) => s.stories);
	const localized = stories.filter((s) => s.status === "localized" || s.status === "exported").length;
	const blocked = stories.reduce((n, s) => n + s.blockedHits.length, 0);
	const recent = stories.slice(0, 4);
	const bySource = (id) => stories.filter((s) => s.source === id).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.18em] text-primary uppercase",
						children: "Xưởng nguyên liệu"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl",
						children: "Thu thập truyện. Kể lại bằng giọng làng quê."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-base leading-relaxed text-muted",
						children: "Làng Kể lấy truyện ngắn từ Zhihu, 660i, Fanqie và Reddit, rửa sạch chữ, đổi nhân vật và bối cảnh sang xã, huyện, tỉnh có thật ở Việt Nam — rồi xuất file để bạn viết lại."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/collect",
								children: ["Bắt đầu thu thập", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/library",
								children: "Xem thư viện"
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						label: "Trong kho",
						value: stories.length,
						hint: "truyện đã lưu"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						label: "Đã Việt hóa",
						value: localized,
						hint: "sẵn để viết lại"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						label: "Từ bị lọc",
						value: blocked,
						hint: "trà xanh, tổng tài…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						label: "Nguồn",
						value: 4,
						hint: "Zhihu · 660i · Fanqie · Reddit"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold tracking-wide text-muted uppercase",
				children: "Quy trình"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid gap-3 md:grid-cols-4",
				children: PIPELINE.map((step, i) => {
					const Icon = step.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "size-4",
										strokeWidth: 1.75
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs tabular-nums text-subtle",
									children: ["0", i + 1]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 font-semibold",
								children: step.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted",
								children: step.body
							})
						]
					}, step.title);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold tracking-wide text-muted uppercase",
					children: "Mới trong kho"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/library",
					className: "text-sm font-medium text-primary",
					children: "Tất cả"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid gap-3 md:grid-cols-2",
				children: recent.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryCard, { story: s }, s.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-primary px-5 py-6 text-primary-fg md:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Bốn nguồn, một bối cảnh"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm text-primary-fg/75",
						children: "Zhihu mẹ chồng–nàng dâu, dân gian và ma 660i (chỉ cat 703 và 710), series Fanqie, mâu thuẫn Reddit AITA. Tất cả về ruộng, đình, chợ phiên."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-4",
						children: [
							"zhihu",
							"i660",
							"fanqie",
							"reddit_aita"
						].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-primary-fg/10 px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: SOURCE_META[id].short
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-primary-fg/70",
								children: [
									bySource(id),
									" truyện · ",
									SOURCE_META[id].kind
								]
							})]
						}, id))
					})
				]
			})
		]
	});
}
//#endregion
export { Home as component };
