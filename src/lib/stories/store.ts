import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SETTINGS } from "./defaults";
import { createSampleStories } from "./samples";
import type { AppSettings, Story, StoryStatus } from "./types";

interface StoryState {
  stories: Story[];
  settings: AppSettings;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  addStories: (incoming: Story[]) => void;
  updateStory: (id: string, patch: Partial<Story>) => void;
  removeStory: (id: string) => void;
  markStatus: (ids: string[], status: StoryStatus) => void;
  replaceSettings: (settings: AppSettings) => void;
  resetSamples: () => void;
  clearAll: () => void;
}

export const useStoryStore = create<StoryState>()(
  persist(
    (set, get) => ({
      stories: createSampleStories(),
      settings: DEFAULT_SETTINGS,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      addStories: (incoming) => {
        const existing = new Set(
          get().stories.map((s) => `${s.source}|${s.titleOriginal}|${s.rawContent.slice(0, 80)}`),
        );
        const fresh = incoming.filter(
          (s) =>
            !existing.has(
              `${s.source}|${s.titleOriginal}|${s.rawContent.slice(0, 80)}`,
            ),
        );
        if (!fresh.length) return;
        set({ stories: [...fresh, ...get().stories] });
      },
      updateStory: (id, patch) =>
        set({
          stories: get().stories.map((s) =>
            s.id === id
              ? { ...s, ...patch, updatedAt: new Date().toISOString() }
              : s,
          ),
        }),
      removeStory: (id) =>
        set({ stories: get().stories.filter((s) => s.id !== id) }),
      markStatus: (ids, status) => {
        const setIds = new Set(ids);
        set({
          stories: get().stories.map((s) =>
            setIds.has(s.id)
              ? { ...s, status, updatedAt: new Date().toISOString() }
              : s,
          ),
        });
      },
      replaceSettings: (settings) => set({ settings }),
      resetSamples: () => set({ stories: createSampleStories() }),
      clearAll: () => set({ stories: [] }),
    }),
    {
      name: "lang-ke-library",
      skipHydration: true,
      partialize: (s) => ({ stories: s.stories, settings: s.settings }),
    },
  ),
);
