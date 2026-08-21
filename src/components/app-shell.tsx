import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Download,
  FileDown,
  House,
  Library,
  Settings,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useStoryStore } from "@/lib/stories/store";

const NAV = [
  { to: "/", label: "Trang chủ", icon: House },
  { to: "/collect", label: "Thu thập", icon: Download },
  { to: "/library", label: "Thư viện", icon: Library },
  { to: "/export", label: "Xuất file", icon: FileDown },
  { to: "/settings", label: "Cài đặt", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hydrated = useStoryStore((s) => s.hydrated);

  useEffect(() => {
    void Promise.resolve(useStoryStore.persist.rehydrate()).finally(() => {
      useStoryStore.getState().setHydrated(true);
    });
  }, []);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col bg-primary text-primary-fg md:flex">
        <div className="flex items-center gap-2.5 px-5 pt-6 pb-8">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary-fg/15">
            <BookOpen className="size-4" strokeWidth={1.75} />
          </span>
          <div>
            <p className="font-semibold leading-tight tracking-tight">Làng Kể</p>
            <p className="text-[11px] text-primary-fg/70">Việt hóa truyện quê</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(`${item.to}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-fg/15 text-primary-fg"
                    : "text-primary-fg/75 hover:bg-primary-fg/8 hover:text-primary-fg",
                )}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="px-5 pb-5 text-[11px] leading-relaxed text-primary-fg/55">
          Bối cảnh mặc định: làng quê Việt Nam. Lọc trà xanh, tổng tài, hào môn.
        </p>
      </aside>

      <div className="md:pl-56">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-sm md:hidden">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <span className="font-semibold">Làng Kể</span>
          </div>
          {!hydrated ? (
            <span className="text-xs text-muted">Đang tải kho…</span>
          ) : null}
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-10">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden">
        {NAV.map((item) => {
          const active =
            item.to === "/"
              ? pathname === "/"
              : pathname === item.to || pathname.startsWith(`${item.to}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] font-medium",
                active ? "text-primary" : "text-muted",
              )}
            >
              <Icon className="size-5" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
