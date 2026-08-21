import { createServerFn } from "@tanstack/react-start";

const SYSTEM = `Bạn là biên tập viên Việt hóa truyện cho audio kể chuyện làng quê Việt Nam.
Nhiệm vụ:
1. Dịch toàn bộ sang tiếng Việt tự nhiên nếu chưa phải tiếng Việt.
2. Đổi TẤT CẢ tên nhân vật sang tên Việt (họ + đệm + tên, hoặc bà Năm, ông Tư, bác Sáu...).
3. Đổi TẤT CẢ địa danh, thành phố, công ty, căn hộ sang làng quê Việt Nam THẬT (xã, huyện, tỉnh có thật).
4. Loại bỏ hoặc thay từ: trà xanh, bạch nguyệt quang, tổng tài, hào môn, ngôn tình, nam thần, nữ thần, CEO, tập đoàn, thiếu gia, công tử, mỹ nữ, soái ca, 绿茶, 白月光, 总裁, 豪门.
5. Bối cảnh: ruộng lúa, đình làng, chợ phiên, nhà cấp bốn, xe máy, hợp tác xã, bến đò. Không đô thị Trung Quốc/phương Tây.
6. Giữ cốt truyện, xung đột, cảm xúc, ngôi kể.
7. Chỉ trả về JSON thuần: {"title":"...","content":"...","nameMap":[{"original":"...","localized":"..."}],"placeMap":[{"original":"...","localized":"..."}]}
Không markdown.`;

export const deepLocalizeFn = createServerFn({ method: "POST" })
  .validator((input: { title: string; content: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI chưa sẵn sàng trên máy chủ này." };
    }
    const content = data.content.slice(0, 7000);
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.4,
        max_tokens: 3500,
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: `Tiêu đề: ${data.title}\n\nNội dung:\n${content}`,
          },
        ],
      }),
    });
    if (!res.ok) {
      return { ok: false as const, error: `AI trả về lỗi ${res.status}` };
    }
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { ok: false as const, error: "AI không trả về JSON hợp lệ." };
    }
    try {
      const parsed = JSON.parse(jsonMatch[0]) as {
        title?: string;
        content?: string;
        nameMap?: { original: string; localized: string }[];
        placeMap?: { original: string; localized: string }[];
      };
      if (!parsed.content) {
        return { ok: false as const, error: "AI không trả về nội dung." };
      }
      return {
        ok: true as const,
        title: parsed.title || data.title,
        content: parsed.content,
        nameMap: parsed.nameMap ?? [],
        placeMap: parsed.placeMap ?? [],
      };
    } catch {
      return { ok: false as const, error: "Không đọc được JSON từ AI." };
    }
  });
