import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eraser, FileDown, Languages, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatTile, StoryCard } from "@/components/story-card";
import { SOURCE_META, type SourceId } from "@/lib/stories/types";
import { useStoryStore } from "@/lib/stories/store";

export const Route = createFileRoute("/")({ component: Home });

const PIPELINE = [
  {
    icon: Upload,
    title: "Thu thập",
    body: "Zhihu, 660i (dân gian & ma), Fanqie, Reddit AITA — hoặc dán URL / văn bản.",
  },
  {
    icon: Eraser,
    title: "Làm sạch",
    body: "Gỡ HTML, quảng cáo, font chống copy Fanqie, cắt phần audio 1.5 giờ.",
  },
  {
    icon: Languages,
    title: "Việt hóa",
    body: "Đổi tên, địa danh sang làng quê Việt. Lọc trà xanh, tổng tài, hào môn.",
  },
  {
    icon: FileDown,
    title: "Xuất",
    body: "JSON, TXT, CSV — từng truyện hoặc cả kho, để viết lại và thu âm.",
  },
];

function Home() {
  const stories = useStoryStore((s) => s.stories);
  const localized = stories.filter(
    (s) => s.status === "localized" || s.status === "exported",
  ).length;
  const blocked = stories.reduce((n, s) => n + s.blockedHits.length, 0);
  const recent = stories.slice(0, 4);
  const bySource = (id: SourceId) => stories.filter((s) => s.source === id).length;

  return (
    <div className="space-y-10">
      <section className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
          Xưởng nguyên liệu
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Thu thập truyện. Kể lại bằng giọng làng quê.
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
          Làng Kể lấy truyện ngắn từ Zhihu, 660i, Fanqie và Reddit, rửa sạch chữ,
          đổi nhân vật và bối cảnh sang xã, huyện, tỉnh có thật ở Việt Nam — rồi
          xuất file để bạn viết lại.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/collect">
              Bắt đầu thu thập
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/library">Xem thư viện</Link>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Trong kho" value={stories.length} hint="truyện đã lưu" />
        <StatTile label="Đã Việt hóa" value={localized} hint="sẵn để viết lại" />
        <StatTile
          label="Từ bị lọc"
          value={blocked}
          hint="trà xanh, tổng tài…"
        />
        <StatTile
          label="Nguồn"
          value={4}
          hint="Zhihu · 660i · Fanqie · Reddit"
        />
      </section>

      <section>
        <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">
          Quy trình
        </h2>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          {PIPELINE.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <span className="text-xs tabular-nums text-subtle">0{i + 1}</span>
                </div>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">
            Mới trong kho
          </h2>
          <Link to="/library" className="text-sm font-medium text-primary">
            Tất cả
          </Link>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {recent.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-primary px-5 py-6 text-primary-fg md:px-8">
        <h2 className="font-semibold">Bốn nguồn, một bối cảnh</h2>
        <p className="mt-1 max-w-xl text-sm text-primary-fg/75">
          Zhihu mẹ chồng–nàng dâu, dân gian và ma 660i (chỉ cat 703 và 710),
          series Fanqie, mâu thuẫn Reddit AITA. Tất cả về ruộng, đình, chợ phiên.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
          {(["zhihu", "i660", "fanqie", "reddit_aita"] as const).map((id) => (
            <div key={id} className="rounded-lg bg-primary-fg/10 px-3 py-2">
              <p className="font-medium">{SOURCE_META[id].short}</p>
              <p className="text-xs text-primary-fg/70">
                {bySource(id)} truyện · {SOURCE_META[id].kind}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
