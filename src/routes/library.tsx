import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { StoryCard } from "@/components/story-card";
import { useStoryStore } from "@/lib/stories/store";
import {
  SOURCE_IDS,
  SOURCE_META,
  STORY_STATUSES,
  STATUS_META,
  type SourceId,
  type StoryStatus,
} from "@/lib/stories/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/library")({ component: LibraryPage });

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-9 rounded-full px-3 text-sm font-medium transition-colors",
        active ? "bg-primary text-primary-fg" : "bg-fg/6 text-muted hover:bg-fg/10",
      )}
    >
      {children}
    </button>
  );
}

function LibraryPage() {
  const stories = useStoryStore((s) => s.stories);
  const [q, setQ] = useState("");
  const [source, setSource] = useState<SourceId | "all">("all");
  const [status, setStatus] = useState<StoryStatus | "all">("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return stories.filter((s) => {
      if (source !== "all" && s.source !== source) return false;
      if (status !== "all" && s.status !== status) return false;
      if (!query) return true;
      return (
        s.titleLocalized.toLowerCase().includes(query) ||
        s.titleOriginal.toLowerCase().includes(query) ||
        s.localizedContent.toLowerCase().includes(query) ||
        s.tags.some((t) => t.toLowerCase().includes(query))
      );
    });
  }, [stories, q, source, status]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Thư viện</h1>
        <p className="mt-1 text-sm text-muted">
          {filtered.length}/{stories.length} truyện
        </p>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm tiêu đề, nội dung, thẻ…"
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip active={source === "all"} onClick={() => setSource("all")}>
          Mọi nguồn
        </Chip>
        {SOURCE_IDS.map((id) => (
          <Chip key={id} active={source === id} onClick={() => setSource(id)}>
            {SOURCE_META[id].short}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Chip active={status === "all"} onClick={() => setStatus("all")}>
          Mọi trạng thái
        </Chip>
        {STORY_STATUSES.map((st) => (
          <Chip key={st} active={status === st} onClick={() => setStatus(st)}>
            {STATUS_META[st].label}
          </Chip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-surface px-5 py-12 text-center shadow-[var(--shadow-border)]">
          <p className="font-medium">Không có truyện khớp bộ lọc.</p>
          <p className="mt-1 text-sm text-muted">
            Thu thập nguồn mới hoặc xóa từ khóa tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </div>
      )}
    </div>
  );
}
