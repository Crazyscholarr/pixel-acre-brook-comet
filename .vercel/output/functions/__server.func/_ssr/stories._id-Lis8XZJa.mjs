import { i as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as createServerFn } from "./ssr.mjs";
import { f as wordCount, i as cn, o as downloadBlob, s as formatDate } from "./samples-6Npnk-8j.mjs";
import { g as ArrowLeft, o as LoaderCircle, r as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route, r as useStoryStore } from "./router-BkyD3Y34.mjs";
import { t as Button } from "./button-ISKN78vv.mjs";
import { t as Textarea } from "./textarea-DsDINKF_.mjs";
import { t as createSsrRpc } from "./createSsrRpc-C1p7zOu_.mjs";
import { n as reprocessStory } from "./pipeline-CN_Wy-ib.mjs";
import { n as SOURCE_META, r as STATUS_META } from "./types-Cy_kTi3C.mjs";
import { t as Badge } from "./badge-DEew5rQw.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stories._id-Lis8XZJa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex h-11 items-center gap-1 rounded-xl bg-fg/5 p-1", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex min-h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-muted transition-colors data-[state=active]:bg-surface data-[state=active]:text-fg data-[state=active]:shadow-[var(--shadow-border)]", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		className: cn("mt-4 outline-none", className),
		...props
	});
}
var deepLocalizeFn = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("f5316b2630faed8cbcfe9879f22383498c290e71bba7d058d5b386e7a14e67aa"));
function StoryDetail() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const story = useStoryStore((s) => s.stories.find((x) => x.id === id));
	const settings = useStoryStore((s) => s.settings);
	const updateStory = useStoryStore((s) => s.updateStory);
	const removeStory = useStoryStore((s) => s.removeStory);
	const [draft, setDraft] = (0, import_react.useState)(story?.localizedContent ?? "");
	const [aiBusy, setAiBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setDraft(story?.localizedContent ?? "");
	}, [story?.id, story?.localizedContent]);
	const hits = (0, import_react.useMemo)(() => {
		if (!story) return [];
		return story.blockedHits;
	}, [story]);
	if (!story) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface p-8 text-center shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-medium",
			children: "Không tìm thấy truyện."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "secondary",
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/library",
				children: "Về thư viện"
			})
		})]
	});
	const current = story;
	function saveDraft() {
		updateStory(current.id, {
			localizedContent: draft,
			wordCount: wordCount(draft),
			status: "localized"
		});
		toast.success("Đã lưu bản Việt hóa");
	}
	function rerun() {
		const next = reprocessStory(current, settings);
		updateStory(current.id, next);
		setDraft(next.localizedContent);
		toast.success("Đã chạy lại bộ lọc tên / địa danh / từ cấm");
	}
	async function deepAi() {
		setAiBusy(true);
		try {
			const res = await deepLocalizeFn({ data: {
				title: current.titleOriginal,
				content: current.cleanedContent || current.rawContent
			} });
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			updateStory(current.id, {
				titleLocalized: res.title,
				localizedContent: res.content,
				nameMap: res.nameMap.length ? res.nameMap : current.nameMap,
				placeMap: res.placeMap.length ? res.placeMap : current.placeMap,
				wordCount: wordCount(res.content),
				status: "localized",
				notes: "Việt hóa sâu bằng AI"
			});
			setDraft(res.content);
			toast.success("Đã Việt hóa sâu");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "AI lỗi");
		} finally {
			setAiBusy(false);
		}
	}
	function exportOne() {
		const body = [
			current.titleLocalized,
			"",
			current.localizedContent,
			"",
			"--- Gốc ---",
			current.titleOriginal,
			"",
			current.rawContent
		].join("\n");
		downloadBlob(`${current.titleLocalized.slice(0, 40).replace(/\s+/g, "_")}.txt`, body, "text/plain;charset=utf-8");
		updateStory(current.id, { status: "exported" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/library",
				className: "inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Thư viện"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: SOURCE_META[story.source].short }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "muted",
								children: STATUS_META[story.status].label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: story.language.toUpperCase()
							}),
							hits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "warn",
								children: ["lọc: ", h]
							}, h))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold tracking-tight md:text-3xl",
						children: story.titleLocalized
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-subtle",
						children: story.titleOriginal
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs break-all text-subtle",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: story.wordCount
							}),
							" từ ·",
							" ",
							formatDate(story.updatedAt),
							story.sourceUrl ? ` · ${story.sourceUrl}` : ""
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: rerun,
						children: "Việt hóa nhanh"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => void deepAi(),
						disabled: aiBusy,
						children: [aiBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, "Việt hóa sâu (AI)"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: saveDraft,
						children: "Lưu chỉnh sửa"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ink",
						onClick: exportOne,
						children: "Xuất TXT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: "text-danger",
						onClick: () => {
							removeStory(story.id);
							toast("Đã xóa khỏi kho");
							navigate({ to: "/library" });
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Xóa"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "compare",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "compare",
							children: "So sánh"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "local",
							children: "Việt hóa"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "raw",
							children: "Bản gốc"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "meta",
							children: "Ánh xạ"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "compare",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xs font-medium tracking-wide text-muted uppercase",
									children: "Gốc"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-serif text-[15px] leading-relaxed whitespace-pre-wrap",
									children: story.rawContent
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xs font-medium tracking-wide text-muted uppercase",
									children: "Làng quê Việt"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-serif text-[15px] leading-relaxed whitespace-pre-wrap",
									children: story.localizedContent
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "local",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							className: "min-h-80 font-serif text-[15px] leading-relaxed"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-subtle",
							children: [
								"Sửa tay rồi bấm Lưu chỉnh sửa. ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: wordCount(draft)
								}),
								" từ."
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "raw",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
							className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-[15px] leading-relaxed whitespace-pre-wrap",
								children: story.cleanedContent || story.rawContent
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "meta",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-semibold",
									children: "Tên nhân vật"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 space-y-2 text-sm",
									children: story.nameMap.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "text-muted",
										children: "Chưa bắt được tên riêng."
									}) : story.nameMap.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted",
											children: n.original
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: n.localized
										})]
									}, n.original))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-semibold",
									children: "Địa danh / bối cảnh"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 space-y-2 text-sm",
									children: story.placeMap.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "text-muted",
										children: "Chưa bắt được địa danh."
									}) : story.placeMap.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted",
											children: n.original
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-right font-medium",
											children: n.localized
										})]
									}, n.original))
								})]
							})]
						}), story.crawlNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-subtle",
							children: story.crawlNote
						}) : null]
					})
				]
			})
		]
	});
}
//#endregion
export { StoryDetail as component };
