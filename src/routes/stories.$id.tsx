import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LoaderCircle, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { deepLocalizeFn } from "@/lib/server/localize-ai";
import { reprocessStory } from "@/lib/stories/pipeline";
import { useStoryStore } from "@/lib/stories/store";
import { SOURCE_META, STATUS_META } from "@/lib/stories/types";
import { downloadBlob, formatDate, wordCount } from "@/lib/utils";

export const Route = createFileRoute("/stories/$id")({ component: StoryDetail });

function StoryDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const story = useStoryStore((s) => s.stories.find((x) => x.id === id));
  const settings = useStoryStore((s) => s.settings);
  const updateStory = useStoryStore((s) => s.updateStory);
  const removeStory = useStoryStore((s) => s.removeStory);
  const [draft, setDraft] = useState(story?.localizedContent ?? "");
  const [aiBusy, setAiBusy] = useState(false);

  useEffect(() => {
    setDraft(story?.localizedContent ?? "");
  }, [story?.id, story?.localizedContent]);

  const hits = useMemo(() => {
    if (!story) return [];
    return story.blockedHits;
  }, [story]);

  if (!story) {
    return (
      <div className="rounded-xl bg-surface p-8 text-center shadow-[var(--shadow-border)]">
        <p className="font-medium">Không tìm thấy truyện.</p>
        <Button asChild variant="secondary" className="mt-4">
          <Link to="/library">Về thư viện</Link>
        </Button>
      </div>
    );
  }

  const current = story;

  function saveDraft() {
    updateStory(current.id, {
      localizedContent: draft,
      wordCount: wordCount(draft),
      status: "localized",
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
      const res = await deepLocalizeFn({
        data: {
          title: current.titleOriginal,
          content: current.cleanedContent || current.rawContent,
        },
      });
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
        notes: "Việt hóa sâu bằng AI",
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
      current.rawContent,
    ].join("\n");
    downloadBlob(
      `${current.titleLocalized.slice(0, 40).replace(/\s+/g, "_")}.txt`,
      body,
      "text/plain;charset=utf-8",
    );
    updateStory(current.id, { status: "exported" });
  }

  return (
    <div className="space-y-6">
      <Link
        to="/library"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-fg"
      >
        <ArrowLeft className="size-4" />
        Thư viện
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge>{SOURCE_META[story.source].short}</Badge>
          <Badge variant="muted">{STATUS_META[story.status].label}</Badge>
          <Badge variant="outline">{story.language.toUpperCase()}</Badge>
          {hits.map((h) => (
            <Badge key={h} variant="warn">
              lọc: {h}
            </Badge>
          ))}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {story.titleLocalized}
        </h1>
        <p className="text-sm text-subtle">{story.titleOriginal}</p>
        <p className="text-xs break-all text-subtle">
          <span className="tabular-nums">{story.wordCount}</span> từ ·{" "}
          {formatDate(story.updatedAt)}
          {story.sourceUrl ? ` · ${story.sourceUrl}` : ""}
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={rerun}>
          Việt hóa nhanh
        </Button>
        <Button onClick={() => void deepAi()} disabled={aiBusy}>
          {aiBusy ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Việt hóa sâu (AI)
        </Button>
        <Button variant="outline" onClick={saveDraft}>
          Lưu chỉnh sửa
        </Button>
        <Button variant="ink" onClick={exportOne}>
          Xuất TXT
        </Button>
        <Button
          variant="ghost"
          className="text-danger"
          onClick={() => {
            removeStory(story.id);
            toast("Đã xóa khỏi kho");
            void navigate({ to: "/library" });
          }}
        >
          <Trash2 className="size-4" />
          Xóa
        </Button>
      </div>

      <Tabs defaultValue="compare">
        <TabsList>
          <TabsTrigger value="compare">So sánh</TabsTrigger>
          <TabsTrigger value="local">Việt hóa</TabsTrigger>
          <TabsTrigger value="raw">Bản gốc</TabsTrigger>
          <TabsTrigger value="meta">Ánh xạ</TabsTrigger>
        </TabsList>
        <TabsContent value="compare">
          <div className="grid gap-3 md:grid-cols-2">
            <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
              <h2 className="text-xs font-medium tracking-wide text-muted uppercase">
                Gốc
              </h2>
              <p className="mt-3 font-serif text-[15px] leading-relaxed whitespace-pre-wrap">
                {story.rawContent}
              </p>
            </article>
            <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
              <h2 className="text-xs font-medium tracking-wide text-muted uppercase">
                Làng quê Việt
              </h2>
              <p className="mt-3 font-serif text-[15px] leading-relaxed whitespace-pre-wrap">
                {story.localizedContent}
              </p>
            </article>
          </div>
        </TabsContent>
        <TabsContent value="local">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-80 font-serif text-[15px] leading-relaxed"
          />
          <p className="mt-2 text-xs text-subtle">
            Sửa tay rồi bấm Lưu chỉnh sửa. <span className="tabular-nums">{wordCount(draft)}</span> từ.
          </p>
        </TabsContent>
        <TabsContent value="raw">
          <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
            <p className="font-serif text-[15px] leading-relaxed whitespace-pre-wrap">
              {story.cleanedContent || story.rawContent}
            </p>
          </article>
        </TabsContent>
        <TabsContent value="meta">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
              <h2 className="font-semibold">Tên nhân vật</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {story.nameMap.length === 0 ? (
                  <li className="text-muted">Chưa bắt được tên riêng.</li>
                ) : (
                  story.nameMap.map((n) => (
                    <li key={n.original} className="flex justify-between gap-3">
                      <span className="text-muted">{n.original}</span>
                      <span className="font-medium">{n.localized}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
              <h2 className="font-semibold">Địa danh / bối cảnh</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {story.placeMap.length === 0 ? (
                  <li className="text-muted">Chưa bắt được địa danh.</li>
                ) : (
                  story.placeMap.map((n) => (
                    <li key={n.original} className="flex justify-between gap-3">
                      <span className="text-muted">{n.original}</span>
                      <span className="text-right font-medium">{n.localized}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
          {story.crawlNote ? (
            <p className="mt-3 text-xs text-subtle">{story.crawlNote}</p>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
