import { i as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as createServerFn } from "./ssr.mjs";
import { d as uid, i as cn } from "./samples-6Npnk-8j.mjs";
import { t as detectLanguage } from "./translator-RvPP2Mku.mjs";
import { o as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useStoryStore } from "./router-BkyD3Y34.mjs";
import { t as Button } from "./button-ISKN78vv.mjs";
import { t as Input } from "./input-DVtnqXef.mjs";
import { t as Label } from "./label-BuVSzWgv.mjs";
import { t as Textarea } from "./textarea-DsDINKF_.mjs";
import { t as createSsrRpc } from "./createSsrRpc-C1p7zOu_.mjs";
import { t as draftToStory } from "./pipeline-CN_Wy-ib.mjs";
import { n as SOURCE_META } from "./types-Cy_kTi3C.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collect-CWuKk0OI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-fg/15 transition-colors data-[state=checked]:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-surface shadow-sm transition-transform data-[state=checked]:translate-x-[22px]" })
	});
}
var crawlSourceFn = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("aede1963dd154b776522f8bfb78957a6184ca7df1723866116baf51820ce26d5"));
var importUrlFn = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("14b52626eda8b95bdc496340ef65713dbd5cac3d9642d461fe6c01d414593064"));
var SOURCES = [
	"zhihu",
	"i660",
	"fanqie",
	"reddit_aita"
];
function CollectPage() {
	const settings = useStoryStore((s) => s.settings);
	const replaceSettings = useStoryStore((s) => s.replaceSettings);
	const addStories = useStoryStore((s) => s.addStories);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [log, setLog] = (0, import_react.useState)([]);
	const [url, setUrl] = (0, import_react.useState)("");
	const [pasteTitle, setPasteTitle] = (0, import_react.useState)("");
	const [pasteBody, setPasteBody] = (0, import_react.useState)("");
	const pushLog = (line) => setLog((prev) => [`${(/* @__PURE__ */ new Date()).toLocaleTimeString("vi-VN")} · ${line}`, ...prev].slice(0, 24));
	async function runSource(source) {
		const cfg = settings.sources[source];
		setBusy(source);
		pushLog(`Đang thu thập ${SOURCE_META[source].label}…`);
		try {
			const result = await crawlSourceFn({ data: {
				source,
				maxItems: cfg.maxItems,
				cookie: settings.sources.zhihu.cookie,
				url: source === "zhihu" ? cfg.columns : source === "fanqie" ? cfg.books : void 0,
				categories: source === "i660" ? [703, 710] : void 0,
				sort: cfg.sort
			} });
			const stories = result.drafts.map((d) => draftToStory(d, settings));
			addStories(stories);
			pushLog(`${result.message} Thêm ${stories.length} truyện${result.usedFallback ? " (bản mẫu)" : ""}.`);
			toast.success(`Đã thêm ${stories.length} truyện từ ${SOURCE_META[source].short}`);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Lỗi thu thập";
			pushLog(msg);
			toast.error(msg);
		} finally {
			setBusy(null);
		}
	}
	async function runAll() {
		for (const s of SOURCES) if (settings.sources[s].enabled) await runSource(s);
	}
	async function importLink() {
		if (!url.trim()) return;
		setBusy("url");
		pushLog(`Đang lấy ${url}…`);
		try {
			const result = await importUrlFn({ data: {
				url: url.trim(),
				cookie: settings.sources.zhihu.cookie
			} });
			const stories = result.drafts.map((d) => draftToStory(d, settings));
			addStories(stories);
			pushLog(result.message);
			toast.success(`Đã nhập ${stories.length} truyện`);
			setUrl("");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Không nhập được");
		} finally {
			setBusy(null);
		}
	}
	function importPaste() {
		if (!pasteBody.trim()) return;
		const story = draftToStory({
			source: "manual",
			titleOriginal: pasteTitle.trim() || "Không tiêu đề",
			rawContent: pasteBody,
			language: detectLanguage(pasteBody),
			tags: ["nhập tay"]
		}, settings);
		addStories([{
			...story,
			id: uid("st")
		}]);
		toast.success("Đã Việt hóa bản dán tay");
		pushLog(`Nhập tay: ${story.titleLocalized}`);
		setPasteTitle("");
		setPasteBody("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Thu thập"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-xl text-sm text-muted",
					children: "Bật nguồn, chạy từng cái hoặc cả lô. Nếu trang chặn máy chủ, kho vẫn nhận bản mẫu cùng thể loại để bạn so sánh và xuất."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => void runAll(),
					disabled: Boolean(busy),
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, "Chạy tất cả"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: SOURCES.map((id) => {
					const cfg = settings.sources[id];
					const meta = SOURCE_META[id];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-semibold",
									children: meta.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										meta.language,
										" · ",
										meta.kind
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: cfg.enabled,
									onCheckedChange: (v) => replaceSettings({
										...settings,
										sources: {
											...settings.sources,
											[id]: {
												...cfg,
												enabled: v
											}
										}
									}),
									"aria-label": `Bật ${meta.short}`
								})]
							}),
							id === "i660" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-muted",
								children: "Chỉ chuyên mục 民间故事 (703) và 鬼故事 (710)."
							}) : null,
							id === "zhihu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-muted",
								children: "盐选 cần cookie đăng nhập — dán ở Cài đặt."
							}) : null,
							id === "fanqie" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "fanqie-url",
									className: "text-xs text-muted",
									children: "URL sách / chương"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "fanqie-url",
									className: "mt-1",
									placeholder: "https://fanqienovel.com/page/…",
									value: cfg.books ?? "",
									onChange: (e) => replaceSettings({
										...settings,
										sources: {
											...settings.sources,
											fanqie: {
												...cfg,
												books: e.target.value
											}
										}
									})
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-xs text-muted",
									children: ["Tối đa", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 1,
										max: 12,
										value: cfg.maxItems,
										onChange: (e) => replaceSettings({
											...settings,
											sources: {
												...settings.sources,
												[id]: {
													...cfg,
													maxItems: Math.max(1, Math.min(12, Number(e.target.value) || 1))
												}
											}
										}),
										className: "h-9 w-16 min-h-9"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									disabled: !cfg.enabled || Boolean(busy),
									onClick: () => void runSource(id),
									children: [busy === id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, "Thu thập"]
								})]
							})
						]
					}, id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Nhập từ liên kết"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Zhihu, 660i, Fanqie, Reddit hoặc trang bài viết bất kỳ."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-col gap-2 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: url,
								onChange: (e) => setUrl(e.target.value),
								placeholder: "https://…"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								disabled: !url.trim() || Boolean(busy),
								onClick: () => void importLink(),
								children: "Lấy bài"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Dán văn bản"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Dịch (nếu cần) và Việt hóa ngay trên máy."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-4",
							value: pasteTitle,
							onChange: (e) => setPasteTitle(e.target.value),
							placeholder: "Tiêu đề gốc"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "mt-2 min-h-28",
							value: pasteBody,
							onChange: (e) => setPasteBody(e.target.value),
							placeholder: "Dán nội dung truyện…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3",
							variant: "secondary",
							disabled: !pasteBody.trim(),
							onClick: importPaste,
							children: "Làm sạch và Việt hóa"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold tracking-wide text-muted uppercase",
				children: "Nhật ký"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 max-h-48 overflow-auto rounded-xl bg-ink px-4 py-3 font-mono text-xs leading-relaxed text-primary-fg",
				children: log.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-primary-fg/50",
					children: "Chưa chạy lượt nào."
				}) : log.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: line }, line))
			})] })
		]
	});
}
//#endregion
export { CollectPage as component };
