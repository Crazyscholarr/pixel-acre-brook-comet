export interface BlockRule {
  /** Matched case-insensitively; Chinese stays exact. */
  pattern: string;
  replacement: string;
}

export const DEFAULT_BLOCK_RULES: BlockRule[] = [
  { pattern: "trà xanh", replacement: "người thứ ba" },
  { pattern: "bạch nguyệt quang", replacement: "người cũ" },
  { pattern: "tổng tài", replacement: "chủ cơ sở" },
  { pattern: "hào môn", replacement: "nhà giàu trong huyện" },
  { pattern: "ngôn tình", replacement: "" },
  { pattern: "nam thần", replacement: "anh thanh niên" },
  { pattern: "nữ thần", replacement: "cô gái" },
  { pattern: "thiếu gia", replacement: "con nhà khá giả" },
  { pattern: "công tử", replacement: "con nhà khá giả" },
  { pattern: "mỹ nữ", replacement: "cô gái" },
  { pattern: "soái ca", replacement: "chàng trai" },
  { pattern: "tập đoàn", replacement: "hợp tác xã" },
  { pattern: "ceo", replacement: "chủ cơ sở" },
  { pattern: "c.e.o", replacement: "chủ cơ sở" },
  { pattern: "绿茶", replacement: "người thứ ba" },
  { pattern: "白月光", replacement: "người cũ" },
  { pattern: "总裁", replacement: "chủ cơ sở" },
  { pattern: "豪门", replacement: "nhà giàu trong huyện" },
  { pattern: "言情", replacement: "" },
  { pattern: "男神", replacement: "anh thanh niên" },
  { pattern: "女神", replacement: "cô gái" },
  { pattern: "少爷", replacement: "con nhà khá giả" },
  { pattern: "公子", replacement: "con nhà khá giả" },
  { pattern: "美女", replacement: "cô gái" },
  { pattern: "帅哥", replacement: "chàng trai" },
  { pattern: "集团", replacement: "hợp tác xã" },
  { pattern: "霸总", replacement: "chủ cơ sở" },
  { pattern: "千金", replacement: "con nhà khá giả" },
  { pattern: "green tea", replacement: "người thứ ba" },
  { pattern: "white moonlight", replacement: "người cũ" },
  { pattern: "chaebol", replacement: "nhà giàu trong huyện" },
];

export const DEFAULT_BLOCKED_KEYWORDS = DEFAULT_BLOCK_RULES.map((r) => r.pattern);
