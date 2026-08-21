import { i as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as DEFAULT_SETTINGS, r as useStoryStore } from "./router-BkyD3Y34.mjs";
import { t as Button } from "./button-ISKN78vv.mjs";
import { t as Input } from "./input-DVtnqXef.mjs";
import { t as Label } from "./label-BuVSzWgv.mjs";
import { t as Textarea } from "./textarea-DsDINKF_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-DzBE-wTs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const settings = useStoryStore((s) => s.settings);
	const replaceSettings = useStoryStore((s) => s.replaceSettings);
	const resetSamples = useStoryStore((s) => s.resetSamples);
	const clearAll = useStoryStore((s) => s.clearAll);
	const [kw, setKw] = (0, import_react.useState)("");
	const [village, setVillage] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Cài đặt"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Cookie Zhihu chỉ dùng khi bạn bấm thu thập, lưu trên máy này, không đưa lên cơ sở dữ liệu dùng chung."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Cookie Zhihu 盐选"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "cookie",
						className: "mt-3 block text-xs text-muted",
						children: "Dán chuỗi cookie đăng nhập"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "cookie",
						className: "mt-1 min-h-24 font-mono text-xs",
						value: settings.sources.zhihu.cookie ?? "",
						onChange: (e) => replaceSettings({
							...settings,
							sources: {
								...settings.sources,
								zhihu: {
									...settings.sources.zhihu,
									cookie: e.target.value
								}
							}
						}),
						placeholder: "d_c0=…; z_c0=…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "cols",
						className: "mt-3 block text-xs text-muted",
						children: "Cột / URL bài (mỗi dòng một link)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "cols",
						className: "mt-1 min-h-20",
						value: settings.sources.zhihu.columns ?? "",
						onChange: (e) => replaceSettings({
							...settings,
							sources: {
								...settings.sources,
								zhihu: {
									...settings.sources.zhihu,
									columns: e.target.value
								}
							}
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Từ cấm / không hợp văn hóa"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Mặc định gồm trà xanh, bạch nguyệt quang, tổng tài, hào môn, ngôn tình, nam thần, nữ thần, CEO, tập đoàn, thiếu gia, công tử, mỹ nữ, soái ca."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: settings.blockedKeywords.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "rounded-full bg-fg/6 px-3 py-1 text-xs text-muted hover:bg-danger/10 hover:text-danger",
							onClick: () => replaceSettings({
								...settings,
								blockedKeywords: settings.blockedKeywords.filter((x) => x !== k)
							}),
							children: [k, " ×"]
						}, k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: kw,
							onChange: (e) => setKw(e.target.value),
							placeholder: "Thêm từ cấm",
							onKeyDown: (e) => {
								if (e.key === "Enter" && kw.trim()) {
									replaceSettings({
										...settings,
										blockedKeywords: [...settings.blockedKeywords, kw.trim()]
									});
									setKw("");
								}
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => {
								if (!kw.trim()) return;
								replaceSettings({
									...settings,
									blockedKeywords: [...settings.blockedKeywords, kw.trim()]
								});
								setKw("");
							},
							children: "Thêm"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Làng quê thêm vào"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Danh sách sẵn có dùng xã, huyện, tỉnh thật. Thêm địa danh bạn muốn ưu tiên."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: settings.extraVillages.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-primary/10 px-3 py-1 text-xs text-primary",
							children: v
						}, v))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: village,
							onChange: (e) => setVillage(e.target.value),
							placeholder: "vd. xã Tân Hòa, huyện Châu Thành, Tiền Giang"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => {
								if (!village.trim()) return;
								replaceSettings({
									...settings,
									extraVillages: [...settings.extraVillages, village.trim()]
								});
								setVillage("");
							},
							children: "Thêm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "seed",
						className: "mt-4 block text-xs text-muted",
						children: "Seed đặt tên (để tái lập cùng một bộ tên)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "seed",
						type: "number",
						className: "mt-1 w-32",
						value: settings.seed,
						onChange: (e) => replaceSettings({
							...settings,
							seed: Number(e.target.value) || 0
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Kho dữ liệu"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Dữ liệu nằm trên trình duyệt này. Xuất file trước khi xóa."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => {
									resetSamples();
									toast.success("Đã nạp lại năm truyện mẫu");
								},
								children: "Nạp lại bản mẫu"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => {
									replaceSettings(DEFAULT_SETTINGS);
									toast.success("Đã trả cài đặt về mặc định");
								},
								children: "Reset cài đặt"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "destructive",
								onClick: () => {
									clearAll();
									toast("Đã xóa kho trên máy này");
								},
								children: "Xóa kho local"
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
