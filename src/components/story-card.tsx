import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SOURCE_META, STATUS_META, type Story } from "@/lib/stories/types";
import { cn, formatDate } from "@/lib/utils";

export function SourceBadge({ source }: { source: Story["source"] }) {
  return <Badge variant="default">{SOURCE_META[source].short}</Badge>;
}

export function StoryCard({ story }: { story: Story }) {
  return (
    <Link
      to="/stories/$id"
      params={{ id: story.id }}
      className="group block rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 hover:shadow-[var(--shadow-border-hover)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge source={story.source} />
          <Badge variant="muted">{STATUS_META[story.status].label}</Badge>
        </div>
        <ArrowRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5" />
      </div>
      <h3 className="mt-3 font-semibold leading-snug text-fg">
        {story.titleLocalized}
      </h3>
      <p className="mt-1 line-clamp-1 text-xs text-subtle">{story.titleOriginal}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
        {story.localizedContent}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-subtle">
        <span className="tabular-nums">{story.wordCount} từ</span>
        <span>{formatDate(story.updatedAt)}</span>
      </div>
    </Link>
  );
}

export function StatTile({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
        className,
      )}
    >
      <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}
