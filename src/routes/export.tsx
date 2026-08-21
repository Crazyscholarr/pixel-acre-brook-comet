import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { storiesToCsv, storiesToTxt, storyToExportJson } from "@/lib/stories/pipeline";
import { useStoryStore } from "@/lib/stories/store";
import { SOURCE_META } from "@/lib/stories/types";
import { downloadBlob, todayStamp } from "@/lib/utils";

export const Route = createFileRoute("/export")({ component: ExportPage });

function ExportPage() {
  const stories = useStoryStore((s) => s.stories);
  const markStatus = useStoryStore((s) => s.markStatus);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setSelected((prev) => {
      const ids = stories.map((s) => s.id);
      if (!prev.length) return ids;
      const keep = prev.filter((id) => ids.includes(id));
      return keep.length ? keep : ids;
    });
  }, [stories]);

  const chosen = useMemo(
    () => stories.filter((s) => selected.includes(s.id)),
    [stories, selected],
  );

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function doExport(kind: "json" | "txt" | "csv") {
    if (!chosen.length) {
      toast.error("Chọn ít nhất một truyện");
      return;
    }
    const stamp = todayStamp();
    if (kind === "json") {
      downloadBlob(
        `stories_${stamp}.json`,
        JSON.stringify(storyToExportJson(chosen), null, 2),
        "application/json",
      );
    } else if (kind === "txt") {
      downloadBlob(`stories_${stamp}.txt`, storiesToTxt(chosen), "text/plain;charset=utf-8");
    } else {
      downloadBlob(`stories_${stamp}.csv`, storiesToCsv(chosen), "text/csv;charset=utf-8");
    }
    markStatus(
      chosen.map((s) => s.id),
      "exported",
    );
    toast.success(`Đã xuất ${chosen.length} truyện (${kind.toUpperCase()})`);
  }

  function exportEach() {
    if (!chosen.length) return;
    for (const s of chosen) {
      downloadBlob(
        `${s.id}.txt`,
        `${s.titleLocalized}\n\n${s.localizedContent}`,
        "text/plain;charset=utf-8",
      );
    }
    markStatus(
      chosen.map((s) => s.id),
      "exported",
    );
    toast.success(`Đã tải ${chosen.length} file riêng`);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Xuất dữ liệu</h1>
        <p className="mt-1 max-w-xl text-sm text-muted">
          File mang id, tiêu đề gốc và đã Việt hóa, nguồn, nội dung thô, bản làng
          quê, trạng thái — đúng khung nguyên liệu để viết lại.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => doExport("json")}>JSON</Button>
        <Button variant="secondary" onClick={() => doExport("txt")}>
          TXT
        </Button>
        <Button variant="secondary" onClick={() => doExport("csv")}>
          CSV
        </Button>
        <Button variant="outline" onClick={exportEach}>
          Từng file theo truyện
        </Button>
        <Button variant="ghost" onClick={() => setSelected(stories.map((s) => s.id))}>
          Chọn hết
        </Button>
        <Button variant="ghost" onClick={() => setSelected([])}>
          Bỏ chọn
        </Button>
      </div>

      <p className="text-sm text-muted">
        Đang chọn <span className="tabular-nums font-medium text-fg">{chosen.length}</span> /{" "}
        {stories.length}
      </p>

      <ul className="divide-y divide-border overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]">
        {stories.map((s) => (
          <li key={s.id} className="flex items-start gap-3 px-4 py-3">
            <Checkbox
              checked={selected.includes(s.id)}
              onCheckedChange={() => toggle(s.id)}
              className="mt-1"
              aria-label={`Chọn ${s.titleLocalized}`}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{s.titleLocalized}</p>
              <p className="truncate text-xs text-subtle">
                {SOURCE_META[s.source].short} · {s.wordCount} từ · {s.status}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
