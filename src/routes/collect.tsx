import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { crawlSourceFn, importUrlFn } from "@/lib/server/crawl";
import { detectLanguage } from "@/lib/processors/translator";
import { draftToStory } from "@/lib/stories/pipeline";
import { useStoryStore } from "@/lib/stories/store";
import { SOURCE_META, type SourceId } from "@/lib/stories/types";
import { uid } from "@/lib/utils";

export const Route = createFileRoute("/collect")({ component: CollectPage });

const SOURCES: Exclude<SourceId, "manual">[] = [
  "zhihu",
  "i660",
  "fanqie",
  "reddit_aita",
];

function CollectPage() {
  const settings = useStoryStore((s) => s.settings);
  const replaceSettings = useStoryStore((s) => s.replaceSettings);
  const addStories = useStoryStore((s) => s.addStories);
  const [busy, setBusy] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [url, setUrl] = useState("");
  const [pasteTitle, setPasteTitle] = useState("");
  const [pasteBody, setPasteBody] = useState("");

  const pushLog = (line: string) =>
    setLog((prev) => [`${new Date().toLocaleTimeString("vi-VN")} · ${line}`, ...prev].slice(0, 24));

  async function runSource(source: Exclude<SourceId, "manual">) {
    const cfg = settings.sources[source];
    setBusy(source);
    pushLog(`Đang thu thập ${SOURCE_META[source].label}…`);
    try {
      const result = await crawlSourceFn({
        data: {
          source,
          maxItems: cfg.maxItems,
          cookie: settings.sources.zhihu.cookie,
          url:
            source === "zhihu"
              ? cfg.columns
              : source === "fanqie"
                ? cfg.books
                : undefined,
          categories: source === "i660" ? [703, 710] : undefined,
          sort: cfg.sort,
        },
      });
      const stories = result.drafts.map((d) => draftToStory(d, settings));
      addStories(stories);
      pushLog(
        `${result.message} Thêm ${stories.length} truyện${result.usedFallback ? " (bản mẫu)" : ""}.`,
      );
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
    for (const s of SOURCES) {
      if (settings.sources[s].enabled) await runSource(s);
    }
  }

  async function importLink() {
    if (!url.trim()) return;
    setBusy("url");
    pushLog(`Đang lấy ${url}…`);
    try {
      const result = await importUrlFn({
        data: { url: url.trim(), cookie: settings.sources.zhihu.cookie },
      });
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
    const story = draftToStory(
      {
        source: "manual",
        titleOriginal: pasteTitle.trim() || "Không tiêu đề",
        rawContent: pasteBody,
        language: detectLanguage(pasteBody),
        tags: ["nhập tay"],
      },
      settings,
    );
    addStories([{ ...story, id: uid("st") }]);
    toast.success("Đã Việt hóa bản dán tay");
    pushLog(`Nhập tay: ${story.titleLocalized}`);
    setPasteTitle("");
    setPasteBody("");
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Thu thập</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Bật nguồn, chạy từng cái hoặc cả lô. Nếu trang chặn máy chủ, kho vẫn
            nhận bản mẫu cùng thể loại để bạn so sánh và xuất.
          </p>
        </div>
        <Button onClick={() => void runAll()} disabled={Boolean(busy)}>
          {busy ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Chạy tất cả
        </Button>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {SOURCES.map((id) => {
          const cfg = settings.sources[id];
          const meta = SOURCE_META[id];
          return (
            <div
              key={id}
              className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{meta.label}</h2>
                  <p className="text-xs text-muted">
                    {meta.language} · {meta.kind}
                  </p>
                </div>
                <Switch
                  checked={cfg.enabled}
                  onCheckedChange={(v) =>
                    replaceSettings({
                      ...settings,
                      sources: {
                        ...settings.sources,
                        [id]: { ...cfg, enabled: v },
                      },
                    })
                  }
                  aria-label={`Bật ${meta.short}`}
                />
              </div>
              {id === "i660" ? (
                <p className="mt-3 text-xs text-muted">
                  Chỉ chuyên mục 民间故事 (703) và 鬼故事 (710).
                </p>
              ) : null}
              {id === "zhihu" ? (
                <p className="mt-3 text-xs text-muted">
                  盐选 cần cookie đăng nhập — dán ở Cài đặt.
                </p>
              ) : null}
              {id === "fanqie" ? (
                <div className="mt-3">
                  <Label htmlFor="fanqie-url" className="text-xs text-muted">
                    URL sách / chương
                  </Label>
                  <Input
                    id="fanqie-url"
                    className="mt-1"
                    placeholder="https://fanqienovel.com/page/…"
                    value={cfg.books ?? ""}
                    onChange={(e) =>
                      replaceSettings({
                        ...settings,
                        sources: {
                          ...settings.sources,
                          fanqie: { ...cfg, books: e.target.value },
                        },
                      })
                    }
                  />
                </div>
              ) : null}
              <div className="mt-4 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs text-muted">
                  Tối đa
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    value={cfg.maxItems}
                    onChange={(e) =>
                      replaceSettings({
                        ...settings,
                        sources: {
                          ...settings.sources,
                          [id]: {
                            ...cfg,
                            maxItems: Math.max(
                              1,
                              Math.min(12, Number(e.target.value) || 1),
                            ),
                          },
                        },
                      })
                    }
                    className="h-9 w-16 min-h-9"
                  />
                </label>
                <Button
                  size="sm"
                  disabled={!cfg.enabled || Boolean(busy)}
                  onClick={() => void runSource(id)}
                >
                  {busy === id ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : null}
                  Thu thập
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="font-semibold">Nhập từ liên kết</h2>
          <p className="mt-1 text-sm text-muted">
            Zhihu, 660i, Fanqie, Reddit hoặc trang bài viết bất kỳ.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
            />
            <Button
              variant="secondary"
              disabled={!url.trim() || Boolean(busy)}
              onClick={() => void importLink()}
            >
              Lấy bài
            </Button>
          </div>
        </div>
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="font-semibold">Dán văn bản</h2>
          <p className="mt-1 text-sm text-muted">
            Dịch (nếu cần) và Việt hóa ngay trên máy.
          </p>
          <Input
            className="mt-4"
            value={pasteTitle}
            onChange={(e) => setPasteTitle(e.target.value)}
            placeholder="Tiêu đề gốc"
          />
          <Textarea
            className="mt-2 min-h-28"
            value={pasteBody}
            onChange={(e) => setPasteBody(e.target.value)}
            placeholder="Dán nội dung truyện…"
          />
          <Button
            className="mt-3"
            variant="secondary"
            disabled={!pasteBody.trim()}
            onClick={importPaste}
          >
            Làm sạch và Việt hóa
          </Button>
        </div>
      </div>

      <section>
        <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">
          Nhật ký
        </h2>
        <div className="mt-2 max-h-48 overflow-auto rounded-xl bg-ink px-4 py-3 font-mono text-xs leading-relaxed text-primary-fg">
          {log.length === 0 ? (
            <p className="text-primary-fg/50">Chưa chạy lượt nào.</p>
          ) : (
            log.map((line) => <p key={line}>{line}</p>)
          )}
        </div>
      </section>
    </div>
  );
}
