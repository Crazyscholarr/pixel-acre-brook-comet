import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/samples-6Npnk-8j.js
var AD_MARKERS = /(?:广告|advertisement|sponsored|promo\b|click here|点击查看|更多推荐|相关阅读|热门评论)/gi;
var TAG_BLOCK = /<(script|style|noscript|iframe|svg|nav|footer|aside)[\s\S]*?<\/\1>/gi;
var ENTITIES = {
	["&nbsp;"]: " ",
	["&amp;"]: "&",
	["&lt;"]: "<",
	["&gt;"]: ">",
	["&quot;"]: "\"",
	["&#39;"]: "'",
	["&apos;"]: "'",
	["&mdash;"]: "—",
	["&ndash;"]: "–",
	["&hellip;"]: "…",
	["&ldquo;"]: "“",
	["&rdquo;"]: "”"
};
function decodeEntities(text) {
	return text.replace(/&[a-z]+;|&#\d+;|&#x[0-9a-f]+;/gi, (m) => {
		if (ENTITIES[m.toLowerCase()]) return ENTITIES[m.toLowerCase()];
		const dec = m.match(/^&#(\d+);$/);
		if (dec) return String.fromCharCode(Number(dec[1]));
		const hex = m.match(/^&#x([0-9a-f]+);$/i);
		if (hex) return String.fromCharCode(parseInt(hex[1], 16));
		return m;
	}).replace(/\u00a0/g, " ");
}
function stripHtml(html) {
	return decodeEntities(html.replace(TAG_BLOCK, " ").replace(/<!--[\s\S]*?-->/g, " ").replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li|h[1-6]|tr|blockquote)>/gi, "\n\n").replace(/<li[^>]*>/gi, "• ").replace(/<[^>]+>/g, " "));
}
function cleanText(input) {
	let text = input.includes("<") ? stripHtml(input) : decodeEntities(input);
	text = text.replace(AD_MARKERS, "");
	text = text.replace(/https?:\/\/\S+/g, "");
	text = text.replace(/[ \t]+\n/g, "\n");
	text = text.replace(/\n{3,}/g, "\n\n");
	text = text.replace(/[ \t]{2,}/g, " ");
	return text.trim();
}
/** Fanqie anti-scrape: remap Private Use Area glyphs via a codepoint map. */
function applyFontMap(text, fontMap) {
	if (!fontMap || Object.keys(fontMap).length === 0) return text;
	return text.replace(/[\uE000-\uF8FF]/g, (ch) => fontMap[ch] ?? ch);
}
/** ~1.5 hours of spoken Vietnamese ≈ 12–14k syllables; we split on ~9000 words. */
function splitForAudio(text, maxWords = 9e3) {
	const paragraphs = text.split(/\n{2,}/);
	const parts = [];
	let buf = [];
	let count = 0;
	const flush = () => {
		if (!buf.length) return;
		parts.push({
			index: parts.length + 1,
			content: buf.join("\n\n").trim()
		});
		buf = [];
		count = 0;
	};
	for (const p of paragraphs) {
		const n = p.replace(/[\u4e00-\u9fff]/g, " x ").split(/\s+/).filter(Boolean).length;
		if (count + n > maxWords && buf.length) flush();
		buf.push(p);
		count += n;
	}
	flush();
	return parts.length ? parts : [{
		index: 1,
		content: text
	}];
}
var DEFAULT_BLOCK_RULES = [
	{
		pattern: "trà xanh",
		replacement: "người thứ ba"
	},
	{
		pattern: "bạch nguyệt quang",
		replacement: "người cũ"
	},
	{
		pattern: "tổng tài",
		replacement: "chủ cơ sở"
	},
	{
		pattern: "hào môn",
		replacement: "nhà giàu trong huyện"
	},
	{
		pattern: "ngôn tình",
		replacement: ""
	},
	{
		pattern: "nam thần",
		replacement: "anh thanh niên"
	},
	{
		pattern: "nữ thần",
		replacement: "cô gái"
	},
	{
		pattern: "thiếu gia",
		replacement: "con nhà khá giả"
	},
	{
		pattern: "công tử",
		replacement: "con nhà khá giả"
	},
	{
		pattern: "mỹ nữ",
		replacement: "cô gái"
	},
	{
		pattern: "soái ca",
		replacement: "chàng trai"
	},
	{
		pattern: "tập đoàn",
		replacement: "hợp tác xã"
	},
	{
		pattern: "ceo",
		replacement: "chủ cơ sở"
	},
	{
		pattern: "c.e.o",
		replacement: "chủ cơ sở"
	},
	{
		pattern: "绿茶",
		replacement: "người thứ ba"
	},
	{
		pattern: "白月光",
		replacement: "người cũ"
	},
	{
		pattern: "总裁",
		replacement: "chủ cơ sở"
	},
	{
		pattern: "豪门",
		replacement: "nhà giàu trong huyện"
	},
	{
		pattern: "言情",
		replacement: ""
	},
	{
		pattern: "男神",
		replacement: "anh thanh niên"
	},
	{
		pattern: "女神",
		replacement: "cô gái"
	},
	{
		pattern: "少爷",
		replacement: "con nhà khá giả"
	},
	{
		pattern: "公子",
		replacement: "con nhà khá giả"
	},
	{
		pattern: "美女",
		replacement: "cô gái"
	},
	{
		pattern: "帅哥",
		replacement: "chàng trai"
	},
	{
		pattern: "集团",
		replacement: "hợp tác xã"
	},
	{
		pattern: "霸总",
		replacement: "chủ cơ sở"
	},
	{
		pattern: "千金",
		replacement: "con nhà khá giả"
	},
	{
		pattern: "green tea",
		replacement: "người thứ ba"
	},
	{
		pattern: "white moonlight",
		replacement: "người cũ"
	},
	{
		pattern: "chaebol",
		replacement: "nhà giàu trong huyện"
	}
];
var DEFAULT_BLOCKED_KEYWORDS = DEFAULT_BLOCK_RULES.map((r) => r.pattern);
/** Foreign places / urban tropes → Vietnamese village setting. */
var PLACE_REPLACEMENTS = [
	["北京市", "xã Tân Phong, huyện Cai Lậy, tỉnh Tiền Giang"],
	["上海", "làng Đông Hồ, huyện Thuận Thành, tỉnh Bắc Ninh"],
	["上海市", "làng Đông Hồ, huyện Thuận Thành, tỉnh Bắc Ninh"],
	["深圳", "làng gốm Bát Tràng, huyện Gia Lâm, Hà Nội"],
	["广州市", "xã Mỹ Hòa, huyện Cái Bè, tỉnh Tiền Giang"],
	["广州", "xã Mỹ Hòa, huyện Cái Bè, tỉnh Tiền Giang"],
	["杭州", "làng Cự Đà, huyện Thanh Oai, Hà Nội"],
	["成都", "xã Quỳnh Đôi, huyện Quỳnh Lưu, tỉnh Nghệ An"],
	["重庆", "làng chài Gành Hào, huyện Đông Hải, Bạc Liêu"],
	["武汉", "xã Tân Lập, huyện Mộc Châu, tỉnh Sơn La"],
	["南京", "làng An Bình, huyện Long Hồ, tỉnh Vĩnh Long"],
	["苏州", "xã Phú Mỹ, huyện Phú Tân, tỉnh An Giang"],
	["天津", "làng Đường Lâm, thị xã Sơn Tây, Hà Nội"],
	["西安", "xã Nhơn Ái, huyện Phong Điền, Cần Thơ"],
	["长沙", "làng lụa Vạn Phúc, Hà Đông, Hà Nội"],
	["厦门", "xã Tam Thanh, thành phố Tam Kỳ, Quảng Nam"],
	["青岛", "làng rau Trà Quế, Hội An, Quảng Nam"],
	["北京", "xã Tân Phong, huyện Cai Lậy, tỉnh Tiền Giang"],
	["曼哈顿", "xóm trên, xã Tân Phong"],
	["纽约", "xã Hồng Hà, huyện Đan Phượng, Hà Nội"],
	["洛杉矶", "làng nghề Sơn Đồng, huyện Hoài Đức, Hà Nội"],
	["芝加哥", "xã Vĩnh Hải, huyện Ninh Hải, Ninh Thuận"],
	["伦敦", "làng cổ Phước Tích, huyện Phong Điền, Thừa Thiên Huế"],
	["巴黎", "làng hoa Sa Đéc, tỉnh Đồng Tháp"],
	["东京", "làng gốm Thanh Hà, Hội An, Quảng Nam"],
	["首尔", "xã Thới Sơn, thành phố Mỹ Tho, Tiền Giang"],
	["硅谷", "xóm thợ mộc"],
	["CBD", "chợ phiên"],
	["高档小区", "xóm nhà tường gạch"],
	["别墅", "nhà vườn sau rẫy"],
	["公寓", "nhà cấp bốn mái tôn"],
	["写字楼", "nhà văn hóa xã"],
	["办公室", "gian giữa nhà hợp tác xã"],
	["地铁", "xe đò huyện"],
	["豪车", "xe Dream đời mới"],
	["奔驰", "xe Dream"],
	["宝马", "xe SH cũ"],
	["特斯拉", "xe máy Wave Alpha"],
	["曼哈顿", "xóm trên"],
	["New York City", "xã Hồng Hà, huyện Đan Phượng, Hà Nội"],
	["New York", "xã Hồng Hà, huyện Đan Phượng, Hà Nội"],
	["NYC", "xã Hồng Hà"],
	["Los Angeles", "làng nghề Sơn Đồng, huyện Hoài Đức, Hà Nội"],
	["San Francisco", "làng chài Hàm Ninh, Phú Quốc, Kiên Giang"],
	["Chicago", "xã Vĩnh Hải, huyện Ninh Hải, Ninh Thuận"],
	["London", "làng cổ Phước Tích, huyện Phong Điền, Thừa Thiên Huế"],
	["Paris", "làng hoa Sa Đéc, tỉnh Đồng Tháp"],
	["Manhattan", "xóm trên, xã Tân Phong"],
	["Brooklyn", "xóm dưới, xã Tân Phong"],
	["Beverly Hills", "xóm nhà khá giả cuối xã"],
	["Silicon Valley", "xóm thợ mộc"],
	["Wall Street", "sạp lúa đầu chợ"],
	["the Hamptons", "vườn cây ăn trái cuối xã"],
	["apartment", "nhà cấp bốn"],
	["penthouse", "gác gỗ hai tầng"],
	["condo", "nhà cấp bốn"],
	["subway", "xe đò huyện"],
	["the office", "nhà hợp tác xã"],
	["Thanksgiving", "Tết"],
	["Christmas", "Tết"],
	["Black Friday", "phiên chợ Tết"]
];
var CHINESE_SURNAMES = [
	"张",
	"王",
	"李",
	"赵",
	"刘",
	"陈",
	"杨",
	"黄",
	"周",
	"吴",
	"徐",
	"孙",
	"胡",
	"朱",
	"高",
	"林",
	"何",
	"郭",
	"马",
	"罗",
	"梁",
	"宋",
	"郑",
	"谢",
	"韩",
	"唐",
	"冯",
	"于",
	"董",
	"萧",
	"程",
	"曹",
	"袁",
	"邓",
	"许",
	"傅",
	"沈",
	"曾",
	"彭",
	"吕",
	"苏",
	"卢",
	"蒋",
	"蔡",
	"贾",
	"丁",
	"魏",
	"薛",
	"叶",
	"阎",
	"余",
	"潘",
	"杜",
	"戴",
	"夏",
	"钟",
	"汪",
	"田",
	"任",
	"姜",
	"范",
	"方",
	"石",
	"姚",
	"谭",
	"廖",
	"邹",
	"熊",
	"金",
	"陆",
	"郝",
	"孔",
	"白",
	"崔",
	"康",
	"毛",
	"邱",
	"秦",
	"江",
	"史",
	"顾",
	"侯",
	"邵",
	"孟",
	"龙",
	"万",
	"段",
	"雷",
	"钱",
	"汤",
	"尹",
	"黎",
	"易",
	"常",
	"武",
	"乔",
	"贺",
	"赖",
	"龚",
	"文"
];
var ENGLISH_MALE = [
	"James",
	"John",
	"Robert",
	"Michael",
	"David",
	"William",
	"Richard",
	"Joseph",
	"Thomas",
	"Chris",
	"Christopher",
	"Daniel",
	"Matt",
	"Matthew",
	"Andrew",
	"Ryan",
	"Josh",
	"Joshua",
	"Kevin",
	"Brian",
	"Jason",
	"Justin",
	"Brandon",
	"Mark",
	"Paul",
	"Steve",
	"Steven",
	"Eric",
	"Alex",
	"Mike",
	"Tom",
	"Tim",
	"Nick",
	"Jake",
	"Ben",
	"Sam",
	"Adam",
	"Nathan",
	"Tyler",
	"Kyle",
	"Derek",
	"Greg",
	"Jeff",
	"Scott",
	"Brad",
	"Chad",
	"Tony",
	"Peter",
	"Henry",
	"Jack"
];
var ENGLISH_FEMALE = [
	"Mary",
	"Jennifer",
	"Linda",
	"Patricia",
	"Elizabeth",
	"Susan",
	"Jessica",
	"Sarah",
	"Karen",
	"Nancy",
	"Lisa",
	"Betty",
	"Margaret",
	"Sandra",
	"Ashley",
	"Emily",
	"Donna",
	"Michelle",
	"Dorothy",
	"Carol",
	"Amanda",
	"Melissa",
	"Deborah",
	"Stephanie",
	"Rebecca",
	"Sharon",
	"Laura",
	"Cynthia",
	"Amy",
	"Anna",
	"Angela",
	"Brenda",
	"Emma",
	"Olivia",
	"Sophia",
	"Isabella",
	"Mia",
	"Charlotte",
	"Amelia",
	"Harper",
	"Evelyn",
	"Abigail",
	"Ella",
	"Scarlett",
	"Grace",
	"Chloe",
	"Victoria",
	"Riley",
	"Aria",
	"Lily",
	"Hannah",
	"Natalie",
	"Zoe",
	"Leah",
	"Hazel",
	"Violet",
	"Stacy",
	"Stacey",
	"Megan",
	"Katie",
	"Rachel",
	"Lauren",
	"Heather",
	"Nicole",
	"Kelly",
	"Amber",
	"Crystal",
	"Tiffany"
];
var SURNAMES = [
	"Nguyễn",
	"Trần",
	"Lê",
	"Phạm",
	"Hoàng",
	"Huỳnh",
	"Phan",
	"Vũ",
	"Võ",
	"Đặng",
	"Bùi",
	"Đỗ",
	"Hồ",
	"Ngô",
	"Dương",
	"Lý",
	"Đinh",
	"Trịnh",
	"Đào",
	"Lương"
];
var MALE_GIVEN = [
	"Hùng",
	"Minh",
	"Đức",
	"Tuấn",
	"Nam",
	"Hải",
	"Phúc",
	"Long",
	"Khoa",
	"Bình",
	"Dũng",
	"Quang",
	"Thành",
	"Sơn",
	"Tài",
	"Lâm",
	"Khánh",
	"Phong",
	"Việt",
	"Cường",
	"Hoàng",
	"Tâm",
	"An",
	"Kiên",
	"Trung"
];
var FEMALE_GIVEN = [
	"Lan",
	"Mai",
	"Hoa",
	"Hương",
	"Ngọc",
	"Hồng",
	"Thảo",
	"Linh",
	"Yến",
	"Hà",
	"Trang",
	"Vy",
	"Nhung",
	"Diệu",
	"Thúy",
	"Oanh",
	"Tuyết",
	"Hạnh",
	"Quỳnh",
	"Giang",
	"My",
	"Châu",
	"Thư",
	"An",
	"Duyên"
];
var MIDDLE_MALE = [
	"Văn",
	"Hữu",
	"Đình",
	"Công",
	"Quốc"
];
var MIDDLE_FEMALE = [
	"Thị",
	"Ngọc",
	"Thu",
	"Kim",
	"Minh"
];
function fullName(surname, middle, given) {
	return `${surname} ${middle} ${given}`;
}
function pick(list, seed) {
	return list[Math.abs(seed) % list.length];
}
function maleName(seed) {
	return fullName(pick(SURNAMES, seed), pick(MIDDLE_MALE, seed >> 3), pick(MALE_GIVEN, seed >> 5));
}
function femaleName(seed) {
	return fullName(pick(SURNAMES, seed + 7), pick(MIDDLE_FEMALE, seed >> 2), pick(FEMALE_GIVEN, seed >> 4));
}
/** Real Vietnamese communes / villages used as replacement settings. */
var VILLAGES = [
	"xã Tân Phong, huyện Cai Lậy, tỉnh Tiền Giang",
	"làng Đông Hồ, huyện Thuận Thành, tỉnh Bắc Ninh",
	"làng gốm Bát Tràng, huyện Gia Lâm, Hà Nội",
	"xã Mỹ Hòa, huyện Cái Bè, tỉnh Tiền Giang",
	"làng Cự Đà, huyện Thanh Oai, Hà Nội",
	"xã Quỳnh Đôi, huyện Quỳnh Lưu, tỉnh Nghệ An",
	"làng chài Gành Hào, huyện Đông Hải, Bạc Liêu",
	"xã Tân Lập, huyện Mộc Châu, tỉnh Sơn La",
	"làng An Bình, huyện Long Hồ, tỉnh Vĩnh Long",
	"xã Phú Mỹ, huyện Phú Tân, tỉnh An Giang",
	"làng Đường Lâm, thị xã Sơn Tây, Hà Nội",
	"xã Nhơn Ái, huyện Phong Điền, Cần Thơ",
	"làng lụa Vạn Phúc, Hà Đông, Hà Nội",
	"xã Tam Thanh, thành phố Tam Kỳ, Quảng Nam",
	"làng rau Trà Quế, Hội An, Quảng Nam",
	"xã Hồng Hà, huyện Đan Phượng, Hà Nội",
	"làng nghề Sơn Đồng, huyện Hoài Đức, Hà Nội",
	"xã Vĩnh Hải, huyện Ninh Hải, Ninh Thuận",
	"làng chài Hàm Ninh, Phú Quốc, Kiên Giang",
	"xã Ia Púch, huyện Chư Prông, Gia Lai",
	"làng cổ Phước Tích, huyện Phong Điền, Thừa Thiên Huế",
	"xã Đại Đồng, huyện Thạch Thất, Hà Nội",
	"làng gốm Thanh Hà, Hội An, Quảng Nam",
	"xã Thới Sơn, thành phố Mỹ Tho, Tiền Giang",
	"làng hoa Sa Đéc, tỉnh Đồng Tháp"
];
function escapeRegExp(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function applyMap(text, pairs) {
	const hits = [];
	let out = text;
	const seen = /* @__PURE__ */ new Set();
	const sorted = [...pairs].sort((a, b) => b[0].length - a[0].length);
	for (const [from, to] of sorted) {
		if (!from || from === to) continue;
		const re = new RegExp(escapeRegExp(from), "gi");
		if (!re.test(out)) continue;
		re.lastIndex = 0;
		out = out.replace(re, to);
		const key = from.toLowerCase();
		if (!seen.has(key)) {
			seen.add(key);
			hits.push({
				original: from,
				localized: to
			});
		}
	}
	return {
		text: out,
		hits
	};
}
function extractChineseNames(text) {
	const found = /* @__PURE__ */ new Set();
	const surname = CHINESE_SURNAMES.join("");
	const re = new RegExp(`[${surname}][\u4e00-\u9fff]{1,2}`, "g");
	const skip = /* @__PURE__ */ new Set([
		"上海",
		"南京",
		"长沙",
		"青岛",
		"重庆",
		"东西",
		"自己",
		"什么",
		"可以",
		"因为",
		"所以",
		"但是",
		"如果",
		"已经",
		"还是",
		"一个",
		"我们",
		"他们",
		"你们",
		"这个",
		"那个",
		"时候",
		"现在",
		"今天",
		"明天",
		"昨天",
		"公司",
		"工作",
		"生活",
		"家庭",
		"孩子",
		"老婆",
		"老公",
		"丈夫",
		"妻子",
		"母亲",
		"父亲"
	]);
	let m;
	while (m = re.exec(text)) {
		const name = m[0];
		if (skip.has(name) || name.length < 2) continue;
		found.add(name);
	}
	return [...found];
}
function extractEnglishNames(text) {
	const male = [];
	const female = [];
	const seen = /* @__PURE__ */ new Set();
	for (const n of ENGLISH_MALE) if (new RegExp(`\\b${escapeRegExp(n)}\\b`, "g").test(text) && !seen.has(n.toLowerCase())) {
		seen.add(n.toLowerCase());
		male.push(n);
	}
	for (const n of ENGLISH_FEMALE) if (new RegExp(`\\b${escapeRegExp(n)}\\b`, "g").test(text) && !seen.has(n.toLowerCase())) {
		seen.add(n.toLowerCase());
		female.push(n);
	}
	return {
		male,
		female
	};
}
function localizeStory(title, content, options = {}) {
	const seed = options.seed ?? 17;
	const villages = options.extraVillages?.length ? [...VILLAGES, ...options.extraVillages] : VILLAGES;
	const namePairs = [];
	extractChineseNames(`${title}\n${content}`).forEach((n, i) => {
		const vn = /[娜芳丽娟敏静燕艳红梅雪玲云霞琴婷璐莹慧娟]/u.test(n) || i % 2 === 1 ? femaleName(seed + i * 13) : maleName(seed + i * 17);
		namePairs.push([n, vn]);
	});
	const en = extractEnglishNames(`${title}\n${content}`);
	en.male.forEach((n, i) => namePairs.push([n, maleName(seed + 80 + i * 11)]));
	en.female.forEach((n, i) => namePairs.push([n, femaleName(seed + 180 + i * 11)]));
	const placePairs = PLACE_REPLACEMENTS.map(([a, b]) => [a, b]);
	const fallbackVillage = villages[seed % villages.length];
	placePairs.push(["in the city", `ở ${fallbackVillage}`]);
	placePairs.push(["the city", fallbackVillage]);
	let workingTitle = title;
	let working = content;
	const names = applyMap(working, namePairs);
	working = names.text;
	const titleNames = applyMap(workingTitle, namePairs);
	workingTitle = titleNames.text;
	const places = applyMap(working, placePairs);
	working = places.text;
	const titlePlaces = applyMap(workingTitle, placePairs);
	workingTitle = titlePlaces.text;
	const rules = [
		...DEFAULT_BLOCK_RULES,
		...options.extraRules ?? [],
		...(options.extraBlocked ?? []).map((p) => ({
			pattern: p,
			replacement: ""
		}))
	].sort((a, b) => b.pattern.length - a.pattern.length);
	const blockedHits = [];
	for (const rule of rules) {
		const re = new RegExp(escapeRegExp(rule.pattern), "gi");
		if (re.test(working) || re.test(workingTitle)) {
			blockedHits.push(rule.pattern);
			re.lastIndex = 0;
			working = working.replace(re, rule.replacement);
			workingTitle = workingTitle.replace(re, rule.replacement);
		}
	}
	working = working.replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
	workingTitle = workingTitle.replace(/\s{2,}/g, " ").trim();
	const nameMap = dedupeEntries([...titleNames.hits, ...names.hits]);
	const placeMap = dedupeEntries([...titlePlaces.hits, ...places.hits]);
	return {
		titleLocalized: workingTitle || title,
		localizedContent: working,
		blockedHits: [...new Set(blockedHits)],
		nameMap,
		placeMap
	};
}
function dedupeEntries(entries) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const e of entries) {
		const k = e.original.toLowerCase();
		if (seen.has(k)) continue;
		seen.add(k);
		out.push(e);
	}
	return out;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function wordCount(text) {
	const trimmed = text.trim();
	if (!trimmed) return 0;
	return (trimmed.match(/[\u4e00-\u9fff]/g)?.length ?? 0) + trimmed.replace(/[\u4e00-\u9fff]/g, " ").split(/\s+/).filter(Boolean).length;
}
function formatDate(iso) {
	try {
		return new Intl.DateTimeFormat("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		}).format(new Date(iso));
	} catch {
		return iso;
	}
}
function todayStamp(d = /* @__PURE__ */ new Date()) {
	return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}
function uid(prefix = "st") {
	return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}
function downloadBlob(filename, content, mime) {
	const blob = new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
function stamp(opts) {
	const cleaned = cleanText(opts.raw);
	const loc = localizeStory(opts.title, cleaned, { seed: opts.id.length * 19 });
	const now = "2026-08-18T08:00:00.000Z";
	return {
		id: opts.id,
		source: opts.source,
		sourceUrl: opts.url,
		titleOriginal: opts.title,
		titleLocalized: opts.localizedTitle,
		rawContent: opts.raw.trim(),
		cleanedContent: cleaned,
		localizedContent: opts.localized.trim(),
		language: opts.language,
		status: "localized",
		blockedHits: loc.blockedHits,
		nameMap: loc.nameMap,
		placeMap: loc.placeMap,
		createdAt: now,
		updatedAt: now,
		tags: opts.tags,
		wordCount: wordCount(opts.localized),
		crawlNote: "Bản mẫu dựng sẵn — nguồn live có thể bị chặn hoặc cần cookie."
	};
}
var ZHIHU_RAW = `我叫李娜，嫁到北京已经六年。丈夫张伟是某集团的总裁，每天开车进出CBD的写字楼。他的白月光王芳突然成了公司新秘书，绿茶一杯接一杯送到张伟办公桌上。

婆婆住在我们的高档小区。她看我不顺眼，说我不会生儿子，只会花钱。有一天晚饭，王芳“碰巧”来送文件。婆婆拉着她的手说：“这才是豪门该有的儿媳。”

我当时端着碗，手在抖。张伟只是低头看手机，像一个路过的人。夜里我去阳台，北京的夜全是灯，可没有一盏是为我亮的。

第二天我回了娘家杭州。妈妈说，你可以忍，也可以走。我把婚纱照片从相册里抽出来，一张一张撕掉。那些照片里的我还以为嫁进豪门就是幸福。

后来我在杭州找了份普通工作。不再等那个总裁，也不再跟绿茶争。有人问我恨不恨。我说恨过，但恨太累。我只想过自己的日子。`;
var ZHIHU_VI = `Tôi tên Trần Thị Mai, lấy chồng về xã Tân Phong, huyện Cai Lậy, tỉnh Tiền Giang đã sáu năm. Chồng tôi, Nguyễn Văn Hùng, làm thủ quỹ hợp tác xã, ngày nào cũng chạy xe máy ra nhà văn hóa xã. Người cũ của anh — Phạm Thị Hương — đột nhiên về làm sổ sách, ngày ngày mang nước mía vào bàn làm việc của Hùng.

Mẹ chồng ở cùng xóm nhà tường gạch. Bà không ưa tôi, bảo tôi không sinh được trai, chỉ biết tiêu. Một bữa cơm chiều, Hương “tình cờ” mang giấy tờ qua. Bà nắm tay cô ấy: “Thế mới đúng con dâu nhà khá giả trong huyện.”

Tôi đang bưng chén, tay run. Hùng chỉ cúi nhìn điện thoại, như người đi ngang. Đêm ấy tôi ra sân phơi lúa. Đèn xóm sáng hết, không có ngọn nào vì tôi.

Hôm sau tôi về nhà mẹ ở làng Đông Hồ, huyện Thuận Thành, tỉnh Bắc Ninh. Má nói, con chịu được thì chịu, không thì về. Tôi rút ảnh ngày cưới, xé từng tấm. Trong ảnh, tôi tưởng lấy chồng nhà khá giả là hết khổ.

Sau này tôi xin phụ bán ở chợ phiên. Không đợi thủ quỹ nữa, cũng không tranh với người thứ ba. Có người hỏi tôi có hận không. Tôi nói hận rồi, nhưng hận mệt lắm. Tôi chỉ muốn sống ngày của mình.`;
var FOLK_RAW = `很久很久以前，苏州有个叫阿福的青年。他每天去田里干活，傍晚总会经过村口的老槐树。树上住着一只狐狸，修炼了三百年，化成一个穿青衣的姑娘。

姑娘说：“你每天给我留下一个馒头，我就让你的稻谷比别人多收三成。”阿福答应了。三年里，他真的富裕起来，娶了邻村的阿秀。

可阿秀发现丈夫总在树下说话，起了疑心。她带着剪刀去剪狐狸的尾巴。狐狸受伤逃进山里，临走留下一句话：“人心比狐狸精还厉害。”

从那以后，阿福的田再也长不出好稻子。他才明白，有些恩情，是不能用剪刀去量的。`;
var FOLK_VI = `Ngày xưa, ở xã Phú Mỹ, huyện Phú Tân, tỉnh An Giang, có chàng trai tên Lê Văn Phúc. Ngày nào Phúc cũng ra đồng, chiều về đều đi qua cây đa trước miếu. Trên cây có một hồ ly tu ba trăm năm, hóa thành cô gái áo bà ba màu chàm.

Cô nói: “Mỗi ngày anh để lại cho tôi một nắm xôi, tôi sẽ cho lúa nhà anh được hơn người ba phần.” Phúc nhận lời. Ba năm sau nhà khá giả, cưới cô gái xóm dưới tên Phạm Thị Hà.

Hà thấy chồng hay đứng gốc đa thì sinh nghi. Chị mang kéo ra cắt đuôi hồ ly. Hồ ly bị thương chạy lên rẫy, để lại một câu: “Lòng người còn hơn hồ ly.”

Từ đó ruộng nhà Phúc không lên lúa nữa. Anh mới hiểu: ơn nghĩa không đo bằng lưỡi kéo.`;
var GHOST_RAW = `长沙老巷里有一栋民国小楼，没人敢住。据说楼上的镜子里会走出一个女人，叫人跟她回家。

木匠老周不信邪，接了活去修楼。第一夜，他听见楼上有人梳头。第二夜，镜子里真的出现一张苍白的脸。女人说：“我等了八十年，只想有人叫我一声阿娘。”

老周把女儿的乳名告诉了镜子。第二天，镜子碎了，楼里的潮气散尽。有人问他怕不怕。他说：“鬼不可怕，被人忘记才可怕。”`;
var GHOST_VI = `Trong làng cổ Phước Tích, huyện Phong Điền, Thừa Thiên Huế, có căn nhà rường bỏ trống, không ai dám ở. Người ta bảo trong tấm gương gỗ mun sẽ bước ra một người đàn bà, gọi kẻ lạ về với mình.

Thợ mộc ông Tư không tin, nhận lời tu bổ. Đêm thứ nhất, ông nghe trên gác có tiếng chải đầu. Đêm thứ hai, gương hiện một khuôn mặt tái. Bà nói: “Tôi đợi tám mươi năm, chỉ muốn có người gọi một tiếng má.”

Ông Tư nói với gương tên cúng cơm của con gái. Sáng hôm sau gương vỡ, hơi ẩm trong nhà tan. Có người hỏi ông có sợ không. Ông bảo: “Ma không đáng sợ. Bị quên mới đáng sợ.”`;
var REDDIT_RAW = `AITA for refusing to host Thanksgiving at my apartment in New York after my mother-in-law called my wife a failure?

I (34M) and my wife Sarah (32F) live in a one-bedroom in Brooklyn. My mother, Linda, usually hosts, but this year she asked us to do it because she is remodeling her house in Manhattan.

Sarah has been working double shifts at the hospital. When Linda came over last weekend she looked at our table and said, "I guess some women just can't keep a home. Michael would have done better with his ex." She meant my white moonlight, Jessica, who now works as a CEO's assistant.

I told Linda she is not welcome in our apartment unless she apologizes. My brother says I am destroying the family over one comment. Sarah cried in the kitchen for an hour. I don't think I am the asshole, but the group chat is on fire.`;
var REDDIT_VI = `Tôi có độc không khi cấm mẹ không được tới nhà cấp bốn ăn Tết, sau khi bà gọi vợ tôi là đồ thất bại?

Tôi (34 tuổi) và vợ Trần Thị Lan (32) ở nhà cấp bốn xóm dưới, xã Tân Phong. Thường thì má tôi — bà Năm — đãi Tết, năm nay bà bảo vợ chồng tôi làm vì bà đang sửa nhà xóm trên.

Lan đang trực đôi ca ở trạm y tế xã. Cuối tuần bà Năm sang, nhìn mâm cơm rồi nói: “Có người đàn bà không biết giữ nhà. Hùng lấy người cũ thì khá hơn.” Bà muốn nói tới Phạm Thị Hương, nay làm sổ sách cho chủ cơ sở.

Tôi bảo bà Năm không bước chân vào nhà nếu chưa xin lỗi. Anh tôi nói tôi phá nhà vì một câu. Lan khóc trong bếp một tiếng đồng hồ. Tôi không nghĩ mình sai, nhưng nhóm Zalo họ hàng đang dậy sóng.`;
var FANQIE_RAW = `第一章 回乡

陈静在深圳待了十一年，在集团做秘书，天天给总裁送咖啡。那年冬天，父亲病了，她买了张火车票回到成都乡下。

村口的土路还是那样。弟弟陈磊在田边抽烟，说家里的地要被征，村长的少爷看上了这块地。陈静把高跟鞋换成交鞋，第一件事是去翻父亲的土地本。

村里有人笑她：“城里的美女也要来抢地？”她不说话。夜里她坐在老屋门槛上，听蛙鸣，忽然觉得深圳那些写字楼都像纸做的。

白月光也好，绿茶也好，都离这片稻田很远。她只想把地留下来。`;
var FANQIE_VI = `Chương một — Về quê

Lê Thị Hoa ở làng gốm Bát Tràng mười một năm, làm sổ sách hợp tác xã, ngày ngày bê nước trà cho chủ cơ sở. Mùa đông ấy ba ốm, chị mua vé xe đò về xã Quỳnh Đôi, huyện Quỳnh Lưu, tỉnh Nghệ An.

Đường đất đầu làng vẫn thế. Em trai Lê Văn Đức ngồi bờ ruộng hút thuốc, nói đất nhà sắp bị thu, con nhà khá giả của trưởng thôn để mắt tới. Hoa cởi dép cao, việc đầu tiên là mở sổ ruộng của ba.

Xóm có người cười: “Cô gái dưới tỉnh cũng về giành đất?” Chị không đáp. Đêm ngồi ngưỡng cửa nhà cấp bốn, nghe ếch, chợt thấy mấy gian nhà văn hóa xã nơi kia mỏng như giấy.

Người cũ cũng được, người thứ ba cũng được — đều cách xa đám lúa này. Chị chỉ muốn giữ đất.`;
function createSampleStories() {
	return [
		stamp({
			id: "sample_zhihu_01",
			source: "zhihu",
			title: "我的总裁丈夫和她的白月光",
			raw: ZHIHU_RAW,
			localizedTitle: "Chồng tôi và người cũ của anh ấy",
			localized: ZHIHU_VI,
			language: "zh",
			tags: [
				"mẹ chồng",
				"nàng dâu",
				"盐选"
			],
			url: "https://www.zhihu.com/xen/market/sample"
		}),
		stamp({
			id: "sample_660i_folk",
			source: "i660",
			title: "槐树下的青衣姑娘",
			raw: FOLK_RAW,
			localizedTitle: "Cô gái áo chàm dưới cây đa",
			localized: FOLK_VI,
			language: "zh",
			tags: ["民间故事", "cat_703"],
			url: "https://660i.com/story/cat_703"
		}),
		stamp({
			id: "sample_660i_ghost",
			source: "i660",
			title: "镜子里的阿娘",
			raw: GHOST_RAW,
			localizedTitle: "Người trong gương gỗ mun",
			localized: GHOST_VI,
			language: "zh",
			tags: ["鬼故事", "cat_710"],
			url: "https://660i.com/story/cat_710"
		}),
		stamp({
			id: "sample_reddit_01",
			source: "reddit_aita",
			title: "AITA for banning my mother from Thanksgiving?",
			raw: REDDIT_RAW,
			localizedTitle: "Tôi có độc không khi cấm mẹ ăn Tết ở nhà mình?",
			localized: REDDIT_VI,
			language: "en",
			tags: ["AITA", "gia đình"],
			url: "https://www.reddit.com/r/AmItheAsshole/"
		}),
		stamp({
			id: "sample_fanqie_01",
			source: "fanqie",
			title: "回乡 · 第一章",
			raw: FANQIE_RAW,
			localizedTitle: "Về quê · Chương một",
			localized: FANQIE_VI,
			language: "zh",
			tags: ["dài kỳ", "phần 1"],
			url: "https://fanqienovel.com/sample"
		})
	];
}
//#endregion
export { createSampleStories as a, localizeStory as c, uid as d, wordCount as f, cn as i, splitForAudio as l, applyFontMap as n, downloadBlob as o, cleanText as r, formatDate as s, DEFAULT_BLOCKED_KEYWORDS as t, todayStamp as u };
