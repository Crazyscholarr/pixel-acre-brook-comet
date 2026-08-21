import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_SETTINGS } from "@/lib/stories/defaults";
import { useStoryStore } from "@/lib/stories/store";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const settings = useStoryStore((s) => s.settings);
  const replaceSettings = useStoryStore((s) => s.replaceSettings);
  const resetSamples = useStoryStore((s) => s.resetSamples);
  const clearAll = useStoryStore((s) => s.clearAll);
  const [kw, setKw] = useState("");
  const [village, setVillage] = useState("");

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Cài đặt</h1>
        <p className="mt-1 text-sm text-muted">
          Cookie Zhihu chỉ dùng khi bạn bấm thu thập, lưu trên máy này, không đưa
          lên cơ sở dữ liệu dùng chung.
        </p>
      </header>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="font-semibold">Cookie Zhihu 盐选</h2>
        <Label htmlFor="cookie" className="mt-3 block text-xs text-muted">
          Dán chuỗi cookie đăng nhập
        </Label>
        <Textarea
          id="cookie"
          className="mt-1 min-h-24 font-mono text-xs"
          value={settings.sources.zhihu.cookie ?? ""}
          onChange={(e) =>
            replaceSettings({
              ...settings,
              sources: {
                ...settings.sources,
                zhihu: { ...settings.sources.zhihu, cookie: e.target.value },
              },
            })
          }
          placeholder="d_c0=…; z_c0=…"
        />
        <Label htmlFor="cols" className="mt-3 block text-xs text-muted">
          Cột / URL bài (mỗi dòng một link)
        </Label>
        <Textarea
          id="cols"
          className="mt-1 min-h-20"
          value={settings.sources.zhihu.columns ?? ""}
          onChange={(e) =>
            replaceSettings({
              ...settings,
              sources: {
                ...settings.sources,
                zhihu: { ...settings.sources.zhihu, columns: e.target.value },
              },
            })
          }
        />
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="font-semibold">Từ cấm / không hợp văn hóa</h2>
        <p className="mt-1 text-sm text-muted">
          Mặc định gồm trà xanh, bạch nguyệt quang, tổng tài, hào môn, ngôn tình,
          nam thần, nữ thần, CEO, tập đoàn, thiếu gia, công tử, mỹ nữ, soái ca.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {settings.blockedKeywords.map((k) => (
            <button
              key={k}
              type="button"
              className="rounded-full bg-fg/6 px-3 py-1 text-xs text-muted hover:bg-danger/10 hover:text-danger"
              onClick={() =>
                replaceSettings({
                  ...settings,
                  blockedKeywords: settings.blockedKeywords.filter((x) => x !== k),
                })
              }
            >
              {k} ×
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Input
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            placeholder="Thêm từ cấm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && kw.trim()) {
                replaceSettings({
                  ...settings,
                  blockedKeywords: [...settings.blockedKeywords, kw.trim()],
                });
                setKw("");
              }
            }}
          />
          <Button
            variant="secondary"
            onClick={() => {
              if (!kw.trim()) return;
              replaceSettings({
                ...settings,
                blockedKeywords: [...settings.blockedKeywords, kw.trim()],
              });
              setKw("");
            }}
          >
            Thêm
          </Button>
        </div>
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="font-semibold">Làng quê thêm vào</h2>
        <p className="mt-1 text-sm text-muted">
          Danh sách sẵn có dùng xã, huyện, tỉnh thật. Thêm địa danh bạn muốn ưu tiên.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {settings.extraVillages.map((v) => (
            <span key={v} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              {v}
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Input
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder="vd. xã Tân Hòa, huyện Châu Thành, Tiền Giang"
          />
          <Button
            variant="secondary"
            onClick={() => {
              if (!village.trim()) return;
              replaceSettings({
                ...settings,
                extraVillages: [...settings.extraVillages, village.trim()],
              });
              setVillage("");
            }}
          >
            Thêm
          </Button>
        </div>
        <Label htmlFor="seed" className="mt-4 block text-xs text-muted">
          Seed đặt tên (để tái lập cùng một bộ tên)
        </Label>
        <Input
          id="seed"
          type="number"
          className="mt-1 w-32"
          value={settings.seed}
          onChange={(e) =>
            replaceSettings({ ...settings, seed: Number(e.target.value) || 0 })
          }
        />
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="font-semibold">Kho dữ liệu</h2>
        <p className="mt-1 text-sm text-muted">
          Dữ liệu nằm trên trình duyệt này. Xuất file trước khi xóa.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              resetSamples();
              toast.success("Đã nạp lại năm truyện mẫu");
            }}
          >
            Nạp lại bản mẫu
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              replaceSettings(DEFAULT_SETTINGS);
              toast.success("Đã trả cài đặt về mặc định");
            }}
          >
            Reset cài đặt
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              clearAll();
              toast("Đã xóa kho trên máy này");
            }}
          >
            Xóa kho local
          </Button>
        </div>
      </section>
    </div>
  );
}
